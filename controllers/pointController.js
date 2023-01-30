const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Points = require('../models/Points')
const Habit = require('../models/Habit')

// @desc Get all points
// @route GET /points
// @access Private
const getAllPoints = asyncHandler(async (req, res) => {
  const points = await Points.find()
    .populate('user', '_id username')
    .populate('habit', '_id name')
    .sort({ date: -1 })

  if (!points) {
    return res.status(400).json({ message: 'No points found' })
  }
  return res.json(points)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewPoints = asyncHandler(async (req, res) => {
  // ...
  const { userId, habitId, points } = req.body

  if (!userId || !habitId || !points) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check if user and habit exist
  const existingUser = await User.findById(userId).lean().exec()
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  const existingHabit = await Habit.findById(habitId).lean().exec()
  if (!existingHabit) {
    return res.status(404).json({ message: 'Habit not found' })
  }

  // Duplicate check
  const duplicate = await Points.findOne({
    user: existingUser,
    habit: existingHabit
  })
    .lean()
    .exec()

  if (duplicate) {
    const currentDate = new Date().toDateString()
    const duplicateDate = new Date(duplicate.date).toDateString()

    if (currentDate === duplicateDate) {
      return res.status(409).json({ message: 'Duplicate record' })
    }
  }

  const pointsObject = {
    user: existingUser,
    habit: existingHabit,
    points,
    date: Date.now()
  }
  const point = await Points.create(pointsObject)

  if (!point) {
    return res.status(400).json({ message: 'Invalid point data received' })
  }
  return res.status(201).json({ message: `New log created` })
})

// @desc Update a point
// @route PATCH /points
// @access Private
const updatePoints = asyncHandler(async (req, res) => {
  const { id, userId, habitId, points } = req.body

  // Confirm data
  if (!id || !userId || !habitId || !points) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Check if user and habit exist
  const existingUser = await User.findById(userId).lean().exec()
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' })
  }
  const existingHabit = await Habit.findById(habitId).lean().exec()
  if (!existingHabit) {
    return res.status(404).json({ message: 'Habit not found' })
  }

  // Find and update point
  const point = await Points.findByIdAndUpdate(
    id,
    { user: existingUser, habit: existingHabit, points },
    { new: true, runValidators: true }
  ).exec()

  if (!point) {
    return res.status(404).json({ message: 'Record not found' })
  }

  return res.status(200).json({ message: 'Record updated' })
})

// @desc Delete a point
// @route DELETE /points
// @access Private
const deletePoints = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Record ID Required' })
  }

  // Find and delete point
  const point = await Points.findByIdAndDelete(id).exec()

  if (!point) {
    return res.status(404).json({ message: 'Record not found' })
  }

  return res.status(200).json({ message: 'Record deleted' })
})

module.exports = {
  getAllPoints,
  createNewPoints,
  updatePoints,
  deletePoints
}
