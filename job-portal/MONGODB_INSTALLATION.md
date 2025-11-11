# MongoDB Installation Guide for JobLocal Project

## Overview
This guide will help you install MongoDB and connect it to your JobLocal project. The project has been updated to use MongoDB instead of the temporary in-memory database.

## Prerequisites
- Windows 10 or later
- Administrator privileges

## Installation Steps

### Step 1: Download MongoDB
1. Visit the official MongoDB download page: https://www.mongodb.com/try/download/community
2. Select the following options:
   - Version: Latest stable release
   - Platform: Windows x64
   - Package: MSI

### Step 2: Install MongoDB
1. Run the downloaded MSI installer as Administrator
2. Choose "Complete" setup type
3. Check "Install MongoDB as a Service"
4. Select "Run service as Network Service user"
5. Leave data and log directories as default
6. Complete the installation

### Step 3: Verify Installation
Open Command Prompt as Administrator and run:
```cmd
net start MongoDB
```

You should see:
```
The MongoDB Server (MongoDB) service is starting.
The MongoDB Server (MongoDB) service was started successfully.
```

### Step 4: Test Connection
Open Command Prompt and run:
```cmd
mongo
```

You should see the MongoDB shell prompt:
```
MongoDB shell version vX.X.X
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("...") }
MongoDB server version: X.X.X
>
```

Type `exit` to quit the shell.

## Configuration

The project is already configured to connect to MongoDB. The connection string is set in the `.env` file:
```
MONGO_URI=mongodb://localhost:27017/jobportal
```

## Starting the Application

1. Start the MongoDB service:
   ```cmd
    ```

2. Start the backend server:
   ```cmd
   cd d:\job-portal\job-portal\backend
   npm start
   ```

3. Start the frontend:
   ```cmd
   cd d:\job-portal\job-portal\frontend
   npm run dev
   ```

## Seeding the Database

To populate the database with sample data:
```cmd
cd d:\job-portal\job-portal\backend
npm run seed
```

This creates:
- Admin user: admin@example.com / 123456
- Job seeker: jobseeker@example.com / 123456
- Employer: employer@example.com / 123456

## Troubleshooting

### MongoDB Service Not Starting
1. Check if the service is installed:
   ```cmd
   sc query MongoDB
   ```

2. If not installed, reinstall MongoDB with the service option checked

3. If installed but not running:
   ```cmd
   net start MongoDB
   ```

### Connection Refused Errors
1. Verify MongoDB is running:
   ```cmd
   net start MongoDB
   ```

2. Check the connection string in `.env` file

3. Ensure port 27017 is not blocked by firewall

### Authentication Issues
1. Make sure you're using the correct credentials
2. Check that the database has been seeded properly

## Project Structure Changes

The project has been updated to use MongoDB models instead of the temporary in-memory database:

- **User Model**: Uses Mongoose schema with password hashing
- **Job Model**: Uses Mongoose schema with proper references
- **Application Model**: Tracks job applications
- **Review Model**: Stores job reviews

All controllers have been updated to use MongoDB queries instead of tempDb functions.