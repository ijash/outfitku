const express = require('express');
const auth = require('../routes/auth');
const designers = require('../routes/designers');
const items = require('../routes/items');
const orders = require('../routes/orders');
const users = require('../routes/users');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/designers', designers);
    app.use('/api/items', items);
    app.use('/api/orders', orders);
    app.use('/api/users', users);
}