//FILE DESCRIPTION: in-app validation logic
//importing Joi
const Joi = require('joi');
//exports all the code below into a usable function
module.exports = function() {
  //make Joi use objectid
  Joi.objectId = require('joi-objectid')(Joi);
}