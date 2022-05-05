const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'taskCode is required!'],
      validate: [
        validator.isAlphanumeric,
        'taskCode must contain only Letters and/or digits!',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    done: {
      type: Boolean,
      default: false,
    },
    deadline: Date,
    result: {
      type: String,
      trim: true,
    },
    fileUpload: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'assignedTo',
    select: 'name email',
  });
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
