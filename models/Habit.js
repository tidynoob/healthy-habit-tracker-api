const mongoose = require('mongoose')

const { Schema } = mongoose

const habitSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    points: [{ type: Date, default: Date.now }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Habit', habitSchema)
