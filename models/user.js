const JoiBase = require('joi');
const JoiDate = require('joi-date-extensions');
const config = require('config');
Joi = JoiBase.extend(JoiDate)

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const fileCDN = `${config.get('getImg')}users/`;

// size schema for Joi & user schema
const sizeOf = {
  height: { min: 1234, max: 1234 },
  weight: { min: 1234, max: 1234 },
  chest: { min: 1234, max: 1234 },
  centerBackNeckToWrist: { min: 1234, max: 1234 },
  backWaistLength: { min: 1234, max: 1234 },
  crossBack: { min: 1234, max: 1234 },
  armLength: { min: 1234, max: 1234 },
  upperArm: { min: 1234, max: 1234 },
  armholeDepth: { min: 1234, max: 1234 },
  waist: { min: 1234, max: 1234 },
  hip: { min: 1234, max: 1234 },
  headCircumference: { min: 1234, max: 1234 },
  sockMeasurements: { min: 1234, max: 1234 },
  footCircumference: { min: 1234, max: 1234 },
  sockHeight: { min: 1234, max: 1234 },
  totalFootLength: { min: 1234, max: 1234 },
  handCircumference: { min: 1234, max: 1234 },
  wristCircumference: { min: 1234, max: 1234 },
  handLength: { min: 1234, max: 1234 },
}

userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  profPict: {
    type: String,
    // get: location => `${fileCDN}${location}`,
    trim: true,
    maxlength: 4096
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
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        const result = v.match(/^(.*\s+.*)+$/);
        return (result ? false : true)
      },
      message: props => `${props.value} musn't contain whitespace.`
    }
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  sex: {
    type: String,
    required: true,
    enum: ['m', 'f']
  },
  bodyMeasurment: {
    type: {
      height: {
        type: Number,
        minlength: sizeOf.height.min,
        maxlength: sizeOf.height.max
      },
      weight: {
        type: Number,
        minlength: sizeOf.weight.min,
        maxlength: sizeOf.weight.max
      },
      chest: {
        type: Number,
        minlength: sizeOf.chest.min,
        maxlength: sizeOf.chest.max
      },
      centerBackNeckToWrist: {
        type: Number,
        minlength: sizeOf.centerBackNeckToWrist.min,
        maxlength: sizeOf.centerBackNeckToWrist.max
      },
      backWaistLength: {
        type: Number,
        minlength: sizeOf.backWaistLength.min,
        maxlength: sizeOf.backWaistLength.max
      },
      crossBack: {
        type: Number,
        minlength: sizeOf.crossBack.min,
        maxlength: sizeOf.crossBack.max
      },
      armLength: {
        type: Number,
        minlength: sizeOf.armLength.min,
        maxlength: sizeOf.armLength.max
      },
      upperArm: {
        type: Number,
        minlength: sizeOf.upperArm.min,
        maxlength: sizeOf.upperArm.max
      },
      armholeDepth: {
        type: Number,
        minlength: sizeOf.armholeDepth.min,
        maxlength: sizeOf.armholeDepth.max
      },
      waist: {
        type: Number,
        minlength: sizeOf.waist.min,
        maxlength: sizeOf.waist.max
      },
      hip: {
        type: Number,
        minlength: sizeOf.hip.min,
        maxlength: sizeOf.hip.max
      },
      headCircumference: {
        type: Number,
        minlength: sizeOf.headCircumference.min,
        maxlength: sizeOf.headCircumference.max
      },
      sockMeasurements: {
        type: Number,
        minlength: sizeOf.sockMeasurements.min,
        maxlength: sizeOf.sockMeasurements.max
      },
      footCircumference: {
        type: Number,
        minlength: sizeOf.footCircumference.min,
        maxlength: sizeOf.footCircumference.max
      },
      sockHeight: {
        type: Number,
        minlength: sizeOf.sockHeight.min,
        maxlength: sizeOf.sockHeight.max
      },
      totalFootLength: {
        type: Number,
        minlength: sizeOf.totalFootLength.min,
        maxlength: sizeOf.totalFootLength.max
      },
      handCircumference: {
        type: Number,
        minlength: sizeOf.handCircumference.min,
        maxlength: sizeOf.handCircumference.max
      },
      wristCircumference: {
        type: Number,
        minlength: sizeOf.wristCircumference.min,
        maxlength: sizeOf.wristCircumference.max
      },
      handLength: {
        type: Number,
        minlength: sizeOf.handLength.min,
        maxlength: sizeOf.handLength.max
      }
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

userSchema.methods.validatePhone = function() {
  let num = this.phone;
  num = num.split(" ").join("");
  this.phone = num;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {

  const bodyMeasurmentSchema = {
    height: Joi.number().min(sizeOf.height.min).max(sizeOf.height.max),
    weight: Joi.number().min(sizeOf.weight.min).max(sizeOf.weight.max),
    chest: Joi.number().min(sizeOf.chest.min).max(sizeOf.chest.max),
    centerBackNeckToWrist: Joi.number().min(sizeOf.centerBackNeckToWrist.min).max(sizeOf.centerBackNeckToWrist.max),
    backWaistLength: Joi.number().min(sizeOf.backWaistLength.min).max(sizeOf.backWaistLength.max),
    crossBack: Joi.number().min(sizeOf.crossBack.min).max(sizeOf.crossBack.max),
    armLength: Joi.number().min(sizeOf.armLength.min).max(sizeOf.armLength.max),
    upperArm: Joi.number().min(sizeOf.upperArm.min).max(sizeOf.upperArm.max),
    armholeDepth: Joi.number().min(sizeOf.armholeDepth.min).max(sizeOf.armholeDepth.max),
    waist: Joi.number().min(sizeOf.waist.min).max(sizeOf.waist.max),
    hip: Joi.number().min(sizeOf.hip.min).max(sizeOf.hip.max),
    headCircumference: Joi.number().min(sizeOf.headCircumference.min).max(sizeOf.headCircumference.max),
    sockMeasurements: Joi.number().min(sizeOf.sockMeasurements.min).max(sizeOf.sockMeasurements.max),
    footCircumference: Joi.number().min(sizeOf.footCircumference.min).max(sizeOf.footCircumference.max),
    sockHeight: Joi.number().min(sizeOf.sockHeight.min).max(sizeOf.sockHeight.max),
    totalFootLength: Joi.number().min(sizeOf.totalFootLength.min).max(sizeOf.totalFootLength.max),
    handCircumference: Joi.number().min(sizeOf.handCircumference.min).max(sizeOf.handCircumference.max),
    wristCircumference: Joi.number().min(sizeOf.wristCircumference.min).max(sizeOf.wristCircumference.max),
    handLength: Joi.number().min(sizeOf.handLength.min).max(sizeOf.handLength.max),
  }

  const schema = {
    name: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(128).required(),
    email: Joi.string().min(5).max(255).required().email(),
    birthDate: Joi.date().required(), //MM-DD-YYYY
    phone: Joi.string().trim().min(5).max(20).required(),
    address: Joi.string().min(10).max(500),
    sex: Joi.string().valid('m', 'f').required().error(() => "sex must be a single character of 'm' or 'f'"),
    bodyMeasurment: Joi.object().keys(bodyMeasurmentSchema),

  };
  return Joi.validate(user, schema);
};

function validateProfPict(pict) {
  const schema = {
    profPict: Joi.string().max(4096)
  };
  return Joi.validate(pict, schema);
}

exports.User = User
exports.validate = validateUser;
exports.validatePict = validateProfPict;