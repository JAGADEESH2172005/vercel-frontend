const Job = require('../models/Job');
const Apply = require('../models/Apply');
const Review = require('../models/Review');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Owner
const createJob = async (req, res) => {
  const { title, description, salary, location, workType, jobType, salaryType, requiredSkills, memberLimit } = req.body;

  try {
    // Validate required location fields
    if (!location || !location.city || !location.state || !location.country) {
      return res.status(400).json({ message: 'City, state, and country are required in location' });
    }

    const job = new Job({
      title,
      description,
      salary,
      location: {
        city: location.city,
        state: location.state,
        country: location.country
      },
      workType: workType || 'onsite',
      jobType: jobType || 'fulltime',
      salaryType: salaryType || 'annum',
      requiredSkills: requiredSkills || [],
      ownerId: req.user._id,
      memberLimit: memberLimit || 0 // 0 means no limit
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).populate('ownerId', 'name');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('ownerId', 'name phone');
    
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Owner/Admin
const updateJob = async (req, res) => {
  const { title, description, salary, location, workType, jobType, salaryType, requiredSkills, status, memberLimit } = req.body;

  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      // Check if user is owner or admin
      if (req.user.role !== 'admin' && job.ownerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      job.title = title || job.title;
      job.description = description || job.description;
      job.salary = salary || job.salary;
      if (location) {
        job.location = {
          city: location.city || job.location.city,
          state: location.state || job.location.state,
          country: location.country || job.location.country
        };
      }
      job.workType = workType || job.workType;
      job.jobType = jobType || job.jobType;
      job.salaryType = salaryType || job.salaryType;
      job.requiredSkills = requiredSkills || job.requiredSkills;
      job.status = status || job.status;
      job.memberLimit = (memberLimit !== undefined) ? memberLimit : job.memberLimit;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Owner/Admin
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      // Check if user is owner or admin
      if (req.user.role !== 'admin' && job.ownerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await job.remove();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Jobseeker
const applyJob = async (req, res) => {
  const { coverLetter } = req.body;
  const resumeFile = req.file ? req.file.path : '';

  try {
    const job = await Job.findById(req.params.id).populate('ownerId', 'name');

    if (job) {
      // Check if job has reached member limit
      if (job.memberLimit > 0 && job.currentApplicants >= job.memberLimit) {
        return res.status(400).json({ message: 'This job has reached its application limit' });
      }

      const alreadyApplied = await Apply.findOne({
        userId: req.user._id,
        jobId: req.params.id
      });

      if (alreadyApplied) {
        return res.status(400).json({ message: 'Already applied for this job' });
      }

      const application = new Apply({
        userId: req.user._id,
        jobId: req.params.id,
        coverLetter,
        resumeFile,
      });

      const createdApplication = await application.save();
      
      // Increment current applicants count
      job.currentApplicants = job.currentApplicants + 1;
      await job.save();
      
      // Send notification about new application
      try {
        const axios = require('axios');
        // In a real implementation, you would use internal service calls or events
        // For now, we'll make an internal API call
        await axios.post('http://localhost:5002/api/notifications/new-application', {
          jobId: req.params.id,
          jobTitle: job.title,
          applicantName: req.user.name,
          ownerId: job.ownerId._id,
          applicationId: createdApplication._id
        }, {
          headers: {
            'Authorization': req.headers.authorization
          }
        });
      } catch (notificationError) {
        console.error('Failed to send application notifications:', notificationError);
      }
      
      res.status(201).json(createdApplication);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a job
// @route   POST /api/jobs/:id/save
// @access  Private/Jobseeker
const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;
    
    // Get user and check if job is already saved
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if job is already saved
    const isAlreadySaved = user.savedJobs && user.savedJobs.includes(jobId);
    
    if (isAlreadySaved) {
      // Remove from saved jobs
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.json({ message: 'Job removed from saved jobs', saved: false });
    } else {
      // Add to saved jobs
      if (!user.savedJobs) {
        user.savedJobs = [];
      }
      user.savedJobs.push(jobId);
      await user.save();
      return res.json({ message: 'Job saved successfully', saved: true });
    }
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review for a job
// @route   POST /api/jobs/:id/review
// @access  Private
const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      const alreadyReviewed = await Review.findOne({
        userId: req.user._id,
        jobId: req.params.id
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Already reviewed this job' });
      }

      const review = new Review({
        userId: req.user._id,
        jobId: req.params.id,
        rating,
        comment,
      });

      const createdReview = await review.save();
      
      // Update job with new review
      // In a real implementation, you might want to calculate average rating
      res.status(201).json(createdReview);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a job
// @route   GET /api/jobs/:id/reviews
// @access  Public
const getJobReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ jobId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching job reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications for a job
// @route   GET /api/jobs/:id/applications
// @access  Private/Owner/Admin
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is owner or admin
    if (req.user.role !== 'admin' && job.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Apply.find({ jobId: req.params.id }).populate('userId', 'name email phone');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Owner/Admin
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const application = await Apply.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is owner of the job or admin
    const job = await Job.findById(application.jobId);
    if (req.user.role !== 'admin' && job.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private/Jobseeker/Admin/Owner
const deleteApplication = async (req, res) => {
  try {
    console.log('Delete application request received for ID:', req.params.id);
    
    const application = await Apply.findById(req.params.id);

    if (application) {
      console.log('Application found for user:', application.userId);
      console.log('Current user:', req.user._id);
      console.log('Current user role:', req.user.role);
      
      // Check if user is the applicant, owner of the job, or admin
      const job = await Job.findById(application.jobId);
      const isJobOwner = job && job.ownerId.toString() === req.user._id.toString();
      
      if (req.user.role !== 'admin' && 
          application.userId.toString() !== req.user._id.toString() && 
          !isJobOwner) {
        console.log('Not authorized to delete application');
        return res.status(401).json({ message: 'Not authorized' });
      }

      await application.remove();
      res.json({ message: 'Application removed' });
    } else {
      console.log('Application not found');
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
  saveJob,
  addReview,
  getJobReviews,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
  upload,
};