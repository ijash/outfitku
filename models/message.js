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
    default: Date.now()
  }
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
const FormInit = mongoose.model('FormInit', formInit);
const FormRevision = mongoose.model('FormModel', formRevision);
const Payment = mongoose.model('Payment', payment);

function validateMessage(message) {

  const formInitSchema = {
    formInitNum: Joi.number(),
    name: Joi.string(),
    form: Joi.string()
  }
  const formRevisionSchema = {
    formRevisionNum: Joi.number(),
    name: Joi.string(),
    form: Joi.string()
  }
  const paymentSchema = {
    paymentNum: Joi.number(),
    price: Joi.number(),
    paidOff: Joi.boolean()
  }

  const schema = {
    messageType: Joi.string().valid('form-init', 'form-revision', 'text', 'payment', 'image').required(),
    date: Joi.date(),
    name: Joi.string(),
    form: Joi.string(),
    price: Joi.number(),
    paidOff: Joi.boolean()
  };

  return Joi.validate(message, schema);
}

exports.formInitSchema = formInit;
exports.formRevisionSchema = formRevision;
exports.paymentSchema = payment
exports.FormInit = FormInit;
exports.FormRevision = FormRevision;
exports.Payment = Payment;
exports.messageSchema = messageSchema;
exports.Message = Message;
exports.validate = validateMessage;