const Joi = require('joi');
const mongoose = require('mongoose');

const textileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  comment: {
    type: String,
    maxlength: 500
  },
  //TO DO: picture url for textile
});

const Textile = mongoose.model('textile', textileSchema);

function validateTextile(textile) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    comment: Joi.string().max(500)
  };

  return Joi.validate(textile, schema);
}

exports.textileSchema = textileSchema;
exports.Textile = Textile;
exports.validate = validateTextile;