const express = require('express');
const {
  getApplicationById,
  getUserApplications,
  getUserById,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get application by ID
router.route('/:id')
  .get(getApplicationById);

// Update application status
router.route('/:id/status')
  .put(updateApplicationStatus);

// Get all applications for a user
router.route('/user/:userId')
  .get(getUserApplications);

// Get user by ID
router.route('/users/:id')
  .get(getUserById);

module.exports = router;