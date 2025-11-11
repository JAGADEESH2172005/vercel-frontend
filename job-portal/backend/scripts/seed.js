const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Job = require('../models/Job');

dotenv.config();

const connectDB = require('../config/db');
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    adminCode: 'ADMIN123'
  },
  {
    name: 'Job Seeker',
    email: 'jobseeker@example.com',
    password: '123456',
    role: 'jobseeker'
  },
  {
    name: 'Employer',
    email: 'employer@example.com',
    password: '123456',
    role: 'owner',
    businessName: 'Tech Company'
  }
];

const jobs = [
  {
    title: 'Software Engineer',
    description: 'We are looking for a skilled software engineer to join our team. You will be responsible for developing and maintaining web applications.',
    salary: 800000,
    location: {
      city: 'Bangalore',
      lat: 12.9716,
      lng: 77.5946
    },
    status: 'active'
  },
  {
    title: 'Product Manager',
    description: 'We are seeking an experienced product manager to lead our product development team. You will be responsible for defining product strategy and roadmap.',
    salary: 1200000,
    location: {
      city: 'Mumbai',
      lat: 19.0760,
      lng: 72.8777
    },
    status: 'active'
  },
  {
    title: 'Data Scientist',
    description: 'We are looking for a data scientist to analyze large datasets and build predictive models. Experience with machine learning is required.',
    salary: 1000000,
    location: {
      city: 'Delhi',
      lat: 28.7041,
      lng: 77.1025
    },
    status: 'active'
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users inserted');
    
    // Assign owner ID to jobs
    const owner = createdUsers.find(user => user.role === 'owner');
    const jobsWithOwner = jobs.map(job => ({
      ...job,
      ownerId: owner._id
    }));
    
    // Insert jobs
    await Job.insertMany(jobsWithOwner);
    console.log('Jobs inserted');
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();