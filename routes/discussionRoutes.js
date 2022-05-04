const express = require('express');
const {
  getAllDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
} = require('./../controllers/discussionController');
const { authenticate } = require('./../controllers/authController');
const replayRouter = require('./../routes/replayRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:discussionId/replays', replayRouter);

router
  .route('/')
  .get(authenticate, getAllDiscussions)
  .post(authenticate, createDiscussion);

router
  .route('/:id')
  .get(authenticate, getDiscussion)
  .patch(authenticate, updateDiscussion)
  .delete(authenticate, deleteDiscussion);

module.exports = router;
