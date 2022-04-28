const Project = require('./../models/projectModel');

const filterObj = function (obj, allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) =>
    allowedFields.includes(prop) ? (newObj[prop] = obj[prop]) : undefined
  );

  return newObj;
};

// For Users
exports.getAllOwnProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
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

exports.getOwnProject = async (req, res) => {
  try {
    const code = req.params.code;
    const project = await Project.findOne({
      owner: req.user._id,
      code,
    })
      .populate('tasks')
      .populate('discussions');
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
    req.body.owner = req.user._id;
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

exports.updateOwnProject = async (req, res) => {
  try {
    const code = req.params.code;
    const allowedFields = [
      'title',
      'description',
      'public',
      'members',
      'supervisor',
      'tasks',
      'discussions',
      'completed',
      'completedAt',
    ];
    const filteredBody = filterObj(req.body, allowedFields);

    const project = await Project.findOneAndUpdate(
      { owner: req.user._id, code },
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
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

exports.deleteOwnProject = async (req, res) => {
  try {
    const code = req.params.code;
    const project = await Project.findOneAndDelete({
      owner: req.user._id,
      code,
    });
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

// For Admins
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
    const code = req.params.code;
    const project = await Project.findOne({ code })
      .populate('tasks')
      .populate('discussions');
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
    const code = req.params.code;
    const project = await Project.findOneAndDelete({ code });
    if (!project) throw new Error('Can not find the project!');

    res.status(204).json({
      status: 'success',
      project: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// For gusts
exports.getAllPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({ public: true });
    if (projects.length === 0)
      throw new Error('No public project is available!');

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

exports.getPublicProject = async (req, res) => {
  try {
    const code = req.params.code;
    const project = await Project.findOne({ code, public: true })
      .populate('tasks')
      .populate('discussions');
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
