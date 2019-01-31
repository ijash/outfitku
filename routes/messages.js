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

const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
// const validateMessage = require('../middleware/validateMessage'); // funciton dipindahin ke middleware

router.post('/', async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let message = {
    messageType: req.body.messageType,
    content: req.body.content
  };

  const insertMessage = (schema) => {
    key1 = Object.keys(schema)[0]
    key2 = Object.keys(schema.body)[0]
    key = `${key1}.${key2}`

    if (!messageSchema.paths.hasOwnProperty(key)) messageSchema.add(schema);
    message = Object.assign(schema, message)
    console.log(message);

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

  // await message.save();

  res.send(message)
});

module.exports = router;