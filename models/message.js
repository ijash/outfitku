const Joi = require('joi');
const mongoose = require('mongoose');

const formInit = {
  body: {
    name: String,
    form: String
  }
}

const formRevision = {
  body: {
    name: String,
    form: String
  }
}

const payment = {
  body: {
    price: Number,
    paidOff: Boolean
  }
}

const messageSchema = new mongoose.Schema({
  messageType: {
    type: String,
    required: true,
    enum: ['form-init', 'form-revision', 'text', 'payment', 'image']
  },
  date: {
    type: Date,
    default: Date.now
  },
  content: String
});

messageSchema.methods.generateBody = function() {
  if (this.messageType == 'form-init') {
    messageSchema.add(formInit)
    this.updateOne({ messageType: this.messageType }, { formInitNum: this.formInitNum },
      function(err) {
        console.log("error");
      })
  }
}

const Message = mongoose.model('message', messageSchema);

function validateFormInit(formInit) {
  const formInitSchema = {
    formInitNum: Joi.number(),
    name: Joi.string(),
    form: Joi.string()
  }
  return Joi.validate(formInit, formInitSchema)
}

function validateFormRevision(formRevision) {
  const formRevisionSchema = {
    formRevisionNum: Joi.number(),
    name: Joi.string(),
    form: Joi.string()
  }
  return Joi.validate(formRevision, formRevisionSchema)
}

function validatePayment(payment) {
  const paymentSchema = {
    paymentNum: Joi.number(),
    price: Joi.number(),
    paidOff: Joi.boolean()
  }
  return Joi.validate(payment, paymentSchema)
}

function validateMessage(message) {
  const schema = {
    messageType: Joi.string().valid('form-init', 'form-revision', 'text', 'payment', 'image'),
    content: Joi.string(),
    name: Joi.string(),
    form: Joi.string(),
    price: Joi.number(),
    paidOff: Joi.boolean(),
  };

  return Joi.validate(message, schema);
}

exports.formInitSchema = formInit;
exports.formRevisionSchema = formRevision;
exports.paymentSchema = payment
exports.messageSchema = messageSchema;
exports.Message = Message;
exports.validateMessage = validateMessage;
exports.validateFormInit = validateFormInit;
exports.validateFormRevision = validateFormRevision;
exports.validatePayment = validatePayment;