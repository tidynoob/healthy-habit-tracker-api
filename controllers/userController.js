const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Habit = require('../models/Habit')
// const Points = require('../models/Points')
// const Habit = require('../models/Habit')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  return res.json(users)
})

// @desc Get a specific user
// @route GET /users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id).select('-password').lean()
  if (!user) {
    return res.status(400).json({ message: 'No user found with that id' })
  }
  return res.json(user)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  // ...
  const { username, email, password } = req.body

  // Confirm data
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  // Duplicate user check
  const duplicateUser = await User.findOne({ username }).lean().exec()
  if (duplicateUser) {
    return res.status(409).json({ message: 'Duplicate username' })
  }
  // Duplicate email check
  const duplicateEmail = await User.findOne({ email }).lean().exec()
  if (duplicateEmail) {
    return res.status(409).json({ message: 'Duplicate email' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10) // salt rounds

  const userObject = { username, email, password: hashedPassword }
  const user = await User.create(userObject)

  if (!user) {
    return res.status(400).json({ message: 'Invalid user data received' })
  }
  return res.status(201).json({ message: `New user ${username}` })
})

// @desc Update a user
// @route PATCH /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { username, email, password } = req.body
  console.log({
    id,
    username,
    email,
    password
  })

  // confirm data
  if (!id || !username || !email) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // Check for user with requested username
  const duplicateUser = await User.findOne({ username }).lean().exec()
  // Check if user with requested username is the original user
  if (duplicateUser && duplicateUser?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  user.username = username

  // Check for user with requested email
  const duplicateEmail = await User.findOne({ email }).lean().exec()
  // Check if user with requested username is the original user
  if (duplicateEmail && duplicateEmail?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate email' })
  }

  user.email = email

  if (password) {
    // Has password
    user.password = await bcrypt.hash(password, 10) // salt rounds
  }

  const updatedUser = await user.save()

  return res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'User ID Required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `Username ${result.username} with ID ${result._id} deleted`

  return res.json(reply)
})

// @desc Get habits for a user
// @route GET /users/:id/habits
// @access Private
const getHabitsByUser = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const habits = await Habit.find({ user }).exec()

  return res.json(habits)
})

module.exports = {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
  getHabitsByUser
}
