const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');

designerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
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
          maxlength: 50
        }
      })
    },
    maintainers: [{
      type: new mongoose.Schema({
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
    validate: {
      validator: function(v) {
        const result = v && v.length > 0;
        return (result ? true : false)
      },
      message: `insert at least one expertise.`
    }
  }
});

const Designer = mongoose.model('Designer', designerSchema);

function validateDesigner(designer) {
  const schema = {
    businessName: Joi.string().min(5).max(50).required(),
    businessAddress: Joi.string().min(5).max(500),
    businessEmail: Joi.string().min(5).max(255).email(),
    userOwnerId: Joi.objectId(),
    userMaintainerId: Joi.array().items(Joi.objectId()),
    expertise: Joi.array().items(Joi.string().required())
  };
  return Joi.validate(designer, schema);
};

exports.Designer = Designer;
exports.validate = validateDesigner;