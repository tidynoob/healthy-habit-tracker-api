const asyncHandler = require('express-async-handler')
const { isSameDay } = require('date-fns')
const User = require('../models/User')
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

// @desc Get specific habit
// @route GET /habits/:id
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
  const { name, user, date } = req.body
  console.log(req.body)

  console.log(name)
  console.log(user)
  console.log(date)

  // confirm data
  if (!id || !date || !name) {
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

  const dateToUse = new Date(date)

  const dateCompleted = habit.points.find((pointDate) => {
    return isSameDay(pointDate, dateToUse)
  })
  console.log(dateCompleted)
  if (!dateCompleted) {
    habit.points = [...habit.points, dateToUse.toDateString()]
  } else {
    habit.points = habit.points.filter((p) => !isSameDay(p, dateToUse))
  }

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

module.exports = {
  getAllHabits,
  getHabit,
  createNewHabit,
  updateHabit,
  deleteHabit
}
