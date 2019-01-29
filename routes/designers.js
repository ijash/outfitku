const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Designer, validate } = require('../models/designer');
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

    const owner = await User.findById(req.body.ownerId);
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

module.exports = router;