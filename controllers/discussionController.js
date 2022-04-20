const Discussion = require('./../models/discussionModel');

exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find();
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

exports.createDiscussion = async (req, res) => {
  try {
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

exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndDelete(req.params.id);
    if (!discussion) throw new Error('Can not find the discussion!');

    res.status(204).json({
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
