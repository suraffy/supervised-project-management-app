const express = require('express');
const {
  getAllDiscussions,
  createDiscussion,
  deleteDiscussion,
} = require('./../controllers/discussionController');

const router = express.Router();

router.route('/').get(getAllDiscussions).post(createDiscussion);
router.delete('/:id', deleteDiscussion);

module.exports = router;
