const express = require('express')
const userController = require('../controllers/userController')
const jwtCheck = require('../middleware/auth')

const router = express.Router()

router.post('/new', userController.createNewUser)

router.use(jwtCheck)

router.route('/:id/habits').get(userController.getHabitsByUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/').get(userController.getAllUsers)

module.exports = router
