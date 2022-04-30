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
      required: [true, 'Project code is required!'],
      validate: [
        validator.isAlphanumeric,
        'Project code must contain only AlphaNumberc!',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    supervisors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // tasks: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task',
    //   },
    // ],
    // discussions: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Discussion',
    //   },
    // ],
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// projectSchema.pre('save', async function (next) {
//   this.owner = await User.findById(this.owner).select('name email');
//   next();
// });

projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.virtual('discussions', {
  ref: 'Discussion',
  localField: '_id',
  foreignField: 'project',
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: 'name email',
  })
    .populate({
      path: 'members',
      select: 'name email',
    })
    .populate({
      path: 'supervisor',
      select: 'name email',
    });

  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
