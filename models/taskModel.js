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
        'taskCode must contain only Letters or digits!',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: mongoose.Schema.Types.ObjectId,
    project: mongoose.Schema.Types.ObjectId,
    completed: {
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
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
