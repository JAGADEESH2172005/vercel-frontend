const User = require('../models/User');
const Job = require('../models/Job');
const Apply = require('../models/Apply');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
  try {
    // Get user profile
    const user = await User.findById(req.user._id).select('-password');
    
    // Get applied jobs
    const appliedApplications = await Apply.find({ userId: req.user._id })
      .populate('jobId', 'title ownerId')
      .populate('jobId.ownerId', 'name');
    
    // Get saved jobs with populated data
    const savedJobs = await Job.find({ _id: { $in: user.savedJobs || [] } })
      .populate('ownerId', 'name');
    
    res.json({
      user,
      appliedJobs: appliedApplications,
      savedJobs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get owner dashboard data
// @route   GET /api/users/owner-dashboard
// @access  Private/Owner
const getOwnerDashboard = async (req, res) => {
  try {
    // Get owner profile
    const owner = await User.findById(req.user._id).select('-password');
    
    // Get owner's jobs
    const jobs = await Job.find({ ownerId: req.user._id });
    
    // Get job statistics
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === 'active').length;
    
    // Get total applicants (in a real implementation, you would aggregate this)
    const jobIds = jobs.map(job => job._id);
    const totalApplicants = await Apply.countDocuments({ jobId: { $in: jobIds } });
    
    // Get recent applications (last 5 applications)
    const recentApplications = await Apply.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email phone')
      .populate('jobId', 'title');
    
    res.json({
      owner,
      jobs,
      recentApplications,
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.bio = bio || user.bio;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserDashboard,
  getOwnerDashboard,
  updateUserProfile,
};