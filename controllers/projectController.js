const Project = require('./../models/projectModel');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (projects.length === 0) throw new Error('No Project is available!');

    res.status(200).json({
      status: 'success',
      results: projects.length,
      projects,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) throw new Error('Can not find the project!');

    res.status(200).json({
      status: 'success',
      project,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    res.status(201).json({
      status: 'success',
      project,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) throw new Error('Can not find the project!');

    res.status(200).json({
      status: 'success',
      project,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) throw new Error('Can not find the project!');

    res.status(204).json({
      status: 'success',
      project,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
