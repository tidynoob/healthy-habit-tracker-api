const asyncHandler = require('express-async-handler')
// const User = require('../models/User')
const Points = require('../models/Points')
const Habit = require('../models/Habit')

// @desc Get all points
// @route GET /points
// @access Private
// const getAllPoints = asyncHandler(async (req, res) => {
//   const points = await Points.find()
//     .populate('user', '_id username')
//     .populate('habit', '_id name')
//     .sort({ date: -1 })

//   if (!points) {
//     return res.status(400).json({ message: 'No points found' })
//   }
//   return res.json(points)
// })

// @desc Create new user
// @route POST /points
// @access Private
const createNewPoint = asyncHandler(async (req, res) => {
  const { habit, date } = req.body

  if (!habit) {
    return res.status(400).json({ message: 'A habit ID is required' })
  }

  let dateToUse
  if (!date) {
    dateToUse = new Date().toDateString()
  } else {
    dateToUse = new Date(date).toDateString()
  }

  // Check if user and habit exist

  const existingHabit = await Habit.findById(habit).lean().exec()
  if (!existingHabit) {
    return res.status(404).json({ message: 'Habit not found' })
  }

  const existingUser = existingHabit.user
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found for habit' })
  }

  // Duplicate check
  const duplicate = await Points.findOne({
    user: existingUser,
    habit: existingHabit,
    date: dateToUse
  })
    .lean()
    .exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Point already exists' })
  }

  const pointsObject = {
    user: existingUser,
    habit: existingHabit,
    date: dateToUse
  }
  const point = await Points.create(pointsObject)

  if (!point) {
    return res.status(400).json({ message: 'Invalid point data received' })
  }
  return res.status(201).json({ message: `New record created` })
})

// @desc Update a point
// @route PATCH /points/:id
// @access Private
// const updatePoints = asyncHandler(async (req, res) => {
//   const { id, user, habit, points } = req.body

//   // Confirm data
//   if (!id || !userId || !habitId || !points) {
//     return res.status(400).json({ message: 'All fields are required' })
//   }

//   // Check if user and habit exist
//   const existingUser = await User.findById(userId).lean().exec()
//   if (!existingUser) {
//     return res.status(404).json({ message: 'User not found' })
//   }
//   const existingHabit = await Habit.findById(habitId).lean().exec()
//   if (!existingHabit) {
//     return res.status(404).json({ message: 'Habit not found' })
//   }

//   // Find and update point
//   const point = await Points.findByIdAndUpdate(
//     id,
//     { user: existingUser, habit: existingHabit, points },
//     { new: true, runValidators: true }
//   ).exec()

//   if (!point) {
//     return res.status(404).json({ message: 'Record not found' })
//   }

//   return res.status(200).json({ message: 'Record updated' })
// })

// @desc Delete a point
// @route DELETE /points
// @access Private
const deletePointForHabit = asyncHandler(async (req, res) => {
  const { habitId } = req.params

  const habit = await Habit.findById(habitId).lean().exec()
  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' })
  }

  const { date } = req.body
  let dateToUse
  if (!date) {
    dateToUse = new Date().toDateString()
  } else {
    dateToUse = new Date(date).toDateString()
  }

  // Find and delete point
  const point = await Points.findOneAndDelete({
    habit,
    date: dateToUse
  }).exec()

  if (!point) {
    return res.status(404).json({ message: 'Record not found' })
  }

  return res.status(200).json({ message: 'Record deleted' })
})

module.exports = {
  // getAllPoints,
  createNewPoint,
  // updatePoints,
  deletePointForHabit
}
