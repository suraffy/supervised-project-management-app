const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, 'secretecode', { expiresIn: '90d' });
};

exports.signup = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    await user.save();

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error('Please provide email and password!');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new Error(`No user with ${email}!`);

    if (!(await user.comparePassword(password, user.password)))
      throw new Error('email or password incorrect!');

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      user,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const rha = req.headers.authorization;

    const token =
      rha && rha.startsWith('Bearer ') ? rha.split(' ')[1] : undefined;
    if (!token) throw new Error();

    const decoded = jwt.verify(token, 'secretecode');

    // Change if the user is not deleted after the token has issued
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) throw new Error();

    // Check for password change after the token has issued
    if (currentUser.afterPasswordChanged(decoded.iat)) throw new Error();

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'You are not authorized!',
    });
  }
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) throw new Error();

      next();
    } catch (err) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission for this action!',
      });
    }
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });
    if (!user) throw new Error(`${email} does not exist!`);

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/users/resetpassword/${resetToken}`;

    console.log({ resetURL });

    res.status(200).json({
      status: 'sucess',
      message: 'Token sent to email!',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error('Invalid toke!');

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const { currentPassword, password, passwordConfirm } = req.body;
    if (!currentPassword)
      throw new Error('Please provide your current password!');

    if (!(await user.comparePassword(currentPassword, user.password)))
      throw new Error('Your current password incorrect!');

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message,
    });
  }
};
