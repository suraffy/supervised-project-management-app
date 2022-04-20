const Task = require('./../models/taskModel');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) throw new Error('No task is available!');

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      tasks,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.messsage,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    res.status(201).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      messsage: err.messsage,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const code = req.params.code;
    const task = await Task.findOneAndUpdate({ code }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) throw new Error('Can not find the task!');

    res.status(200).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.messsage,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const code = req.params.code;
    const task = await Task.findOneAndDelete({ code });
    if (!task) throw new Error('Can not find the task!');

    res.status(204).json({
      status: 'success',
      task,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.messsage,
    });
  }
};
