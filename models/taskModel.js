const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
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
