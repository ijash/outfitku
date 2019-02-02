const auth = require('../middleware/auth');
const fs = require('fs');
const config = require('config');
const multer = require("multer");
const { Item, validate } = require('../models/item');
const { Designer } = require('../models/designer');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

const path = `${config.get('saveImg')}items/`

const storage = multer.diskStorage({
  destination: function(req, file, cb) { // define target path
    if (!fs.existsSync(`${path}/${req.params.id}`)) {
      fs.mkdirSync(`${path}/${req.params.id}`)
    }
    cb(null, `${path}/${req.params.id}`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname.trim()}`); // define saved file name
    // cb(null, `test.jpg`); // define saved file name
  }
});

const upload = multer({ storage: storage }); // use limit: {fileSize: to define max fileSize}

// upload.array('image') req.files

router.get('/', /* auth, */ async (req, res) => {
  // TO DO...........
  console.log('fill in with task....')
  res.send('work in progress..........')
});

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send('no user found with the given ID');

  const designer = await Designer.findById(req.body.designer);
  if (!designer) return res.status(404).send('no designer found with the given ID');

  const category = await Category.findById(req.body.category).select('name -_id');
  if (!category) return res.status(404).send('no category found with the given ID');

  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    testimonial: {
      name: user,
      comment: req.body.comment
    },
    designer: designer,
    category: category
  })

  await item.save();

  res.send(item)
});

module.exports = router;