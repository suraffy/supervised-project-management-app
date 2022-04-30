const Project = require('../models/projectModel');
const Task = require('./../models/taskModel');

const filterObj = function (obj, allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) =>
    allowedFields.includes(prop) ? (newObj[prop] = obj[prop]) : undefined
  );

  return newObj;
};

exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found!');

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    const tasks = await Task.find({ project: projectId });
    if (tasks.length === 0) throw new Error('No task is available!');

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found!');

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    const code = req.params.code;
    const task = await Task.findOne({ project: projectId, code });
    if (!task) throw new Error('Task not found!');

    res.status(200).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Can not find the project!' });

    if (project.owner.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    req.body.project = projectId;

    const task = new Task(req.body);
    await task.save();

    res.status(201).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Project not found!' });

    if (project.owner.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    const allowedFields = [
      'description',
      'assignedTo',
      'done',
      'deadline',
      'result',
      'fileUpload',
    ];
    const filteredObj = filterObj(req.body, allowedFields);

    const code = req.params.code;
    const task = await Task.findOneAndUpdate(
      { project: projectId, code },
      filteredObj,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Task not found!' });

    res.status(200).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Project not found!' });

    if (project.owner.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized' });

    const code = req.params.code;
    const task = await Task.findOneAndDelete({ project: projectId, code });
    if (!task)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Task not found!' });

    res.status(204).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
