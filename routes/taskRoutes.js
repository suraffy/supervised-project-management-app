const express = require('express');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('./../controllers/taskController');
const { authenticate } = require('./../controllers/authController');

// const router = express.Router();
const router = express.Router({ mergeParams: true });

router.route('/').get(authenticate, getAllTasks).post(authenticate, createTask);
router
  .route('/:code')
  .get(authenticate, getTask)
  .patch(authenticate, updateTask)
  .delete(authenticate, deleteTask);

module.exports = router;
