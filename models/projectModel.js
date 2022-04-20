const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Project name is required'],
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      require: [true, 'Project code is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    memebers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    supervisers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    private: {
      type: Boolean,
      default: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    discussions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion',
      },
    ],
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
