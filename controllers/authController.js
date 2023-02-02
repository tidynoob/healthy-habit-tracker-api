const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// @desc Lgoin
// @route POST /auth
// @access Public
// eslint-disable-next-line consistent-return
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  const foundUser = await User.findOne({ email }).exec()

  if (!foundUser) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, foundUser.password)

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })

  res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public
// eslint-disable-next-line consistent-return
const refresh = asyncHandler(async (req, res) => {
  const { cookies } = req

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    // eslint-disable-next-line consistent-return
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' })

      const foundUser = await User.findOne({
        username: decoded.username
      }).exec()

      if (!foundUser) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )

      res.json({ accessToken })
    })
  )
  // ...
})

// @desc Logout
// @route POST /auth/logout
// @access Public
// eslint-disable-next-line consistent-return
const logout = asyncHandler(async (req, res) => {
  const { cookies } = req
  if (!cookies?.jwt) {
    return res.sendStatus(204)
  }
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  })

  res.json({ message: 'Logged out' })
})

module.exports = {
  login,
  refresh,
  logout
}
