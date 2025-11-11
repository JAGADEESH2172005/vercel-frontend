const express = require('express');
const {
  registerUser,
  authUser,
  firebaseLogin,
  getUserProfile,
  sendOTP,
  verifyOTP,
  getLoginHistory
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(authUser);
router.route('/firebase-login').post(firebaseLogin);
router.route('/me').get(protect, getUserProfile);
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/login-history/:userId').get(protect, admin, getLoginHistory);

module.exports = router;