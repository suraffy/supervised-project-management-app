const express = require('express');
const {
  getAllReplays,
  getReplay,
  updateReplay,
  deleteReplay,
  createReplay,
} = require('./../controllers/replayController');
const { authenticate } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authenticate, getAllReplays)
  .post(authenticate, createReplay);

router
  .route('/:id')
  .get(authenticate, getReplay)
  .patch(authenticate, updateReplay)
  .delete(authenticate, deleteReplay);

module.exports = router;
