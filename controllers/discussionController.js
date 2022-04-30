const Project = require('../models/projectModel');
const Discussion = require('./../models/discussionModel');

exports.getAllDiscussions = async (req, res) => {
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

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found!');

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

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

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found!');

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    req.body.project = projectId;
    req.body.postedBy = userId;

    const discussion = new Discussion(req.body);
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

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found!',
      });

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Discussion not found!' });

    if (discussion.postedBy.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    discussion.body = req.body.body;
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

exports.deleteDiscussion = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found!',
      });

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Discussion not found!' });

    if (discussion.postedBy.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    await discussion.delete();

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
