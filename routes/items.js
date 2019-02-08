const auth = require('../middleware/auth');
const fs = require('fs');
const config = require('config');
const multer = require("multer");
const { Item, validate, validateTesti, validateImage } = require('../models/item');
const { Designer } = require('../models/designer');
const { Category } = require('../models/category');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

const path = `${config.get('saveImg')}items/`

router.get('/', /* auth, */ async (req, res) => {
  // TO DO...........
  console.log('fill in with task....')
  res.send('work in progress..........')
});

router.post('/', auth, async (req, res) => {

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
      name: user.name,
      comment: req.body.comment
    },
    designer: designer,
    category: category
  })

  await item.save();

  if (!fs.existsSync(`${path}${item._id}`)) {
    fs.mkdirSync(`${path}${item._id}`)
  }

  res.send(item)
});

router.post('/:id/image', auth, async (req, res) => {

  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const item = await Item.findById(req.params.id)
  if (!item) return res.status(404).send("item not found")

  let storageMI = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/mainImage`)) {
        fs.mkdirSync(`${path}${req.params.id}/mainImage`)
      }
      cb(null, `${path}${req.params.id}/mainImage`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let storageI = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/images`)) {
        fs.mkdirSync(`${path}${req.params.id}/images`)
      }
      cb(null, `${path}${req.params.id}/images`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let uploadMI = multer({ storage: storageMI }).any();

  let uploadI = multer({ storage: storageI }).any();

  const upload = async function() {
    uploadMI(req, res, async function(err) {
      if (err) {
        return res.end("Error uploading file.");
      } else {
        const image = await Item.findByIdAndUpdate(req.params.id, {
          image: {
            mainImage: req.files[0].originalname
          }
        }, { new: true, upsert: true });
      }
    });
    uploadI(req, res, async function(err) {
      if (err) {
        console.log(err);
        return res.end("Error uploading file.");
      } else {
        let img = []

        for (i in req.files) {
          img.push(req.files[i].originalname)
        }

        const image = await Item.findByIdAndUpdate(req.params.id, {
          image: {
            mainImage: req.files[0].originalname,
            images: img
          }
        }, { new: true, upsert: true });
      }
    });
    res.send('upload successfully')
  }
  upload()
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validateTesti(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const item = await Item.findById(req.params.id)

  if (!item) return res.status(404).send("item not found");

  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).send('no user found with the given ID');

  const testimonial = {
    name: user.name,
    comment: req.body.comment
  }

  item.testimonial.push(testimonial) //DONE: things to do as user
  await item.save()
  res.send(item)

});

module.exports = router;