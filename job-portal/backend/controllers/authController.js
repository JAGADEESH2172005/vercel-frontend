const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const speakeasy = require('speakeasy');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, businessName, adminCode } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Additional validation for admin role
    if (role === 'admin' && adminCode !== 'ADMIN123') {
      return res.status(400).json({ message: 'Invalid admin code' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      businessName: role === 'owner' ? businessName : undefined,
      adminCode: role === 'admin' ? adminCode : undefined,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Log successful login
      user.loginLogs.push({
        loginType: 'email',
        success: true,
        ipAddress: req.ip
      });
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Log failed login attempt
      if (user) {
        user.loginLogs.push({
          loginType: 'email',
          success: false,
          ipAddress: req.ip
        });
        await user.save();
      }
      
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Firebase Auth user & get token
// @route   POST /api/auth/firebase-login
// @access  Public
const firebaseLogin = async (req, res) => {
  const { uid, email, name, photoURL } = req.body;

  try {
    // Try to find existing user by email first
    let user = await User.findOne({ email });

    if (user) {
      // Update user with Firebase UID if not already set
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.profilePicture = photoURL || user.profilePicture;
        await user.save();
      }
    } else {
      // Create new user if doesn't exist
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: uid, // Use Firebase UID as password placeholder
        role: 'jobseeker', // Default role for Firebase users
        firebaseUid: uid,
        profilePicture: photoURL,
        isFirebaseAuth: true
      });
    }

    // Log successful login
    user.loginLogs.push({
      loginType: 'firebase',
      success: true,
      ipAddress: req.ip
    });
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP for mobile login
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { phone } = req.body;

  try {
    // Generate a 6-digit OTP
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET || 'jobportal-secret-key',
      digits: 6,
      step: 300, // 5 minutes expiry
      encoding: 'base32'
    });

    // In development, log OTP to console for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== OTP FOR DEVELOPMENT TESTING ===');
      console.log(`PHONE: ${phone}`);
      console.log(`OTP CODE: ${otp}`);
      console.log('====================================\n');
    }

    // Find or create user with this phone number
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create a new user with phone number
      user = new User({
        name: `User ${phone}`,
        email: `${phone}@jobportal.com`, // Temporary email
        password: phone, // Use phone as temporary password
        phone: phone,
        role: 'jobseeker'
      });
    }

    // Save OTP and expiry time
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Log OTP request
    user.loginLogs.push({
      loginType: 'otp',
      success: false, // Not successful yet, just requested
      ipAddress: req.ip
    });

    await user.save();

    res.json({ 
      message: 'OTP sent successfully',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, userId } = req.body;

    // Validate required fields
    if (!phone || !otp || !userId) {
      return res.status(400).json({ 
        message: 'Phone number, OTP, and user ID are required' 
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is expired
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      // Log failed attempt
      user.loginLogs.push({
        loginType: 'otp',
        success: false,
        ipAddress: req.ip
      });
      await user.save();
      
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET || 'jobportal-secret-key',
      encoding: 'base32',
      token: otp,
      window: 2,
      digits: 6,
      step: 300
    });

    if (verified) {
      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpiry = undefined;
      
      // Log successful login
      user.loginLogs.push({
        loginType: 'otp',
        success: true,
        ipAddress: req.ip
      });
      
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      // Log failed attempt
      user.loginLogs.push({
        loginType: 'otp',
        success: false,
        ipAddress: req.ip
      });
      await user.save();
      
      res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
  }
};

// @desc    Get login history for admin
// @route   GET /api/auth/login-history/:userId
// @access  Private/Admin
const getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      loginLogs: user.loginLogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser,
  firebaseLogin,
  getUserProfile,
  sendOTP,
  verifyOTP,
  getLoginHistory
};