const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Designer, validate, validateMaintainer } = require('../models/designer');
const { User } = require('../models/user');
const { Category } = require('../models/category');

router.get('/', async (req, res) => {

    //TO DO: exclude mantainer if empty
    const designers = await Designer.find()
        .select('-__v')
        .sort({ name: 1 });
    res.send(designers)
});

router.get('/:id', async (req, res) => {

    //TO DO: exclude mantainer if empty
    const designer = await Designer.findById(req.params.id).select('-__v');
    res.send(designer)
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const owner = await User.findById(req.user._id);
    if (!owner) return res.status(404).send('no user found with the given ID');

    const category = await Category.find({ '_id': { $in: req.body.expertise } }).select('name -_id')
    if (category.length < 1) return res.status(404).send('no category found with the given ID');

    const businessAccount = await Designer.findOne({ "account.owner._id": owner._id });
    if (businessAccount) return res.status(400).send('user may own only one business account.');

    //TO DO: give 'not found' warning for wrong maintainer ID
    const maintainers = await User.find({ '_id': { $in: req.body.maintainerId } }).select('_id name')

    const designer = new Designer({
        businessName: req.body.businessName,
        businessAddress: req.body.businessAddress,
        businessEmail: req.body.businessEmail,
        account: {
            owner: owner,
            maintainers: maintainers
        },
        expertise: category
    })

    await designer.save();

    res.send(designer)
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).send('No designer found with the given ID');

    if (!(designer.account.owner._id == req.user._id)) return res.status(403).send('Unauthorized to modify this business');


    const updater = {
        businessName: req.body.businessName,
        picture: req.body.picture,
        businessAddress: req.body.businessAddress,
        businessEmail: req.body.businessEmail,
    }

    Object.assign(designer, updater);
    const result = await designer.save();
    return res.send(result);

});
//DONE: add route post /:id/maintainer
router.post('/:id/maintainers', auth, async (req, res) => {
    const { error } = validateMaintainer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).send('No designer found with the given ID');

    if (!(designer.account.owner._id == req.user._id)) return res.status(403).send('Unauthorized to modify this business');

    let maintainer = await User.findById(req.body.id);
    if (!maintainer) return res.status(404).send('no user found with the given ID');

    maintainer = _.pick(maintainer, ['_id', 'name'])
    const isDuplicate = designer.account.maintainers.find(foundMaintainer => {
        if (foundMaintainer._id.equals(maintainer._id)) return true;
        return false;
    });
    if (isDuplicate) return res.status(409).send('duplicate entry not allowed')

    designer.account.maintainers.push(_.pick(maintainer, ['_id', 'name']))

    designer.save();

    res.send(designer.account.maintainers)
})
//DONE: add route delete /:id/maintainer
router.delete('/:id/maintainers', auth, async (req, res) => {
    const { error } = validateMaintainer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).send('No designer found with the given ID');

    if (!(designer.account.owner._id == req.user._id)) return res.status(403).send('Unauthorized to modify this business');

    let maintainer = designer.account.maintainers.find(query => {
        return query._id.equals(req.body.id)
    })
    if (!maintainer) return res.status(404).send('no maintainer found with the given ID');

    designer.account.maintainers.pull(_.pick(maintainer, ['_id', 'name']))

    designer.save();

    res.send(maintainer)
})

//TO DO: add route /:id/picture

router.delete('/:id', auth, async (req, res) => {
    const designer = await Designer.findById(req.params.id);

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (!designer) return res.status(404).send('No designer found with the given ID');

    if (!(designer.account.owner._id == req.user._id)) return res.status(403).send('Unauthorized to remove this business');

    const deletedDesigner = await Designer.findByIdAndRemove(req.params.id);

    res.send(`Business Account with ${deletedDesigner.name} with ID: ${deletedDesigner._id} successfully deleted : ${deletedDesigner}`);
});

module.exports = router;