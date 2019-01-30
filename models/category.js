//DONE: use category schema for future expertise category in designers or item
//DONE: give a design picture.
const Joi = require('joi');
const mongoose = require('mongoose');

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
    get: location => `${root}${location}`,
    maxlength: 4096,
    trim: true
  },
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    picture: Joi.string().max(4096)
  };

  return Joi.validate(category, schema);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;