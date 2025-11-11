const Apply = require('../models/Apply');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (Admin, Owner, Jobseeker)
const getApplicationById = async (req, res) => {
  try {
    console.log('Fetching application with ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    
    const application = await Apply.findById(req.params.id)
      .populate('userId', 'name email role phone address bio')
      .populate('jobId', 'title ownerId workType jobType salary salaryType location status')
      .populate('jobId.ownerId', 'name phone');
    
    if (application) {
      console.log('Application found:', application._id);
      
      // Check permissions
      // Admins can view any application
      // Jobseekers can view their own applications
      // Owners can view applications for their jobs
      const isAuthorized = 
        req.user.role === 'admin' ||
        application.userId._id.toString() === req.user._id.toString() ||
        (application.jobId.ownerId && application.jobId.ownerId._id.toString() === req.user._id.toString());
      
      console.log('Authorization check:', {
        isAdmin: req.user.role === 'admin',
        isApplicant: application.userId._id.toString() === req.user._id.toString(),
        isJobOwner: application.jobId.ownerId && application.jobId.ownerId._id.toString() === req.user._id.toString(),
        isAuthorized
      });
      
      if (!isAuthorized) {
        console.log('User not authorized to view application');
        return res.status(401).json({ message: 'Not authorized to view this application' });
      }
      
      console.log('Returning application data');
      res.json(application);
    } else {
      console.log('Application not found');
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a user (jobseeker)
// @route   GET /api/applications/user/:userId
// @access  Private (Admin, User themselves)
const getUserApplications = async (req, res) => {
  try {
    // Check permissions
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(401).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Apply.find({ userId: req.params.userId })
      .populate('jobId', 'title ownerId workType jobType salary salaryType location status')
      .populate('jobId.ownerId', 'name')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin, Owner, Jobseeker)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      // Check permissions
      // Admins can view any user
      // Users can view their own profile
      // Others can view public profile info (in a real implementation)
      const isAuthorized = 
        req.user.role === 'admin' ||
        req.user._id.toString() === req.params.id;

      if (!isAuthorized) {
        // Return limited info for non-authorized users
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      }

      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin, Job Owner)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    console.log('Updating application status:', req.params.id, status);
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    
    // Find the application
    const application = await Apply.findById(req.params.id)
      .populate('jobId', 'ownerId title');

    if (!application) {
      console.log('Application not found for status update');
      return res.status(404).json({ message: 'Application not found' });
    }
    
    console.log('Application found:', application._id);
    console.log('Job owner ID:', application.jobId.ownerId);

    // Check permissions - only admin or job owner can update status
    const isAuthorized = 
      req.user.role === 'admin' ||
      (application.jobId && application.jobId.ownerId && 
       application.jobId.ownerId.toString() === req.user._id.toString());

    console.log('Authorization check for status update:', {
      isAdmin: req.user.role === 'admin',
      isJobOwner: application.jobId && application.jobId.ownerId && 
                  application.jobId.ownerId.toString() === req.user._id.toString(),
      isAuthorized
    });

    if (!isAuthorized) {
      console.log('User not authorized to update application status');
      return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    // Update the application status
    application.status = status;
    const updatedApplication = await application.save();
    
    console.log('Application status updated successfully');
    
    // Send notification to applicant about status change
    try {
      await require('./notificationController').sendApplicationStatusNotification(
        application.userId,
        application._id,
        application.jobId,
        status
      );
    } catch (notificationError) {
      console.error('Failed to send application status notification:', notificationError);
    }
    
    // Send confirmation notification to employer
    try {
      await require('./notificationController').sendEmployerStatusUpdateNotification(
        application.jobId.ownerId,
        application._id,
        application.jobId.title,
        status
      );
    } catch (notificationError) {
      console.error('Failed to send employer status update notification:', notificationError);
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApplicationById,
  getUserApplications,
  getUserById,
  updateApplicationStatus
};