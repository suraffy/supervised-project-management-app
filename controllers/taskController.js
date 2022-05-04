const Project = require('../models/projectModel');
const Task = require('./../models/taskModel');

const filterObj = function (obj, allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) =>
    allowedFields.includes(prop) ? (newObj[prop] = obj[prop]) : undefined
  );

  return newObj;
};

// All Tasks in project
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

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

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

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

    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Can not find the project!' });

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

    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Project not found!' });

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

    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Project not found!' });

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

// Own Tasks
exports.getAllAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ assignedTo: userId });
    if (tasks.length === 0) throw new Error('You do not have a task!');

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

exports.getAssignedTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const task = await Task.findOne({ _id: id, assignedTo: userId });
    if (!task) throw new Error('No such task is found!');

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
