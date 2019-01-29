//DONE: use category schema for future expertise category in designers or item
//TO DO: use this model to refer textile. and give a design picture.
const Joi = require('joi');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  mainImage: {
    type: String,
    get: location => `${root}${location}`,
    maxlength: 4096
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