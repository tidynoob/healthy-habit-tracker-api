const express = require('express')
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

router.route('/:id/habits').get(userController.getHabitsByUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createNewUser)

module.exports = router
