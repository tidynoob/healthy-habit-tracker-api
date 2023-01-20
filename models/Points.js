const mongoose = require('mongoose')

const { Schema } = mongoose

const pointsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  points: { type: Number, required: true },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Points', pointsSchema)
