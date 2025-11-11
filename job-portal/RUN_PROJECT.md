# How to Run the JobLocal Project

## Prerequisites Installation

### 1. Install Node.js
1. Visit https://nodejs.org/en/download/
2. Download the Windows installer (LTS version recommended)
3. Run the installer and follow the installation wizard
4. Restart your command prompt/terminal

### 2. Install MongoDB
1. Visit https://www.mongodb.com/try/download/community
2. Download the MongoDB Community Server for Windows
3. Run the installer with default settings
4. Choose "Run service as Network Service user" and complete installation

## Project Setup

### 1. Verify Installations
Open a new command prompt and run:
```cmd
node --version
npm --version
mongo --version
```

### 2. Start MongoDB
MongoDB should start automatically as a service after installation. If not:
1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`

### 3. Set Up the Project
Navigate to the project directory:
```cmd
cd d:\job-portal\job-portal
```

Run the setup script:
```cmd
setup.bat
```

Or manually install dependencies:
```cmd
cd backend
npm install
cd ../frontend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend` directory with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=joblocalsecretkey
```

### 5. Run the Application

#### Start Backend Server
In one terminal, navigate to the backend directory:
```cmd
cd d:\job-portal\job-portal\backend
npm run dev
```

#### Start Frontend Server
In another terminal, navigate to the frontend directory:
```cmd
cd d:\job-portal\job-portal\frontend
npm run dev
```

### 6. Seed Database (Optional)
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

### Common Issues and Solutions

1. **Port already in use**
   - Change PORT in `.env` file
   - Or kill the process using the port:
     ```cmd
     netstat -ano | findstr :5000
     taskkill /PID <PID> /F
     ```

2. **MongoDB connection error**
   - Ensure MongoDB service is running:
     ```cmd
     net start MongoDB
     ```
   - Check MONGO_URI in `.env` file

3. **Module not found errors**
   - Reinstall dependencies:
     ```cmd
     cd backend && npm install
     cd ../frontend && npm install
     ```

4. **CORS errors**
   - Check if frontend (http://localhost:3000) and backend (http://localhost:5000) URLs are correct

5. **Permission errors**
   - Run command prompt as Administrator
   - Check file/folder permissions

### Need Help?

If you encounter any issues:
1. Check the console logs in both frontend and backend
2. Check the browser's developer tools (Network tab)
3. Check MongoDB logs
4. Refer to README.md and DEVELOPMENT.md for more details

For further assistance, please open an issue on the repository.