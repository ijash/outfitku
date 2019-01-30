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

router.delete('/', auth, async (req, res) => {
    // find user
    // validate user
    // find designer
    // validate designer
    // find order
    // validate designer
    // validate user by comparing with current order.user OR current designer.owner
    // delete order
    // send status
});

router.put('/', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});


router.get('/:id', auth, async (req, res) => {
    // TO DO...........
    console.log('fill in with task....')
    res.send('work in progress..........')
});


module.exports = router; 