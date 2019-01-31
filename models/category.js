//DONE: use category schema for future expertise category in designers or item
//DONE: give a design picture.
const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');

const fileCDN = config.get('img')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  mainImage: {
    type: String,
    // get: location => `${fileCDN}${location}`,
    maxlength: 100000,
    trim: true
  },
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    mainImage: Joi.string().max(100000)
  };

  return Joi.validate(category, schema);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;