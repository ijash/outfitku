const auth = require('../middleware/auth');
const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User, validate } = require('../models/user');

router.get('/', auth, async (req, res) => {
  console.log('fill in with task....')
  const result = await User.find();
  const users = _.omit(result, ['__v', ])
  res.send(users);
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

module.exports = router;