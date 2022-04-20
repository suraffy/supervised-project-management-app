const express = require('express');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('./../controllers/projectController');

const router = express.Router();

router.route('/').get(getAllProjects).post(createProject);
router.route('/:id').get(getProject).patch(updateProject).delete(deleteProject);

module.exports = router;
