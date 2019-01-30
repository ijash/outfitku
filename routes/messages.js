const { Message, Payment, FormInit, FormRevision, validate, messageSchema, formInitSchema, formRevisionSchema, paymentSchema } = require('../models/message');
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

router.post('/', async (req, res) => {

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let firstMessage = {
    messageType: req.body.messageType,
  };

  var display = function(schema) {
    key1 = Object.keys(schema)[0]
    key2 = Object.keys(schema.body)[0]
    key = `${key1}.${key2}`

    if (!messageSchema.paths.hasOwnProperty(key)) messageSchema.add(schema);
    firstMessage = Object.assign(schema, firstMessage)

    for (i in firstMessage) {
      if (typeof firstMessage[i] === "object") {
        for (n in firstMessage[i]) {
          firstMessage[i][n] = req.body[n]
        };
      };
      if (typeof firstMessage[i] !== "object") {
        firstMessage[i] = req.body[i]
      }
    };
    return firstMessage
  }

  if (req.body.messageType === 'form-init') display(formInitSchema)
  if (req.body.messageType === 'payment') display(paymentSchema)



  firstMessage = new Message(firstMessage);

  await firstMessage.save();

  res.send(firstMessage)
});

module.exports = router;