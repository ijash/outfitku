const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/user');
const { Category, validate } = require('../models/category');
const fs = require('fs');
const _ = require('lodash');

router.get('/', async (req, res) => {
  const category = await Category.find();
  res.send(category)
});

router.get('/:id', async (req, res) => {
  const category = await Category.findById(req.params.id);

  var img = new Buffer.from(category.mainImage, "base64")

  await fs.writeFile("public/img/test.jpg", img, function(err) {})

  res.send(category.name)
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new category");

  const isDuplicate = await Category.findOne({ name: req.body.name.trim() })
  if (isDuplicate) return res.status(409).send('cannot insert duplicated entry, conflicting with an existing category.')

  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
  }

  var imgBuffer = base64_encode('public/img/ship3.jpg')

  const category = new Category({
    name: req.body.name,
    mainImage: imgBuffer
  });

  await category.save();
  res.send(category.name)
});

router.delete('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select('name isAdmin')
  if (!user.isAdmin) return res.status(403).send("Unauthorized to add new category");

  let category = await Category.findOne({ name: req.body.name.trim() })
  if (!category) return res.status(404).send('No category found with the given name');

  category = await Category.findOneAndRemove({ name: req.body.name.trim() })

  res.send(category)
});

module.exports = router;