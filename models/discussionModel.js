const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
  {
    postedBy: mongoose.Schema.Types.ObjectId,
    project: mongoose.Schema.Types.ObjectId,
    body: { type: String, trim: true, default: 'hi' },
    replays: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
