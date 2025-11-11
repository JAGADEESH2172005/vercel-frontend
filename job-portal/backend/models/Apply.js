const mongoose = require('mongoose');

const applySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  coverLetter: {
    type: String
  },
  resumeFile: {
    type: String
  },
  // Additional user information at the time of application
  userInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Pre-save middleware to populate user info
applySchema.pre('save', async function(next) {
  if (this.isNew) {
    const User = require('./User');
    const user = await User.findById(this.userId);
    if (user) {
      this.userInfo = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      };
    }
  }
  next();
});

const Apply = mongoose.model('Apply', applySchema);

module.exports = Apply;