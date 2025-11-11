const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Enable CORS for Express
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:3002", 
    "http://localhost:3003"
    // Add your frontend URL here when deploying
  ],
  credentials: true
}));

// Initialize Socket.io with proper CORS configuration
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001", 
      "http://localhost:3002", 
      "http://localhost:3003"
      // Add your frontend URL here when deploying
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling']
});

// Make io instance available to routes and controllers
app.set('io', io);

// Middleware
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'jobportal_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback", // This will work with any domain
    passReqToCallback: true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const User = require('./models/User');
      
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        return done(null, user);
      }
      
      // Get role from session or default to jobseeker
      const role = req.session && req.session.role ? req.session.role : 'jobseeker';
      const businessName = req.session && req.session.businessName ? req.session.businessName : undefined;
      
      // Create new user if doesn't exist
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: 'google_auth', // Placeholder password for Google auth users
        role: role,
        businessName: role === 'owner' ? businessName : undefined,
        isGoogleAuth: true
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_room', (data) => {
    socket.join(data.jobId);
    console.log(`User with ID: ${socket.id} joined room: ${data.jobId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.jobId).emit("receive_message", data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Google OAuth routes with role selection
app.get('/api/auth/google',
  (req, res, next) => {
    // Store role and businessName in session if provided
    if (req.query.role) {
      req.session = req.session || {};
      req.session.role = req.query.role;
      if (req.query.businessName) {
        req.session.businessName = req.query.businessName;
      }
      req.session.save(() => {
        next();
      });
    } else {
      next();
    }
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend with user data
    const token = require('./utils/generateToken')(req.user._id);
    // Get the origin from the request to dynamically set the redirect URL
    const origin = req.get('origin') || req.get('referer') || 'http://localhost:3000';
    // Redirect to login page with success parameters
    res.redirect(`${origin}/login?google_auth_success=true&token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'JobLocal API is running' });
});

const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export io instance for use in controllers
module.exports.io = io;