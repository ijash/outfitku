const auth = require('../middleware/auth');
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require('config');
const multer = require("multer");
const _ = require('lodash');
const { User, validate, validatePict } = require('../models/user');
const { Designer } = require('../models/designer');

const path = `${config.get('saveImg')}users/`

const storage = multer.diskStorage({
  destination: function(req, file, cb) { // define target path
    if (!fs.existsSync(`${path}/${req.user._id}`)) {
      fs.mkdirSync(`${path}/${req.user._id}`)
    }
    cb(null, `${path}/${req.user._id}`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname.trim()}`); // define saved file name
    // cb(null, `test.jpg`); // define saved file name
  }
});

const upload = multer({ storage: storage }); // use limit: {fileSize : 1024 * 1024 * 5  to define max fileSize}

router.get('/', auth, async (req, res) => {
  const result = await User.find()
    .select('-__v')
    .sort({ name: 1 });

  res.send(result);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });

  if (user) return res.status(400).send('Phone/email already registered');

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'birthDate', 'phone', 'address', 'sex']));

  user.validatePhone();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/profile/picture', [auth, upload.single("profPict")], async (req, res) => {
  const { error } = validatePict(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(req.user._id, {
    profPict: req.file.originalname.trim()
  }, { new: true });
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});

router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');
  res.send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -__v');
  if (!user) return res.status(404).send('User with the given id not found')
  res.send(user);
});

router.delete('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).send('User with the given id not found');

  if (!(req.params.id == req.user._id)) return res.status(403).send('cannot delete other user.');

  const deletedUser = await User.findByIdAndRemove(req.params.id);

  await Designer.updateMany({ 'account.maintainers': { $elemMatch: { _id: req.params.id } } }, { $pull: { 'account.maintainers': { _id: req.params.id } } }, );

  res.send(`user ${deletedUser.name} with ID: ${deletedUser._id} successfully deleted`);

});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!(req.params.id == req.user._id)) return res.status(403).send('cannot modify other user.');
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    birthDate: req.body.birthDate,
    phone: req.body.phone,
    address: req.body.address,
    sex: req.body.sex,
    bodyMeasurement: req.body.bodyMeasurement,
  }, { new: true });
  if (!user) return res.status(404).send('The user with the given ID was not found.');

  res.send(user);
});


module.exports = router;