const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');

const fileCDN = `${config.get('getImg')}designers/`;

designerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  picture: {
    type: String,
    get: location => `${fileCDN}${location}`
  },
  businessAddress: {
    type: String,
    minlength: 5,
    maxlength: 500
  },
  businessEmail: {
    type: String,
    minlength: 5,
    maxlength: 255
  },
  account: {
    owner: {
      type: new mongoose.Schema({
        _id: mongoose.Types.ObjectId,
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,

        }
      })
    },
    maintainers: [{
      type: new mongoose.Schema({
        _id: mongoose.Types.ObjectId,
        name: {
          type: String,
          minlength: 5,
          maxlength: 50
        }
      })
    }]
  },
  expertise: {
    type: Array,
    name: {
      type: String,
      minlength: 5,
      maxlength: 50
    }
  },
  works: [{
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
      },
      displayImage: {
        type: String,
        get: location => `${root}${location}`
      },
    })
  }, ],
});

let Designer = mongoose.model('Designer', designerSchema);

function validateDesigner(designer) {
  const schema = {
    businessName: Joi.string().min(5).max(50).required(),
    businessAddress: Joi.string().min(5).max(500),
    businessEmail: Joi.string().min(5).max(255).email(),
    ownerId: Joi.objectId().required(),
    maintainerId: Joi.array().items(Joi.objectId()),
    expertise: Joi.array().items(Joi.objectId().required()),
    full: Joi.string()
  };
  return Joi.validate(designer, schema);
};

function validateMaintainer(maintainer) {
  const schema = {
    id: Joi.objectId(),
  };
  return Joi.validate(maintainer, schema);
};

exports.designerSchema = designerSchema;
exports.Designer = Designer;
exports.validate = validateDesigner;
exports.validateMaintainer = validateMaintainer;