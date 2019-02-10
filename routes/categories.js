const express = require('express');
const config = require('config');
const fs = require('fs')
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const { Category, validate } = require('../models/category');
const multer = require("multer");
const _ = require('lodash');
const router = express.Router();

const path = `${config.get('saveImg')}categories/`

const storage = multer.diskStorage({
  destination: function (req, file, cb) { // define target path
    if (!fs.existsSync(`${path}`)) {
      fs.mkdirSync(`${path}`)
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.name.trim()}.jpg`); // define saved file name
  }
});

const upload = multer({ storage: storage }); // use limit: {fileSize: to define max fileSize}

router.get('/', async (req, res) => {
  const category = await Category.find().sort({ name: 1 });
  res.send(category)
});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log(category.mainImage);
  res.send(category)
});

router.post('/', [auth, upload.single("mainImage")], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new category");

  const isDuplicate = await Category.findOne({ name: req.body.name.trim() })
  if (isDuplicate) return res.status(409).send('cannot insert duplicated entry, conflicting with an existing category.')


  const category = new Category({
    name: req.body.name.trim(),
    mainImage: req.file.filename
  });

  await category.save();
  res.send(category)
});

router.delete('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new category");

  let category = await Category.findOne({ name: req.body.name.trim() })
  if (!category) return res.status(404).send('No category found with the given name');

  category = await Category.findOneAndDelete({ name: req.body.name.trim() })

  res.send(category)
});

module.exports = router;