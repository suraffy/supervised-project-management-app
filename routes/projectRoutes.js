const express = require('express');
const {
  getAllProjects,
  getProject,
  createProject,
  // updateProject,
  deleteProject,
  getAllPublicProjects,
  getPublicProject,
} = require('./../controllers/projectController');

const router = express.Router();

router.route('/').get(getAllProjects).post(createProject);
router.get('/public', getAllPublicProjects);
router.get('/public/:code', getPublicProject);
router
  .route('/:code')
  .get(getProject)
  // .patch(updateProject)
  .delete(deleteProject);

module.exports = router;
