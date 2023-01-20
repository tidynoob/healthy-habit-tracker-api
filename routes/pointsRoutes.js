const express = require('express')
const pointsController = require('../controllers/pointsController')

const router = express.Router()

router
  .route('/')
  .get(pointsController.getAllPoints)
  .post(pointsController.createNewPoints)
  .patch(pointsController.updatePoints)
  .delete(pointsController.deletePoints)

module.exports = router
