const express = require('express');
const {
  signup,
  login,
  authenticate,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  profile,
  updateProfile,
  deleteProfile,
  uploadProfilePicture,
} = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.patch('/updatepassword', authenticate, updatePassword);

router.get('/me', authenticate, profile);
router.patch('/updateme', authenticate, uploadProfilePicture, updateProfile);
router.delete('/deleteme', authenticate, deleteProfile);

router.route('/').get(authenticate, restrictTo('admin'), getAllUsers);
router
  .route('/:email')
  .get(authenticate, restrictTo('admin'), getUser)
  .patch(authenticate, restrictTo('admin'), updateUserRole)
  .delete(authenticate, restrictTo('admin'), deleteUser);

module.exports = router;
