const jwt = require('jsonwebtoken')

// eslint-disable-next-line consistent-return
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  // eslint-disable-next-line consistent-return
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' })

    req.id = decoded.UserInfo.id
    req.user = decoded.UserInfo.username
    req.email = decoded.UserInfo.email
    next()
  })
}

module.exports = verifyJWT
