const express = require('express')
const habitController = require('../controllers/habitController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

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
