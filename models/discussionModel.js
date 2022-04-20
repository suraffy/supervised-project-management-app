const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
  {
    postedBy: mongoose.Schema.Types.ObjectId,
    project: mongoose.Schema.Types.ObjectId,
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
