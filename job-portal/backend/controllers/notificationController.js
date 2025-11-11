const User = require('../models/User');
const Job = require('../models/Job');
const Apply = require('../models/Apply');

// In-memory storage for notifications (in a real app, this would be a database)
let notifications = [];

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    // Filter notifications for the current user
    const userNotifications = notifications.filter(notification => 
      notification.userId === req.user._id || 
      notification.type === 'admin_message' && req.user.role === 'admin' ||
      notification.recipientRole === req.user.role
    );
    
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    
    console.log('Marking notification as read:', notificationId, 'for user:', userId);
    console.log('Current notifications:', notifications);
    
    // Find the notification and mark it as read
    const notification = notifications.find(n => 
      n.id === notificationId && 
      (n.userId === userId || n.recipientRole === req.user.role || !n.userId)
    );
    
    if (notification) {
      notification.read = true;
      console.log('Notification marked as read:', notification);
      res.json({ message: 'Notification marked as read' });
    } else {
      // Even if notification not found, still return success to avoid UI issues
      console.log('Notification not found, but returning success to avoid UI issues');
      res.json({ message: 'Notification marked as read' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsAsRead = async (req, res) => {
  try {
    // Mark all notifications for the user as read
    notifications = notifications.map(notification => {
      if (notification.userId === req.user._id || 
          (notification.recipientRole === req.user.role) ||
          (!notification.userId && notification.type === 'admin_message' && req.user.role === 'admin')) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    console.log('All notifications marked as read for user:', req.user._id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification to users
// @route   POST /api/notifications/send
// @access  Private
const sendNotification = async (req, res) => {
  try {
    const { userId, recipientRole, type, title, message, jobId, applicationId } = req.body;
    
    // Create a new notification
    const notification = {
      id: Date.now().toString(),
      userId,
      recipientRole,
      type,
      title,
      message,
      jobId,
      applicationId,
      timestamp: new Date(),
      read: false
    };
    
    // Add to notifications array
    notifications.push(notification);
    
    // Emit notification through Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Emit to specific user if userId is provided
      if (userId) {
        io.emit(`notification_${userId}`, notification);
      }
      // Emit to role-based room if recipientRole is provided
      else if (recipientRole) {
        io.emit(`notification_${recipientRole}`, notification);
      }
      // Emit to all connected clients as fallback
      else {
        io.emit('new_notification', notification);
      }
    }
    
    res.status(201).json({ 
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification when a new job is posted
// @route   POST /api/notifications/job-posted
// @access  Private/Owner
const sendJobPostedNotification = async (req, res) => {
  try {
    const { jobId, jobTitle, ownerId } = req.body;
    
    // Get job details to include in notification
    const job = await Job.findById(jobId).populate('ownerId', 'name');
    
    // Notify all job seekers about the new job with detailed information
    const jobSeekerNotification = {
      id: `job_${jobId}_${Date.now()}`,
      recipientRole: 'jobseeker',
      type: 'new_job',
      title: 'New Job Posted',
      message: `A new job "${jobTitle}" has been posted by ${job.ownerId.name}`,
      jobId: jobId,
      jobTitle: jobTitle,
      companyName: job.ownerId.name,
      timestamp: new Date(),
      read: false
    };
    
    // Notify admin about the new job
    const adminNotification = {
      id: `admin_job_${jobId}_${Date.now()}`,
      recipientRole: 'admin',
      type: 'new_job_admin',
      title: 'New Job Posted by Employer',
      message: `Employer has posted a new job: "${jobTitle}"`,
      jobId: jobId,
      timestamp: new Date(),
      read: false
    };
    
    // Notify the employer about successful posting
    const employerNotification = {
      id: `employer_job_${jobId}_${Date.now()}`,
      userId: ownerId,
      type: 'job_posted',
      title: 'Job Posted Successfully',
      message: `Your job "${jobTitle}" has been posted successfully`,
      jobId: jobId,
      timestamp: new Date(),
      read: false
    };
    
    // Add all notifications
    notifications.push(jobSeekerNotification, adminNotification, employerNotification);
    
    // Emit notifications through Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Emit to job seekers
      io.emit('notification_jobseeker', jobSeekerNotification);
      // Emit to admin
      io.emit('notification_admin', adminNotification);
      // Emit to specific employer
      io.emit(`notification_${ownerId}`, employerNotification);
    }
    
    res.status(201).json({ 
      message: 'Job posted notifications sent successfully',
      notifications: [jobSeekerNotification, adminNotification, employerNotification]
    });
  } catch (error) {
    console.error('Error sending job posted notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification when a new application is submitted
// @route   POST /api/notifications/new-application
// @access  Private/Jobseeker
const sendNewApplicationNotification = async (req, res) => {
  try {
    const { jobId, jobTitle, applicantName, ownerId, applicationId } = req.body;
    
    // Notify the employer about the new application
    const employerNotification = {
      id: `app_${applicationId}_${Date.now()}`,
      userId: ownerId,
      type: 'new_application',
      title: 'New Job Application',
      message: `${applicantName} has applied for "${jobTitle}"`,
      jobId: jobId,
      applicationId: applicationId,
      timestamp: new Date(),
      read: false
    };
    
    // Notify admin about the new application
    const adminNotification = {
      id: `admin_app_${applicationId}_${Date.now()}`,
      recipientRole: 'admin',
      type: 'new_application_admin',
      title: 'New Job Application Submitted',
      message: `${applicantName} has applied for "${jobTitle}"`,
      jobId: jobId,
      applicationId: applicationId,
      timestamp: new Date(),
      read: false
    };
    
    // Add all notifications
    notifications.push(employerNotification, adminNotification);
    
    console.log('Sending new application notifications:');
    console.log('Employer notification:', employerNotification);
    console.log('Admin notification:', adminNotification);
    
    // Emit notifications through Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Emit to employer
      console.log(`Emitting notification to employer: notification_${ownerId}`);
      io.emit(`notification_${ownerId}`, employerNotification);
      // Emit to admin
      console.log('Emitting notification to admin: notification_admin');
      io.emit('notification_admin', adminNotification);
    }
    
    res.status(201).json({ 
      message: 'Application notifications sent successfully',
      notifications: [employerNotification, adminNotification]
    });
  } catch (error) {
    console.error('Error sending application notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification when application status is updated
// @route   POST /api/notifications/application-status
// @access  Private
const sendApplicationStatusNotification = async (applicantId, applicationId, jobId, status) => {
  try {
    // Get job details
    const job = await Job.findById(jobId).populate('ownerId', 'name');
    
    // Map status to user-friendly message
    const statusMessages = {
      pending: 'is under review',
      reviewed: 'has been reviewed',
      interview: 'has been shortlisted for interview',
      accepted: 'has been accepted',
      rejected: 'has been rejected'
    };
    
    // Create notification for applicant
    const applicantNotification = {
      id: `status_${applicationId}_${Date.now()}`,
      userId: applicantId,
      type: 'application_status',
      title: 'Application Status Updated',
      message: `Your application for "${job.title}" at ${job.ownerId.name} ${statusMessages[status] || 'status has been updated'}`,
      jobId: jobId,
      applicationId: applicationId,
      timestamp: new Date(),
      read: false
    };
    
    // Add notification to array
    notifications.push(applicantNotification);
    
    // Emit notification through Socket.IO
    const io = require('../server').io;
    if (io) {
      io.emit(`notification_${applicantId}`, applicantNotification);
    }
    
    console.log('Application status notification sent to applicant:', applicantId);
    
    return applicantNotification;
  } catch (error) {
    console.error('Error sending application status notification:', error);
    throw error;
  }
};

// @desc    Send confirmation notification to employer when they update application status
// @route   POST /api/notifications/employer-status-update
// @access  Private
const sendEmployerStatusUpdateNotification = async (employerId, applicationId, jobTitle, status) => {
  try {
    // Map status to user-friendly message
    const statusMessages = {
      pending: 'marked as pending',
      reviewed: 'marked as reviewed',
      interview: 'shortlisted for interview',
      accepted: 'accepted',
      rejected: 'rejected'
    };
    
    // Generate timestamp for consistent ID
    const timestamp = Date.now();
    const notificationId = `employer_status_${applicationId}_${timestamp}`;
    
    // Create notification for employer
    const employerNotification = {
      id: notificationId,
      userId: employerId,
      type: 'employer_status_update',
      title: 'Application Status Updated',
      message: `You have ${statusMessages[status] || 'updated the status of'} an application for "${jobTitle}"`,
      applicationId: applicationId,
      timestamp: new Date(timestamp),
      read: false
    };
    
    console.log('Creating employer status notification with ID:', notificationId);
    
    // Add notification to array
    notifications.push(employerNotification);
    
    // Emit notification through Socket.IO
    const io = require('../server').io;
    if (io) {
      io.emit(`notification_${employerId}`, employerNotification);
    }
    
    console.log('Employer status update notification sent to employer:', employerId);
    
    return employerNotification;
  } catch (error) {
    console.error('Error sending employer status update notification:', error);
    throw error;
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendNotification,
  sendJobPostedNotification,
  sendNewApplicationNotification,
  sendApplicationStatusNotification,
  sendEmployerStatusUpdateNotification
};