const mongoose = require('mongoose')

const { Schema } = mongoose

const pointSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Points', pointSchema)
