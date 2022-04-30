const Project = require('./../models/projectModel');
const Replay = require('./../models/replayModel');

exports.getAllReplays = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const discussionId = req.params.discussionId;
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

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found!');

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

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
    const discussionId = req.params.discussionId;

    req.body.replayedBy = userId;
    req.body.discussion = discussionId;

    console.log({ userId, discussionId });
    console.log(req.body.replayedBy, req.body.discussion);

    const replay = new Replay(req.body);
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

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found!',
      });

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    const replay = await Replay.findById(req.params.id);
    if (!replay)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Replay not found!' });

    if (replay.replayedBy.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    replay.body = req.body.body;
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

exports.deleteReplay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        status: 'fail',
        message: 'Project not found!',
      });

    if (
      project.owner.id !== userId &&
      !project.members.some((el) => el.id === userId)
    )
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    const replay = await Replay.findById(req.params.id);
    if (!replay)
      return res
        .status(404)
        .json({ status: 'fail', message: 'Replay not found!' });

    if (replay.replayedBy.id !== userId)
      return res
        .status(401)
        .json({ status: 'fail', message: 'You are not authorized!' });

    await replay.delete();

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
