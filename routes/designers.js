const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Designer, validate } = require('../models/designer');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userOwner = await User.findById(req.body.userOwnerId);
  let val = req.body.userMaintainerId


  let maintainers = await User.find({ '_id': { $in: val } }).select('_id name')

  let designer = new Designer({
    businessName: req.body.businessName,
    businessAddress: req.body.businessAddress,
    businessEmail: req.body.businessEmail,
    account: {
      owner: userOwner,
      maintainers: maintainers
    },
    expertise: req.body.expertise
  })

  await designer.save();

  res.send(designer.account)
});

module.exports = router;