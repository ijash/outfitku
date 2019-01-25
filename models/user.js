const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 128
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  birthDate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F']
  },
  bodyMeasurment: {
    type: {
      height: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      weight: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      chest: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      centerBackNeckToWrist: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      backWaistLength: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      crossBack: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      armLength: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      upperArm: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      armholeDepth: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      waist: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      hip: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      headCircumference: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      sockMeasurements: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      footCircumference: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      sockHeight: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      totalFootLength: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      handCircumference: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      wristCircumference: {
        type: Number,
        minlength: 1,
        maxlength: 500
      },
      handLength: {
        type: Number,
        minlength: 1,
        maxlength: 500
      }
    }
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('Ships', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(128).required(),
    email: Joi.string().min(5).max(255).required().email(),
    birthDate: Joi.date().format('YYYY-MM-DD').required(),
    phone: Joi.string().min(5).max(50).required(),
    address: Joi.string().min(10).max(500),
    gender: Joi.string().valid('M', 'F').required(),
    height: Joi.number().min(1).max(500),
    weight: Joi.number().min(1).max(500),
    chest: Joi.number().min(1).max(500),
    centerBackNeckToWrist: Joi.number().min(1).max(500),
    backWaistLength: Joi.number().min(1).max(500),
    crossBack: Joi.number().min(1).max(500),
    armLength: Joi.number().min(1).max(500),
    upperArm: Joi.number().min(1).max(500),
    armholeDepth: Joi.number().min(1).max(500),
    waist: Joi.number().min(1).max(500),
    hip: Joi.number().min(1).max(500),
    headCircumference: Joi.number().min(1).max(500),
    sockMeasurements: Joi.number().min(1).max(500),
    footCircumference: Joi.number().min(1).max(500),
    sockHeight: Joi.number().min(1).max(500),
    totalFootLength: Joi.number().min(1).max(500),
    handCircumference: Joi.number().min(1).max(500),
    wristCircumference: Joi.number().min(1).max(500),
    handLength: Joi.number().min(1).max(500)
  };
  return Joi.validate(user, schema);
};

exports.User = User
exports.validate = validateUser;