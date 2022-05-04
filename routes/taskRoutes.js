const express = require('express');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getAllAssignedTasks,
  getAssignedTask,
} = require('./../controllers/taskController');
const { authenticate } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.get('/assigned', authenticate, getAllAssignedTasks);
router.get('/assigned/:id', authenticate, getAssignedTask);

router.route('/').get(authenticate, getAllTasks).post(authenticate, createTask);
router
  .route('/:code')
  .get(authenticate, getTask)
  .patch(authenticate, updateTask)
  .delete(authenticate, deleteTask);

module.exports = router;
