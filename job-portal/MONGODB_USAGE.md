# Using JobLocal with MongoDB

## Overview
This document explains how to use the JobLocal project with MongoDB for persistent data storage.

## Prerequisites
- MongoDB Community Server installed and running
- Node.js and npm installed
- Basic understanding of command line operations

## Installation and Setup

### 1. Start MongoDB Service
Ensure MongoDB is running on your system:
```cmd
net start MongoDB
```

If the service isn't installed, follow the installation guide in `MONGODB_INSTALLATION.md`.

### 2. Verify MongoDB Connection
Test the connection to MongoDB:
```cmd
mongo
```

You should see the MongoDB shell prompt. Type `exit` to quit.

### 3. Configure Environment Variables
Ensure your `.env` file in the `backend` directory contains:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=joblocalsecretkey
```

### 4. Install Dependencies
Install backend dependencies:
```cmd
cd d:\job-portal\job-portal\backend
npm install
```

Install frontend dependencies:
```cmd
cd d:\job-portal\job-portal\frontend
npm install
```

## Running the Application

### 1. Start Backend Server
```cmd
cd d:\job-portal\job-portal\backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### 2. Start Frontend Server
```cmd
cd d:\job-portal\job-portal\frontend
npm run dev
```

You should see:
```
VITE v4.x.x ready in xxx ms
➜ Local: http://localhost:3000/
```

## Database Seeding

### 1. Run Seed Script
Populate the database with sample data:
```cmd
cd d:\job-portal\job-portal\backend
npm run seed
```

This creates:
- Admin user: admin@example.com / 123456
- Job seeker: jobseeker@example.com / 123456
- Employer: employer@example.com / 123456

### 2. Verify Data
You can verify the data was inserted by connecting to MongoDB:
```cmd
mongo jobportal
```

Then run:
```javascript
db.users.find().pretty()
db.jobs.find().pretty()
```

## Testing the Application

### 1. Access the Frontend
Open your browser and navigate to http://localhost:3000

### 2. Test User Roles
- **Admin**: Login with admin@example.com / 123456
- **Job Seeker**: Login with jobseeker@example.com / 123456
- **Employer**: Login with employer@example.com / 123456

### 3. Verify Functionality
- Test job browsing and searching
- Test job application as a job seeker
- Test job posting as an employer
- Test admin panel as an administrator

## Data Persistence

With MongoDB integration, all data is now persisted:

### Users
- User accounts and profiles
- Passwords (hashed and secure)
- Role assignments

### Jobs
- Job listings with full details
- Employer information
- Job status tracking

### Applications
- Job applications with cover letters
- Application status tracking

### Reviews
- Job reviews and ratings
- User feedback

## Troubleshooting

### MongoDB Connection Issues
1. Verify MongoDB service is running:
   ```cmd
   net start MongoDB
   ```

2. Check connection string in `.env` file

3. Verify MongoDB is listening on port 27017:
   ```cmd
   netstat -an | findstr 27017
   ```

### Authentication Issues
1. Ensure database is seeded with sample users
2. Verify credentials are correct
3. Check JWT_SECRET in `.env` file

### Data Not Persisting
1. Confirm you're using MongoDB models, not tempDb
2. Check that MongoDB service is running
3. Verify MONGO_URI in `.env` file

## Benefits of MongoDB Integration

1. **Data Persistence**: No data loss when server restarts
2. **Scalability**: Can handle large amounts of data
3. **Performance**: Optimized database queries
4. **Relationships**: Proper document relationships with population
5. **Validation**: Built-in schema validation
6. **Indexing**: Database indexing for faster queries

## Migration from tempDb

The project has been fully migrated from the temporary in-memory database to MongoDB. All models, controllers, and routes have been updated to use Mongoose instead of tempDb functions.

### Key Changes
- Replaced tempDb with Mongoose models
- Updated ID references from `id` to `_id`
- Added proper document population
- Improved error handling
- Added data validation

## Next Steps

1. Explore the admin panel to manage users and jobs
2. Test the job application process as a job seeker
3. Create new job listings as an employer
4. Review the code to understand the MongoDB integration
5. Customize the application for your specific needs

## Support

For issues with MongoDB integration:
1. Check the MongoDB logs for errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB service is running
4. Refer to `MONGODB_INSTALLATION.md` for installation help
5. Check `MONGODB_CONNECTION_SUMMARY.md` for detailed changes