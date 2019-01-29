const Joi = require('joi');
const mongoose = require('mongoose');
const { designerSchema } = require('./designer');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    // TO DO: link to category
    category: String,
    dateAdded: Date,
    onDisplay: {
        type: Boolean,
        default: false,
    },
    image: {
        type: new mongoose.Schema({
            mainImage: {
                type: String,
                get: location => `${root}${location}`
            },
            images: [{
                type: String,
                get: location => `${root}${location}`
            }]
        }
        ),
        trim: true
    },
    price: Number,
    description: {
        type: String,
        default: "No description yet...",
        min: 10,
        max: 1000,
    },
    testimonial: [new mongoose.Schema({
        userName: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        comment: {
            type: String,
            min: 5,
            max: 255,
            publishDate: Date,
        }
    })],
    designer: new mongoose.Schema({
        businessName: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
    })

});

const Item = mongoose.model('Item', itemSchema);

//TO DO: review and test the validation. possibly using nested schema.
function validateItem(item) {
    const schema = {

        name: Joi.string().min(5).max(50).required(),
        // category: Joi.objectId
        dateAdded: Joi.date().format('YYYY-MM-DD').required().default(Date.now),
        //image validation
        price: Joi.number().min(0).positive().max(10000000000),
        description: Joi.string().min(10).max(1000),
        testimonial: Joi.array().items(Joi.objectId()),
        designer: Joi.objectId().required(),
    };
    return Joi.validate(item, schema);
};

exports.Item = Item;
exports.validate = validateItem;