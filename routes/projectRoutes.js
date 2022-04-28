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
} = require('./../controllers/projectController');
const { authenticate, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router.get('/all', authenticate, restrictTo('admin'), getAllProjects);
router
  .route('/all/:code')
  .get(authenticate, restrictTo('admin'), getProject)
  .delete(authenticate, restrictTo('admin'), deleteProject);

router.get('/public', getAllPublicProjects);
router.get('/public/:code', getPublicProject);

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
