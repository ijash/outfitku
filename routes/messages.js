const {
  Message,
  validateMessage,
  validateFormInit,
  validateFormRevision,
  validatePayment,
  messageSchema,
  formInitSchema,
  formRevisionSchema,
  paymentSchema
} = require('../models/message');
const { User } = require('../models/user');
const { Designer } = require('../models/designer');
const auth = require('../middleware/auth');
const fs = require('fs');
const config = require('config');
const multer = require("multer");
const { Order } = require('../models/order');
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

const path = `${config.get('saveImg')}orders/`

const storage = multer.diskStorage({
  destination: function(req, file, cb) { // define target path
    if (!fs.existsSync(`${path}${req.params.id}/messages`)) {
      fs.mkdirSync(`${path}${req.params.id}/messages`)
    }
    cb(null, `${path}${req.params.id}/messages`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname.trim()}`); // define saved file name
  }
});

const upload = multer({ storage: storage }); // use limit: {fileSize: to define max fileSize}

router.post('/:id', auth, async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).send("order not found")

  let message = {
    messageType: req.body.messageType,
    content: req.body.content
  }

  const insertMessage = (schema) => {
    key1 = Object.keys(schema)[0]
    key2 = Object.keys(schema.body)[0]
    key = `${key1}.${key2}`

    if (!messageSchema.paths.hasOwnProperty(key)) messageSchema.add(schema);
    message = Object.assign(schema, message)

    for (i in message) {
      if (typeof message[i] === "object") {
        for (n in message[i]) {
          message[i][n] = req.body[n]
        };
      };
      if (typeof message[i] !== "object") {
        message[i] = req.body[i]
      }
    };
    return message
  }

  if (req.body.messageType === 'form-init') insertMessage(formInitSchema)
  if (req.body.messageType === 'form-revision') insertMessage(formRevisionSchema)
  if (req.body.messageType === 'payment') insertMessage(paymentSchema)

  message = new Message(message);

  await message.save();

  // find user
  const user = await User.findById(req.user._id).select('name');
  const designer = await Designer.findById(order.designer._id).select('businessName _id account.owner._id')
  if (!user && !designer) return res.status(404).send("user not found");

  let chatLog = {}

  if (user._id.equals(order.user._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: user, //TODO: kasih pilihan buat update message sebagai user atau designer
      message: message
    }
  } else if (user._id.equals(designer.account.owner._id) && designer._id.equals(order.designer._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: {
        _id: designer._id,
        name: designer.businessName
      },
      message: message
    }
  } else {
    return res.status(403).send('Unauthorized to modify this order');
  }
  order.chatLog.push(chatLog) //DONE: things to do as user
  await order.save()
  res.send(order)
});

router.post('/:id/image', [auth, upload.single("content")], async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).send("order not found")

  const message = new Message({
    messageType: req.body.messageType,
    content: req.file.filename
  });

  await message.save();

  // find user
  const user = await User.findById(req.user._id).select('name');
  const designer = await Designer.findById(order.designer._id).select('businessName _id account.owner._id')
  if (!user && !designer) return res.status(404).send("user not found");

  let chatLog = {}

  if (user._id.equals(order.user._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: user, //TODO: kasih pilihan buat update message sebagai user atau designer
      message: message
    }
  } else if (user._id.equals(designer.account.owner._id) && designer._id.equals(order.designer._id)) {
    chatLog = {
      seqNum: order.chatLog.length + 1,
      from: {
        _id: designer._id,
        name: designer.businessName
      },
      message: message
    }
  } else {
    return res.status(403).send('Unauthorized to modify this order');
  }
  order.chatLog.push(chatLog) //DONE: things to do as user
  await order.save()
  res.send(order)
});

module.exports = router;