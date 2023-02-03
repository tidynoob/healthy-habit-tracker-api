const express = require('express')
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.post('/new', userController.createNewUser)

router.use(verifyJWT)

router.route('/:id/habits').get(userController.getHabitsByUser)
// router.route('/:id/points').post(userController.getPointsByUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/').get(userController.getAllUsers)

module.exports = router
