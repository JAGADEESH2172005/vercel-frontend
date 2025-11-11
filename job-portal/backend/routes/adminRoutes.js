const express = require('express');
const {
  getAdminStats,
  getRecentActivity,
  updateUserStatus,
  updateJobStatus,
  getAllUsers,
  deleteUser,
  deleteCompany,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/activity').get(protect, admin, getRecentActivity);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id').put(protect, admin, updateUserStatus);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/jobs/:id').put(protect, admin, updateJobStatus);
router.route('/companies/:id').delete(protect, admin, deleteCompany);

module.exports = router;