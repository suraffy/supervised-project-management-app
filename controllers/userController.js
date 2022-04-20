const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw new Error('Can not find users!');

    res.status(200).json({
      status: 'sucess',
      results: users.length,
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const user = new User({
      name,
      email,
      password,
      passwordConfirm,
    });

    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'a new user created',
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('Can not find the user!');

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new Error('Can not find the user!');

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) throw new Error('Can not find the user!');

    res.status(204).json({
      status: 'success',
      message: 'sucessfully deleted',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
