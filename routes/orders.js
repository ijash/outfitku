const auth = require('../middleware/auth');
const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const config = require('config');
const multer = require("multer");
const { Order, validate, validateImage } = require('../models/order')
const { User } = require('../models/user');
const { Category } = require('../models/category');
const { Message } = require('../models/message');
const { Designer } = require('../models/designer');
const router = express.Router();

const path = `${config.get('saveImg')}orders/`

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

router.get('/', auth, async (req, res) => {
  const order = await Order.find()
    .select('-__v')
    .sort({ dateIssued: 1 });
  res.send(order)
});

router.get('/:id', auth, async (req, res) => {
  // find user
  // validate user
  // find designer
  // validate designer
  // find order
  // validate designer
  // validate user by comparing with current order.user OR current designer.owner to see if the user is the owner or buyer. others can't see or modify.

  // edit the order

  // send status
  res.send('work in progress..........')
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get user
  const user = await User.findById(req.user._id).select('name');
  //check user
  if (!user) return res.status(404).send("user not found");
  //get category
  const category = await Category.findById(req.body.category).select('name');
  //check category
  if (!category) return res.status(404).send("category not found");
  //get designer
  const designer = await Designer.findById(req.body.designer).select('businessName account.owner._id');
  //check designer
  if (!designer) return res.status(404).send('designer not found');
  // check to not buy on own shop
  if (designer.account.owner._id.equals(user._id)) return res.status(404).send('cannot issue an order as an owner.');

  //set order init
  const order = new Order({
    user: user,
    designer: designer,
    category: category,
    price: {
      initial: req.body.initial
    },
    dueDate: req.body.dueDate
  })
  // order save
  await order.save();

  if (!fs.existsSync(`${path}${order._id}`)) {
    fs.mkdirSync(`${path}${order._id}`)
  }

  res.send(order)
});

router.post('/:id/image/proposition', auth, async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get order
  const order = await Order.findById(req.params.id).select('image user');
  if (!order) return res.status(404).send("order not found")
  //get user
  const user = await User.findById(req.user._id);
  //check user
  if (!user._id.equals(order.user._id)) return res.status(403).send('Unauthorized to modify this order');

  let storage = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/proposition`)) {
        fs.mkdirSync(`${path}${req.params.id}/proposition`)
      }
      cb(null, `${path}${req.params.id}/proposition`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let upload = multer({ storage: storage }).any();

  upload(req, res, async function(err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      const image = await Order.findByIdAndUpdate(req.params.id, {
        image: {
          proposition: req.files[0].originalname,
          design: order.image.design,
          revision: order.image.revision,
          specimen: order.image.specimen,
          result: order.image.result
        }
      }, { new: true, upsert: true });
      res.send(image)
    };
  });
});

router.post('/:id/image/design', auth, async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get order
  let order = await Order.findById(req.params.id).select('image user');
  if (!order) return res.status(404).send("order not found")
  //get user
  const user = await User.findById(req.user._id);
  //check user
  if (!user._id.equals(order.user._id)) return res.status(403).send('Unauthorized to modify this order');

  let storage = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/design`)) {
        fs.mkdirSync(`${path}${req.params.id}/design`)
      }
      cb(null, `${path}${req.params.id}/design`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let upload = multer({ storage: storage }).any();

  upload(req, res, async function(err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      let img = []

      for (i in req.files) {
        img.push(req.files[i].originalname)
      }

      const image = await Order.findByIdAndUpdate(req.params.id, {
        image: {
          proposition: order.image.proposition,
          design: img,
          revision: order.image.revision,
          specimen: order.image.specimen,
          result: order.image.result
        }
      }, { new: true, upsert: true });
      res.send(image)
    }
  });
});

router.post('/:id/image/revision', auth, async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get order
  let order = await Order.findById(req.params.id).select('image user');
  if (!order) return res.status(404).send("order not found")
  //get user
  const user = await User.findById(req.user._id);
  //check user
  if (!user._id.equals(order.user._id)) return res.status(403).send('Unauthorized to modify this order');

  let storage = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/revision`)) {
        fs.mkdirSync(`${path}${req.params.id}/revision`)
      }
      cb(null, `${path}${req.params.id}/revision`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let upload = multer({ storage: storage }).any();

  upload(req, res, async function(err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      let img = []

      for (i in req.files) {
        img.push(req.files[i].originalname)
      }

      const image = await Order.findByIdAndUpdate(req.params.id, {
        image: {
          proposition: order.image.proposition,
          design: order.image.design,
          revision: img,
          specimen: order.image.specimen,
          result: order.image.result
        }
      }, { new: true, upsert: true });
      res.send(image)
    }
  });
});

router.post('/:id/image/specimen', auth, async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get order
  let order = await Order.findById(req.params.id).select('image user');
  if (!order) return res.status(404).send("order not found")
  //get user
  const user = await User.findById(req.user._id);
  //check user
  if (!user._id.equals(order.user._id)) return res.status(403).send('Unauthorized to modify this order');

  let storage = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/specimen`)) {
        fs.mkdirSync(`${path}${req.params.id}/specimen`)
      }
      cb(null, `${path}${req.params.id}/specimen`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let upload = multer({ storage: storage }).any();

  upload(req, res, async function(err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      let img = []

      for (i in req.files) {
        img.push(req.files[i].originalname)
      }

      const image = await Order.findByIdAndUpdate(req.params.id, {
        image: {
          proposition: order.image.proposition,
          design: order.image.design,
          revision: order.image.revision,
          specimen: img,
          result: order.image.result
        }
      }, { new: true, upsert: true });
      res.send(image)
    }
  });
});

router.post('/:id/image/result', auth, async (req, res) => {
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //get order
  let order = await Order.findById(req.params.id).select('image user');
  if (!order) return res.status(404).send("order not found")
  //get user
  const user = await User.findById(req.user._id);
  //check user
  if (!user._id.equals(order.user._id)) return res.status(403).send('Unauthorized to modify this order');

  let storage = multer.diskStorage({
    destination: function(req, file, cb) { // define target path
      if (!fs.existsSync(`${path}${req.params.id}/result`)) {
        fs.mkdirSync(`${path}${req.params.id}/result`)
      }
      cb(null, `${path}${req.params.id}/result`);
    },
    filename: function(req, file, cb) {
      cb(null, `${file.originalname.trim()}`); // define saved file name
    }
  });

  let upload = multer({ storage: storage }).any();

  upload(req, res, async function(err) {
    if (err) {
      return res.end("Error uploading file.");
    } else {
      let img = []

      for (i in req.files) {
        img.push(req.files[i].originalname)
      }

      const image = await Order.findByIdAndUpdate(req.params.id, {
        image: {
          proposition: order.image.proposition,
          design: order.image.design,
          revision: order.image.revision,
          specimen: order.image.specimen,
          result: img
        }
      }, { new: true, upsert: true });
      res.send(image)
    }
  });
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const id = req.user._id
  // find order
  const order = await Order.findById(req.params.id)
  // validate order
  if (!order) return res.status(404).send("order not found");
  // find user
  const user = await User.findById(id).select('name');
  const designer = await Designer.findById(order.designer._id).select('businessName _id account.owner._id')
  if (!user && !designer) return res.status(404).send("user not found");

  // console.log(user);
  // console.log(designer);

  //get message
  const message = await Message.findById(req.body.message).select('-__v')
  //check message
  if (!message) return res.status(404).send('message not found');

  let chatLog = {}

  if (user._id.equals(order.user._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: user, //TODO: kasih pilihan buat update message sebagai user atau designer
      message: message
    }
    console.log(chatLog);
  } else if (user._id.equals(designer.account.owner._id) && designer._id.equals(order.designer._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: {
        _id: designer._id,
        name: designer.businessName
      }, //TODO: kasih pilihan buat update message sebagai user atau designer
      message: message
    }
    console.log(chatLog);
  } else {
    return res.status(403).send('Unauthorized to modify this order');
  }
  console.log(chatLog);
  order.chatLog.push(chatLog) //DONE: things to do as user
  // await order.save()
  res.send(order)

});

module.exports = router;