const mongoose = require('mongoose')

const { Schema } = mongoose

const habitSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  multiplier: { type: Number, default: 1 },
  description: { type: String, required: true }
})

module.exports = mongoose.model('Habit', habitSchema)
