const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required!'],
      minlength: [3, 'a name must be at least 3 characters'],
      maxlength: [30, 'a name can not be more than 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required!'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'supervisor', 'user'],
        message: 'role is either: admin, supervisor, or user!',
      },
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'password is required!'],
      minlength: [4, 'Password must contain at least 4 characters!'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password!'],
      validate: {
        // this works only on CREATE() and SAVE() !!
        validator: function (password) {
          return password === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    profilePicture: Buffer,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.virtual('participatesIn', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'members',
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'assignedTo',
});

// Mongoose Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Because saving to the database is slow
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: true });
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.profilePicture;

  return userObj;
};

userSchema.methods.comparePassword = async function (
  userPassword,
  hashedPassword
) {
  return await bcrypt.compare(userPassword, hashedPassword);
};

userSchema.methods.afterPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < passwordChangedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 1000 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
