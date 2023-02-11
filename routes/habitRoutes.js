const express = require('express')
const habitController = require('../controllers/habitController')
const jwtCheck = require('../middleware/auth')

const router = express.Router()

router.use(jwtCheck)

router.route('/user/:userId').get(habitController.getHabitsByUser)

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
