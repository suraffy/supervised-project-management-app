const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    body: { type: String, trim: true, default: 'hi' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

discussionSchema.virtual('replay', {
  ref: 'Replay',
  localField: '_id',
  foreignField: 'discussion',
});

discussionSchema.pre(/^find/, function (next) {
  this.populate('replay');
  next();
});

discussionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'postedBy',
    select: 'name email',
  });
  next();
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
