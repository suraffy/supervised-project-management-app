const express = require('express');
const {
  getAllOwnProjects,
  getOwnProject,
  createProject,
  updateOwnProject,
  deleteOwnProject,
  getAllProjects,
  getProject,
  deleteProject,
  getAllPublicProjects,
  getPublicProject,
  getAllProjectsIn,
  getProjectIn,
} = require('./../controllers/projectController');
const { authenticate, restrictTo } = require('./../controllers/authController');
const taskRouter = require('./../routes/taskRoutes');
const discussionRouter = require('./../routes/discussionRoutes');

const router = express.Router();

router.use('/:projectId/tasks', taskRouter);
router.use('/:projectId/discussions', discussionRouter);

router.get('/all', authenticate, restrictTo('admin'), getAllProjects);
router
  .route('/all/:code')
  .get(authenticate, restrictTo('admin'), getProject)
  .delete(authenticate, restrictTo('admin'), deleteProject);

router.get('/public', getAllPublicProjects);
router.get('/public/:code', getPublicProject);

router.get('/projectsIn', authenticate, getAllProjectsIn);
router.get('/projectsIn/:id', authenticate, getProjectIn);

router
  .route('/')
  .get(authenticate, getAllOwnProjects)
  .post(authenticate, createProject);
router
  .route('/:code')
  .get(authenticate, getOwnProject)
  .patch(authenticate, updateOwnProject)
  .delete(authenticate, deleteOwnProject);

module.exports = router;
