const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUserRole,
  deleteUser,
} = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:email').get(getUser).patch(updateUserRole).delete(deleteUser);

module.exports = router;
