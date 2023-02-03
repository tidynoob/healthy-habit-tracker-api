const mongoose = require('mongoose')

const { Schema } = mongoose

const habitSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: [{ type: Date, default: Date.now }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Habit', habitSchema)
