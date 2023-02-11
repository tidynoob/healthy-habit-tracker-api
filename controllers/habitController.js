const asyncHandler = require('express-async-handler')
const { isSameDay } = require('date-fns')
// const User = require('../models/User')
const Habit = require('../models/Habit')

// @desc Get all habits
// @route GET /habits
// @access Private
const getAllHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find().lean()
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

// @desc Get habits for a user
// @route GET /habits/user/:id
// @access Private
const getHabitsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const habits = await Habit.find({ userId }).exec()

  return res.json(habits)
})

// @desc Create new habit
// @route POST /habits
// @access Private
const createNewHabit = asyncHandler(async (req, res) => {
  // ...
  const { name, userId } = req.body

  // Confirm data
  if (!name || !userId) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Duplicate check
  const duplicate = await Habit.findOne({ name, userId }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate habit' })
  }

  const habitObject = { name, userId }
  const habit = await Habit.create(habitObject)

  if (!habit) {
    return res.status(400).json({ message: 'Invalid habit data received' })
  }
  return res
    .status(201)
    .json({ message: `New habit ${name} crated for ${userId}` })
})

// @desc Update a user
// @route PATCH /habits/:id
// @access Private
const updateHabit = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, userId, date } = req.body
  console.log(req.body)

  console.log(name)
  console.log(userId)
  console.log(date)

  // confirm data
  if (!id || !date || !name) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const habit = await Habit.findById(id).exec()

  if (!habit) {
    return res.status(400).json({ message: 'Habit not found' })
  }

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
  deleteHabit,
  getHabitsByUser
}
