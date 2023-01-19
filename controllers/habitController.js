const asyncHandler = require('express-async-handler')
// const User = require('../models/User')
// const Points = require('../models/Points')
const Habit = require('../models/Habit')

// @desc Get all habits
// @route GET /habits
// @access Private
const getAllHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find().lean()
  if (!habits?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  return res.json(habits)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewHabit = asyncHandler(async (req, res) => {
  // ...
  const { name, points, multiplier, description } = req.body

  // Confirm data
  if (!name || !points || !multiplier || !description) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Duplicate check
  const duplicate = await Habit.findOne({ name }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate habit' })
  }

  const habitObject = { name, points, multiplier, description }
  const habit = await Habit.create(habitObject)

  if (!habit) {
    return res.status(400).json({ message: 'Invalid habit data received' })
  }
  return res.status(201).json({ message: `New habit ${name}` })
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateHabit = asyncHandler(async (req, res) => {
  const { id, name, points, multiplier, description } = req.body

  // confirm data
  if (!id || !name || !points || !multiplier || !description) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const habit = await Habit.findById(id).exec()

  if (!habit) {
    return res.status(400).json({ message: 'Habit not found' })
  }

  // Check for duplicate
  const duplicate = await Habit.findOne({ name }).lean().exec()
  // Check if user with requested username is the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate habit' })
  }

  habit.name = name
  habit.points = points
  habit.multiplier = multiplier
  habit.description = description

  const updatedHabit = await habit.save()

  return res.json({ message: `${updatedHabit.name} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteHabit = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Habit ID Required' })
  }

  const habit = await Habit.findById(id).exec()

  if (!habit) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await habit.deleteOne()

  const reply = `Username ${result.name} with ID ${result._id} deleted`

  return res.json(reply)
})

module.exports = {
  getAllHabits,
  createNewHabit,
  updateHabit,
  deleteHabit
}
