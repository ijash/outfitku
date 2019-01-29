const auth = require('../middleware/auth');
const { Item, validate } = require('../models/item');
const { Designer } = require('../models/designer');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', /* auth, */ async (req, res) => {
  // TO DO...........
  console.log('fill in with task....')
  res.send('work in progress..........')
});

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const designer = await Designer.findById(req.body.designer);
  if (!designer) return res.status(404).send('no designer found with the given ID');

  const category = await Category.findById(req.body.category).select('name -_id');
  if (!category) return res.status(404).send('no category found with the given ID');

  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    designer: designer,
    category: category
  })

  await item.save();

  res.send(item)
});

module.exports = router;