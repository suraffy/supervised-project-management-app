const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
