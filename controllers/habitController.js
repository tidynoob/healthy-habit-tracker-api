const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Points = require('../models/Points')
const Habit = require('../models/Habit')

// @desc Get all habits
// @route GET /habits
// @access Private
const getAllHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find().populate('user', '-password').lean()
  if (!habits?.length) {
    return res.status(400).json({ message: 'No habits found' })
  }
  return res.json(habits)
})

// @desc Get all habits
// @route GET /habits
// @access Private
const getHabit = asyncHandler(async (req, res) => {
  const { id } = req.params
  const habit = await Habit.findById(id).lean()
  if (!habit) {
    return res.status(400).json({ message: 'Habit not found' })
  }
  return res.json(habit)
})

// @desc Create new habit
// @route POST /habits
// @access Private
const createNewHabit = asyncHandler(async (req, res) => {
  // ...
  const { name, user } = req.body

  // Confirm data
  if (!name || !user) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const checkUser = await User.findById(user)
  if (!checkUser) {
    return res.status(400).json({ message: 'Invalid user' })
  }

  const { username } = checkUser

  // Duplicate check
  const duplicate = await Habit.findOne({ name, user }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate habit' })
  }

  const habitObject = { name, user }
  const habit = await Habit.create(habitObject)

  if (!habit) {
    return res.status(400).json({ message: 'Invalid habit data received' })
  }
  return res
    .status(201)
    .json({ message: `New habit ${name} crated for ${username}` })
})

// @desc Update a user
// @route PATCH /habits/:id
// @access Private
const updateHabit = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, user } = req.body

  // confirm data
  if (!id || !name || !user) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const habit = await Habit.findById(id).exec()

  if (!habit) {
    return res.status(400).json({ message: 'Habit not found' })
  }

  // Check for duplicate
  const duplicate = await Habit.findOne({ name, user }).lean().exec()
  // Check if user with requested username is the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate habit' })
  }

  habit.name = name
  habit.user = user

  const updatedHabit = await habit.save()

  return res.json({ message: `${updatedHabit.name} updated` })
})

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteHabit = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'Habit ID Required' })
  }

  const habit = await Habit.findById(id).exec()

  if (!habit) {
    return res.status(400).json({ message: 'Habit not found' })
  }

  const result = await habit.deleteOne()

  const reply = `Habit ${result.name} with ID ${result._id} deleted`

  return res.json(reply)
})

// @desc Get points for a user and habit
// @route GET /points/:userId/:habitId
// @access Private
const getPointsByHabit = asyncHandler(async (req, res) => {
  // the habit info contains the user already, so we don't need a userId
  const { id } = req.params
  // console.log(id)
  // console.log(req.params)

  const habit = await Habit.findById(id).lean().exec()
  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' })
  }
  const user = await User.findById(habit.user).lean().exec()
  if (!user) {
    return res.status(404).json({ message: 'No user found' })
  }

  const points = await Points.find({ user, habit })
    .sort({ date: -1 })
    .lean()
    .exec()

  return res.json(points)
})

module.exports = {
  getAllHabits,
  getHabit,
  createNewHabit,
  updateHabit,
  deleteHabit,
  getPointsByHabit
}
