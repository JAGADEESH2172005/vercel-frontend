const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    }
    // Removed lat and lng fields
  },
  workType: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid', 'workFromHome'],
    default: 'onsite'
  },
  jobType: {
    type: String,
    enum: ['intern', 'fulltime', 'parttime', 'contract'],
    default: 'fulltime'
  },
  salaryType: {
    type: String,
    enum: ['monthly', 'annum'],
    default: 'annum'
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
  },
  memberLimit: {
    type: Number,
    default: 0 // 0 means no limit
  },
  currentApplicants: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;