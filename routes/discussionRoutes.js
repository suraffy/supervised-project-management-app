const express = require('express');
const {
  getAllDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getAllDiscussionsAdmin,
  getDiscussionAdmin,
  deleteDiscussionAdmin,
} = require('./../controllers/discussionController');
const { authenticate, restrictTo } = require('./../controllers/authController');
const replayRouter = require('./../routes/replayRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:discussionId/replays', replayRouter);

router
  .route('/admin')
  .get(authenticate, restrictTo('admin'), getAllDiscussionsAdmin);

router
  .route('/admin/:id')
  .get(authenticate, restrictTo('admin'), getDiscussionAdmin)
  .delete(authenticate, restrictTo('admin'), deleteDiscussionAdmin);

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
