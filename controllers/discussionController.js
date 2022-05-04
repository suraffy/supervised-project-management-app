const Project = require('../models/projectModel');
const Discussion = require('./../models/discussionModel');

const filterObj = function (obj, allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) =>
    allowedFields.includes(prop) ? (newObj[prop] = obj[prop]) : undefined
  );

  return newObj;
};

// For Users
exports.getAllDiscussions = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussions = await Discussion.find({ project: projectId });
    if (discussions.length === 0)
      throw new Error('No disucssion is available!');

    res.status(200).json({
      status: 'success',
      results: discussions.length,
      discussions,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) throw new Error('No disucssion is available!');

    res.status(200).json({
      status: 'success',
      discussion,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    req.body.project = projectId;
    req.body.postedBy = userId;

    const allowedFields = ['project', 'postedBy', 'body'];
    const filteredBody = filterObj(req.body, allowedFields);

    const discussion = new Discussion(filteredBody);
    await discussion.save();

    res.status(201).json({
      status: 'success',
      discussion,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOneAndUpdate(
      {
        _id: req.params.id,
        postedBy: userId,
      },
      { body: req.body.body },
      { new: true, runValidators: true }
    );
    if (!discussion) throw new Error('Discussion not found!');

    res.status(200).json({
      status: 'success',
      discussion,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOneAndDelete({
      _id: req.params.id,
      postedBy: userId,
    });

    if (!discussion)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Discussion not found!' });

    res.status(204).json({
      status: 'success',
      discussion: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
