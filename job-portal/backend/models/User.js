const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['jobseeker', 'owner', 'admin'],
    default: 'jobseeker'
  },
  businessName: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  isFirebaseAuth: {
    type: Boolean,
    default: false
  },
  firebaseUid: {
    type: String
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  loginLogs: [{
    loginType: {
      type: String,
      enum: ['email', 'google', 'firebase', 'otp'],
      required: true
    },
    success: {
      type: Boolean,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }],
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Encrypt password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;