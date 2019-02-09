const config = require('config')
const mongoose = require('mongoose');
module.exports = function() {
  const db = config.get('dbRemote')
  // const db = config.get('dbRemote')
  mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
      console.log('mongodb connected...')
    })
    .catch((err) => {
      console.log(err);
    })
}