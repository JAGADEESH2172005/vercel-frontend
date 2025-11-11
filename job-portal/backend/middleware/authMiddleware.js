const jwt = require('jsonwebtoken');
const User = require('../models/User');
const tempDb = require('../config/tempDb');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const owner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an owner' });
  }
};

const jobseeker = (req, res, next) => {
  if (req.user && req.user.role === 'jobseeker') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a jobseeker' });
  }
};

module.exports = { protect, admin, owner, jobseeker };