const express = require('express');
const auth = require('../routes/auth');
const designers = require('../routes/designers');
const items = require('../routes/items');
const orders = require('../routes/orders');
const users = require('../routes/users');
const categories = require('../routes/categories');
const textiles = require('../routes/textiles');
const messages = require('../routes/messages');

module.exports = function(app) {
  app.use('/public', express.static('public'));

  app.use(express.json());
  app.use('/api/auth', auth);
  app.use('/api/designers', designers);
  app.use('/api/items', items);
  app.use('/api/orders', orders);
  app.use('/api/users', users);
  app.use('/api/categories', categories);
  app.use('/api/textiles', textiles);
  app.use('/api/messages', messages);
}