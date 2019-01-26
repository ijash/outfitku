const express = require('express');
const users = require('../routes/users');
const designers = require('../routes/designers');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/designers', designers);
}