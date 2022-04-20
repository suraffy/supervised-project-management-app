const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'name is required!'],
    trim: true,
    minlength: [3, 'a name must be atleast 3 characters'],
    maxlength: [30, 'a name can not be more than 30 characters'],
  },
  email: {
    type: String,
    unique: true,
    require: [true, 'email is required!'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
    // validate: {
    //   validator: function (el) {
    //     return el.match(/[A-z0-9]+@[A-z0-9]\.[0-9]{1,3}/);
    //   },
    //   message: 'Please provide a valid email!',
    // },
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'supervisor', 'user'],
      message: 'role is either: admin, supervisor, or user',
    },
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'password is required!'],
    minlength: 4,
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
