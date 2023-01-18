const mongoose = require('mongoose')

const { Schema } = mongoose

const pointsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  history: [
    {
      date: { type: Date, required: true },
      points: { type: Number, required: true }
    }
  ]
})

module.exports = mongoose.model('Points', pointsSchema)
