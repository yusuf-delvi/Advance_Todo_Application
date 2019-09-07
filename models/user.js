const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  name: {
    type: String
  },
  reminder: {
    minute: String,
    hour: String,
    dayOfMonth: String,
    month: String,
    dayOfWeek: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

const userSchema = new mongoose.Schema({
  todos: [todoSchema],
  notifyKey: JSON
})

module.exports = mongoose.model('User', userSchema)