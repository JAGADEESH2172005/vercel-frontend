# JobLocal Project Troubleshooting Guide

## Common Issues and Solutions

### 1. Node.js Not Found

**Problem**: Command 'node' is not recognized

**Solution**:
1. Download Node.js from https://nodejs.org/en/download/
2. Install with default settings
3. Restart your command prompt/terminal
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. MongoDB Not Installed or Not Running

**Problem**: Connection refused or database errors

**Solution**:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
4. Verify MongoDB is running:
   ```cmd
   mongo --version
   ```

### 3. Port Already in Use

**Problem**: EADDRINUSE error when starting servers

**Solution**:
1. Change the PORT in backend/.env file
2. Or kill the process using the port:
   ```cmd
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### 4. Missing Dependencies

**Problem**: Module not found errors

**Solution**:
1. Navigate to both backend and frontend directories
2. Install dependencies:
   ```cmd
   npm install
   ```

### 5. CORS Errors

**Problem**: Cross-origin request blocked

**Solution**:
1. Ensure frontend runs on http://localhost:3000
2. Ensure backend runs on http://localhost:5000
3. Check backend CORS configuration in server.js

### 6. Environment Variables Not Set

**Problem**: Undefined variables or connection errors

**Solution**:
1. Create backend/.env file with:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=joblocalsecretkey
   ```

### 7. Permission Errors

**Problem**: EACCES or permission denied errors

**Solution**:
1. Run command prompt as Administrator
2. Check file/folder permissions

### 8. Database Connection Issues

**Problem**: MongoDB connection errors

**Solution**:
1. Ensure MongoDB service is running:
   ```cmd
   net start MongoDB
   ```
2. Check MONGO_URI in .env file
3. Verify MongoDB is listening on port 27017:
   ```cmd
   netstat -an | findstr 27017
   ```

## Manual Setup Instructions

### Step 1: Install Prerequisites

1. **Node.js**:
   - Visit https://nodejs.org/en/download/
   - Download the Windows installer (LTS version)
   - Run installer with default settings

2. **MongoDB**:
   - Visit https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run installer with default settings

### Step 2: Start Services

1. **Start MongoDB**:
   ```cmd
   net start MongoDB
   ```

2. **Verify installations**:
   ```cmd
   node --version
   npm --version
   mongo --version
   ```

### Step 3: Install Project Dependencies

1. **Backend dependencies**:
   ```cmd
   cd d:\project\job-portal\backend
   npm install
   ```

2. **Frontend dependencies**:
   ```cmd
   cd d:\project\job-portal\frontend
   npm install
   ```

### Step 4: Configure Environment

Create `d:\project\job-portal\backend\.env` with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=joblocalsecretkey
```

### Step 5: Run the Application

1. **Start backend server**:
   ```cmd
   cd d:\project\job-portal\backend
   npm run dev
   ```

2. **Start frontend server** (in a new terminal):
   ```cmd
   cd d:\project\job-portal\frontend
   npm run dev
   ```

### Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Step 7: Seed Database (Optional)

```cmd
cd d:\project\job-portal\backend
npm run seed
```

## Debugging Tips

### Check Backend Logs
Look for error messages in the terminal where you started the backend server.

### Check Frontend Logs
Open browser developer tools (F12) and check:
1. Console tab for JavaScript errors
2. Network tab for API call failures
3. Elements tab to inspect UI issues

### Check MongoDB Logs
MongoDB logs are typically located at:
- `C:\Program Files\MongoDB\Server\[version]\log\mongod.log`

### Verify Database Connection
```cmd
mongo mongodb://localhost:27017/jobportal
```

## Need Further Help?

If you're still experiencing issues:

1. **Take screenshots** of error messages
2. **Check all logs** (backend, frontend, MongoDB)
3. **Verify all prerequisites** are correctly installed
4. **Ensure all services** are running
5. **Check file permissions** on project directories

For additional support, please provide:
- Error messages
- Screenshots
- Steps you've already tried
- Your operating system version

## Contact Support

If you continue to have issues, please open an issue on the project repository with:
1. A detailed description of the problem
2. Error messages you're seeing
3. Steps you've taken to resolve the issue
4. Your system information (Windows version, Node.js version, etc.)