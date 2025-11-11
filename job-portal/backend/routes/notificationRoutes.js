const express = require('express');
const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
  sendJobPostedNotification,
  sendNewApplicationNotification
} = require('../controllers/notificationController');
const { protect, admin, owner, jobseeker } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get notifications for current user
router.route('/')
  .get(getNotifications);

// Mark a notification as read
router.route('/:id/read')
  .put(markNotificationAsRead);

// Mark all notifications as read
router.route('/read-all')
  .put(markAllNotificationsAsRead);

// Send general notification
router.route('/send')
  .post(sendNotification);

// Send job posted notifications (owner only)
router.route('/job-posted')
  .post(owner, sendJobPostedNotification);

// Send new application notifications (jobseeker only)
router.route('/new-application')
  .post(jobseeker, sendNewApplicationNotification);

module.exports = router;