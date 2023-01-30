const express = require('express')
const habitController = require('../controllers/habitController')

const router = express.Router()

router.route('/:id/points').get(habitController.getPointsByHabit)

router
  .route('/:id')
  .get(habitController.getHabit)
  .patch(habitController.updateHabit)
  .delete(habitController.deleteHabit)

router
  .route('/')
  .get(habitController.getAllHabits)
  .post(habitController.createNewHabit)

module.exports = router
