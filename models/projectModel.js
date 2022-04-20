const mongoose = require('mongoose');
const validator = require('validator');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project name is required!'],
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: [true, 'Project code is required@'],
      validate: [
        validator.isAlphanumeric,
        'Project code must contain only AlphaNumberc!',
      ],
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
    public: {
      type: Boolean,
      default: false,
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
