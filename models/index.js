const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true
})
mongoose.Promise = Promise;

module.exports.User = require('./user');