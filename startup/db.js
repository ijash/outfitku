const config = require('config')
const mongoose = require('mongoose');
module.exports = function () {
  // const db = config.get('db')
  const db = config.get('dbRemote')
  mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
      console.log('mongodb connected...')
    })
}