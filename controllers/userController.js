const User = require('./../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) throw new Error('Can not find users!');

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
    const user = new User(req.body);
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
    const email = req.params.email;
    const user = await User.findOne({ email });
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

exports.updateUserRole = async (req, res) => {
  try {
    const email = req.params.email;
    const role = req.body.role;
    const user = await User.findOneAndUpdate({ email }, role, {
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
    const email = req.params.email;
    const user = await User.findOneAndDelete({ email });
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
