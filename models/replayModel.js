const mongoose = require('mongoose');

const replaySchema = mongoose.Schema(
  {
    replayedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion',
    },
    body: { type: String, trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

replaySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'replayedBy',
    select: 'name email',
  });
  next();
});

const Replay = mongoose.model('Replay', replaySchema);

module.exports = Replay;
