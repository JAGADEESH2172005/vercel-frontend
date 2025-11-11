const express = require('express');
const {
  getUserDashboard,
  getOwnerDashboard,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, jobseeker, owner } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/dashboard').get(protect, jobseeker, getUserDashboard);
router.route('/owner-dashboard').get(protect, owner, getOwnerDashboard);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;