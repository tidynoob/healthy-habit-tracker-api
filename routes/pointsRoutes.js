const express = require('express')
const pointController = require('../controllers/pointController')

const router = express.Router()

router
  .route('/')
  .get(pointController.getAllPoints)
  .post(pointController.createNewPoints)
  .patch(pointController.updatePoints)
  .delete(pointController.deletePoints)

module.exports = router
