const Discussion = require('../models/discussionModel');
const Project = require('./../models/projectModel');
const Replay = require('./../models/replayModel');

const filterObj = function (obj, allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((prop) =>
    allowedFields.includes(prop) ? (newObj[prop] = obj[prop]) : undefined
  );

  return newObj;
};

exports.getAllReplays = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const discussionId = req.params.discussionId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOne({
      _id: discussionId,
      project: projectId,
    });
    if (!discussion) throw new Error('Discussion not found!');

    const replays = await Replay.find({ discussion: discussionId });
    if (replays.length === 0) throw new Error('No replay available!');

    res.status(201).json({
      status: 'success',
      results: replays.length,
      replays,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getReplay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const discussionId = req.params.discussionId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOne({
      _id: discussionId,
      project: projectId,
    });
    if (!discussion) throw new Error('Discussion not found!');

    const replay = await Replay.findById(req.params.id);
    if (!replay) throw new Error('Replay not found!');

    res.status(201).json({
      status: 'success',
      replay,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createReplay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const discussionId = req.params.discussionId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOne({
      _id: discussionId,
      project: projectId,
    });
    if (!discussion) throw new Error('Discussion not found!');

    req.body.discussion = discussionId;
    req.body.replayedBy = userId;

    const allowedFields = ['discussion', 'replayedBy', 'body'];
    const filteredBody = filterObj(req.body, allowedFields);

    const replay = new Replay(filteredBody);
    await replay.save();

    res.status(201).json({
      status: 'success',
      replay,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateReplay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const discussionId = req.params.discussionId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOne({
      _id: discussionId,
      project: projectId,
    });
    if (!discussion) throw new Error('Discussion not found!');

    const replay = await Replay.findOneAndUpdate(
      { _id: req.params.id, replayedBy: userId },
      {
        body: req.body.body,
      },
      { new: true, runValidators: true }
    );
    if (!replay) throw new Error('Replay not found!');

    res.status(200).json({
      status: 'success',
      replay,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteReplay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;
    const discussionId = req.params.discussionId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: userId }, { members: userId }],
    });
    if (!project) throw new Error('Project not found!');

    const discussion = await Discussion.findOne({
      _id: discussionId,
      project: projectId,
    });
    if (!discussion) throw new Error('Discussion not found!');

    const replay = await Replay.findOneAndDelete({
      _id: req.params.id,
      replayedBy: userId,
    });
    if (!replay)
      return res.status(404).json({
        status: 'fail',
        message: 'Replay not found!',
      });

    res.status(204).json({
      status: 'success',
      replay: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
