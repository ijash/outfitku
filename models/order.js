const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
let { messageSchema, formInitSchema, paymentSchema, formRevisionSchema } = require('./message');

messageSchema.add(paymentSchema);
messageSchema.add(formInitSchema);
messageSchema.add(formRevisionSchema);

const fileCDN = config.get('img')

const orderSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      _id: mongoose.Types.ObjectId,
      name: {
        type: String,
        minlength: 5,
        maxlength: 50
      }
    })
  },
  designer: {
    type: new mongoose.Schema({
      _id: mongoose.Types.ObjectId,
      businessName: {
        type: String,
        minlength: 5,
        maxlength: 50
      }
    })
  },
  category: {
    type: new mongoose.Schema({
      _id: mongoose.Types.ObjectId,
      name: {
        type: String,
        minlength: 5,
        maxlength: 50
      }
    })
  },
  dateIssued: {
    type: Date,
    default: Date.now()
  },
  price: {
    total: Number,
    initial: Number,
    additional: [{
      issueNumber: Number,
      sequencvalue: Number
    }]
  },
  chatLog: [{
    seqNum: Number,
    from: new mongoose.Schema({
      name: String,
      businessName: String
    }),
    message: messageSchema
  }],
  image: {
    proposition: {
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    },
    design: [{
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    }],
    revision: [{
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    }],
    prototype: [{
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    }],
    result: [{
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    }],
  },
  dueDate: {
    type: Date,
    // required: true // kasih max di joi
  },
  finishedDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  isPublishable: {
    type: Boolean,
    default: false
  },
  material: new mongoose.Schema([{
    name: String, // get id from textile
    comment: String
  }])
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {

  const priceSchema = {
    total: Joi.number().min(0).positive().max(10000000000),
    initial: Joi.number().min(0).positive().max(10000000000),
    additional: {
      issueNumber: Joi.number().min(0).positive().max(10),
      sequencvalue: Joi.number().min(0).positive().max(10000000000)
    }
  }

  const imageSchema = {
    proposition: Joi.string().max(4096),
    design: Joi.array().items(Joi.string().max(4096)),
    revision: Joi.array().items(Joi.string().max(4096)),
    prototype: Joi.array().items(Joi.string().max(4096)),
    result: Joi.array().items(Joi.string().max(4096))
  }

  const schema = {
    // userId: Joi.objectId().required(),
    designer: Joi.objectId().required(),
    category: Joi.objectId(),
    // dateIssued: Joi.date(), //MM-DD-YYYY
    // price: Joi.object.keys(priceSchema),
    seqNum: Joi.number(),
    from: Joi.objectId(),
    message: Joi.objectId(),
    image: Joi.object().keys(imageSchema),
    dueDate: Joi.date(),
    finishedDate: Joi.date(),
    isActive: Joi.boolean(),
    isPublishable: Joi.boolean(),
    material: Joi.objectId()
  };

  return Joi.validate(order, schema);
};

exports.Order = Order;
exports.validate = validateOrder;