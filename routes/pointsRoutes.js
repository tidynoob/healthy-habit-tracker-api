const express = require('express')
const pointController = require('../controllers/pointController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

router.route('/:habitId').delete(pointController.deletePointForHabit)

router.route('/').post(pointController.createNewPoint)

module.exports = router
