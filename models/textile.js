const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');

const fileCDN = `${config.get('getImg')}textiles/`;

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
  image: {
    type: String,
    get: location => `${fileCDN}${location}`,
    maxlength: 4096,
    trim: true
  }
});

const Textile = mongoose.model('textile', textileSchema);

function validateTextile(textile) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    comment: Joi.string().max(500),
    image: Joi.string().max(4096)
  };

  return Joi.validate(textile, schema);
}

exports.textileSchema = textileSchema;
exports.Textile = Textile;
exports.validate = validateTextile;