const Joi = require('joi');
const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    user: String,
    designer: String,
    category: String,
    dateIssued: Date,
    price: {
        total: Number,
        initial: Number,
        additional: [{ issueNumber: Number, sequencvalue: Number }]
    },
    chatLog: [{
        seqNum: Number,
        from: new mongoose.Schema({
            name: String
        }),
        message: new mongoose.Schema({
            messageType: ['form', 'text', 'payment', 'image', {
                type: 'text',
                date: Date,
                body: String
            }],//kayaknya harus di pisah
        })
    }],
    image: {
        proposition: String,
        design: [String],
        revision: [String],
        prototype: [String],
        result: [String],
    },
    dueDate: Date,
    finishedDate: Date,
    isActive: Boolean,
    isPublishable: Boolean,



});