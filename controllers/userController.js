const multer = require('multer');
const User = require('./../models/userModel');

const upload = multer({
  // dest: '/public/img/user',
  limits: {
    filesize: 1048576,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.match(/^image/)) {
      cb('Unsuported file format!', false);
    }

    cb(null, true);
  },
  // storage: multer.diskStorage({
  //   // destination: (req, file, cb) => cb(null, './public/img/user'),
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split('/')[1];
  //     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  //   },
  // }),
}).single('profilePicture');

// exports.uploadProfilePicture = upload.single('profilePicture');

exports.uploadProfilePicture = (req, res, next) => {
  upload(req, res, function (err) {
    if (err)
      return res.status(400).json({
        status: 'fail',
        message: err,
      });

    next();
  });
};

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

exports.getUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email })
      .populate('projects')
      .populate('participatesIn')
      .populate('tasks');
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

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'Can not find the user!',
      });

    await user.update({ role }, { new: true, runValidators: true });

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOneAndDelete({ email });
    if (!user)
      return res.status(404).json({
        status: 'fail',
        message: 'Can not find the user!',
      });

    res.status(204).json({
      status: 'success',
      user: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('projects')
      .populate('participatesIn')
      .populate('tasks');

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

exports.updateProfile = async (req, res) => {
  try {
    const name = req.body.name;
    const profilePicture = req.file.buffer;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, profilePicture },
      {
        new: true,
        // runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      user: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
