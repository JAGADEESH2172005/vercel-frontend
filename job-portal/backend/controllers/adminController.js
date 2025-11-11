const User = require('../models/User');
const Job = require('../models/Job');
const Apply = require('../models/Apply');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const owners = await User.countDocuments({ role: 'owner' });
    const admins = await User.countDocuments({ role: 'admin' });
    
    // Get job statistics
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const inactiveJobs = await Job.countDocuments({ status: 'inactive' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });
    
    // Get application statistics
    const totalApplications = await Apply.countDocuments();
    
    res.json({
      users: {
        total: totalUsers,
        jobSeekers,
        owners,
        admins,
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        inactive: inactiveJobs,
        closed: closedJobs,
      },
      applications: {
        total: totalApplications,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    // In a real implementation, you would track activities in a separate collection
    // For now, we'll return placeholder data
    const activity = [
      { id: 1, action: 'User registered', user: 'John Doe', timestamp: new Date() },
      { id: 2, action: 'Job posted', job: 'Software Engineer', company: 'Tech Corp', timestamp: new Date() },
      { id: 3, action: 'Application submitted', user: 'Jane Smith', job: 'Product Manager', timestamp: new Date() },
    ];
    
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate/deactivate user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // In a real implementation, you would update the user's status
      // For now, we'll just return the user
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag/remove job
// @route   PUT/DELETE /api/admin/jobs/:id
// @access  Private/Admin
const updateJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (job) {
      if (req.body.action === 'flag') {
        job.status = 'inactive';
      } else if (req.body.action === 'remove') {
        job.status = 'closed';
      }
      
      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (user) {
      // Prevent admin from deleting themselves
      if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot delete yourself as an admin' });
      }
      
      // Delete all jobs posted by this user if they are an owner
      if (user.role === 'owner') {
        await Job.deleteMany({ ownerId: user._id });
      }
      
      // Delete all applications by this user
      await Apply.deleteMany({ userId: user._id });
      
      // Delete the user
      await user.remove();
      
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a company (admin only)
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
const deleteCompany = async (req, res) => {
  try {
    console.log('Delete company request received for ID:', req.params.id);
    
    // Assuming company is represented by a user with role 'owner'
    const company = await User.findById(req.params.id);
    
    if (company && company.role === 'owner') {
      console.log('Company found:', company.name);
      
      // Delete all jobs posted by this company
      const jobs = await Job.find({ ownerId: company._id });
      const jobIds = jobs.map(job => job._id);
      console.log('Jobs to delete:', jobIds.length);
      
      // Delete all applications for these jobs
      if (jobIds.length > 0) {
        await Apply.deleteMany({ jobId: { $in: jobIds } });
      }
      
      // Delete all jobs posted by this company
      await Job.deleteMany({ ownerId: company._id });
      
      // Delete the company (user)
      await company.remove();
      
      res.json({ message: 'Company removed successfully' });
    } else {
      console.log('Company not found or not an owner');
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAdminStats,
  getRecentActivity,
  updateUserStatus,
  updateJobStatus,
  deleteUser,
  deleteCompany,
};