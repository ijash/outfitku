const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { Order, validate } = require('../models/order')
const { User } = require('../models/user');
const { Designer } = require('../models/designer');


router.get('/', auth, async (req, res) => {
    const order = await Order.find()
        .select('-__v')
        .sort({ dateIssued: 1 });
    res.send(order)
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //get user
    const user = await User.findById(req.user._id).select('name');
    //check user
    if (!user) return res.status(404).send("user not found");
    //get designer
    const designer = await Designer.findById(req.body.designer).select('name account.owner._id');
    //check designer
    if (!designer) return res.status(404).send('designer not found');
    // check to not buy on own shop
    console.log();
    if (designer.account.owner._id.equals(user._id)) return res.status(404).send('cannot issue an order as an owner.');

    //set order init
    const order = new Order({
        user: user,
        designer: designer,
        dateIssued: Date.now(),
    })
    // order save
    await order.save();
    res.send(order)
});

router.get('/:id', auth, async (req, res) => {
    // find user
    // validate user
    // find designer
    // validate designer
    // find order
    // validate designer
    // validate user by comparing with current order.user OR current designer.owner to see if the user is the owner or buyer. others can't see or modify.

    // edit the order

    // send status
    res.send('work in progress..........')
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // find user
    const user = await User.findById(req.user._id).select('name');
    // validate user
    if (!user) return res.status(404).send("user not found");
    // find designer
    const designer = await Designer.findById(req.body.designer).select('name account.owner._id');
    // validate designer
    if (!designer) return res.status(404).send('designer not found');
    // find order
    const order = await Order.findById(req.params._id)
    // validate order
    if (!order) return res.status(404).send("order not found");
    // validate user by comparing with current order.user OR current designer.owner to see if the user is the owner or buyer. others can't see or modify.
    if (!designer.user._id.equals(user._id) | !designer.account.owner._id.equals(user._id)) return res.status(404).send('unauthorized to modify this order.');

    if (designer.user._id.equals(user._id)) {
        //TO DO: things to do as buyer
        res.send('data for user');
    }
    if (designer.account.owner._id.equals(user._id)) {
        //TO DO: things to do as owner
        res.send('data for owner');
    }
    // send status

});

module.exports = router; 