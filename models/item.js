const mongoose = require('mongoose');
const { designerSchema } = require('./designer');
const Joi = require('joi');
const config = require('config')

const fileCDN = `${config.get('getImg')}items/`;

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  category: {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50
    }
  },
  dateAdded: {
    type: Date,
    default: Date.now()
  },
  onDisplay: {
    type: Boolean,
    default: true,
  },
  image: {
    mainImage: {
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    },
    images: [{
      type: String,
      get: location => `${fileCDN}${location}`,
      trim: true,
      maxlength: 4096
    }]
  },
  price: Number,
  description: {
    type: String,
    default: 'No description yet...',
    min: 10,
    max: 1000
  },
  testimonial: [{
    type: new mongoose.Schema({
      _id: mongoose.Types.ObjectId,
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      comment: {
        type: String,
        min: 5,
        max: 255
      },
      publishDate: {
        type: Date,
        default: Date.now()
      }
    }),

  }],
  designer: new mongoose.Schema({
    businessName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
  })
});

const Item = mongoose.model('Item', itemSchema);

//TODO: review and test the validation.
function validateItem(item) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    category: Joi.objectId().required(),
    comment: Joi.string().min(5).max(255),
    publishDate: Joi.date(),
    dateAdded: Joi.date(),
    onDisplay: Joi.boolean(),
    price: Joi.number().min(0).positive().max(10000000000),
    description: Joi.string().min(10).max(1000),
    testimonial: {
      userId: Joi.objectId(),
      comment: Joi.string().min(5).max(255),
    },
    publishDate: Joi.date(),
    designer: Joi.objectId().required(),
    userId: Joi.objectId().required()
  };

  return Joi.validate(item, schema);
};

function validateTesti(testi) {
  const testimonial = {
    userId: Joi.objectId(),
    comment: Joi.string().min(5).max(255),
  };
  return Joi.validate(testi, testimonial)
}

function validateImage(img) {
  const imageSchema = {
    mainImage: Joi.string().max(4096),
    images: Joi.array().items(Joi.string().max(4096)),
  }
  return Joi.validate(img, imageSchema)
}

exports.Item = Item;
exports.validateTesti = validateTesti;
exports.validateImage = validateImage;
exports.validate = validateItem;