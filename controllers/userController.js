const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
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
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, email, password } = req.body

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
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

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

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}
