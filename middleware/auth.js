const { auth } = require('express-oauth2-jwt-bearer')

const jwtCheck = auth()

module.exports = jwtCheck
