const express = require('express')
const pointController = require('../controllers/pointController')

const router = express.Router()

router.route('/:habitId').delete(pointController.deletePointForHabit)

router.route('/').post(pointController.createNewPoint)

module.exports = router
