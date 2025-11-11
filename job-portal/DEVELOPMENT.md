# Development Guide

This guide will help you set up and run the JobLocal project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
job-portal/
├── backend/          # Node.js + Express backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   ├── scripts/      # Helper scripts
│   ├── uploads/      # Uploaded files (resumes)
│   ├── server.js     # Entry point
│   └── package.json  # Backend dependencies
├── frontend/         # React + Vite frontend
│   ├── src/          # Source code
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   ├── i18n.js      # Internationalization
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html       # HTML template
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── package.json     # Frontend dependencies
├── setup.sh             # Setup script (Linux/Mac)
├── setup.bat            # Setup script (Windows)
└── README.md            # Project documentation
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-portal
```

### 2. Run Setup Script

#### On Windows:
```cmd
setup.bat
```

#### On Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Manual Setup (Alternative)

#### Backend Setup:
```bash
cd backend
npm install
```

#### Frontend Setup:
```bash
cd frontend
npm install
```

### 4. Environment Configuration

#### Backend (.env file):
Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend:
The frontend is configured to connect to the backend at `http://localhost:5000`. No additional configuration is needed.

### 5. Database Setup

Make sure MongoDB is running on your system. You can start it with:

```bash
mongod
```

To seed the database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- An admin user (admin@example.com / 123456)
- A job seeker user (jobseeker@example.com / 123456)
- An employer user (employer@example.com / 123456)
- Sample job listings

## Running the Application

### Backend:
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`.

### Frontend:
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`.

## Development Workflow

### Frontend Development

1. All React components are in `frontend/src/`
2. Pages are in `frontend/src/pages/`
3. Reusable components are in `frontend/src/components/`
4. Context providers are in `frontend/src/context/`
5. Utility functions are in `frontend/src/utils/`

### Backend Development

1. Models are in `backend/models/`
2. Controllers are in `backend/controllers/`
3. Routes are in `backend/routes/`
4. Middleware is in `backend/middleware/`
5. Utilities are in `backend/utils/`

### Adding New Features

1. **Backend**:
   - Create a new model if needed in `backend/models/`
   - Add controller functions in `backend/controllers/`
   - Define routes in `backend/routes/`
   - Add middleware if required in `backend/middleware/`

2. **Frontend**:
   - Create new components in `frontend/src/components/`
   - Add new pages in `frontend/src/pages/`
   - Update routes in `frontend/src/App.jsx`
   - Add new utility functions in `frontend/src/utils/`

## API Documentation

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job (Employer only)
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (Employer/Admin only)
- `DELETE /api/jobs/:id` - Delete job (Employer/Admin only)
- `POST /api/jobs/:id/apply` - Apply for a job (Job Seeker only)
- `POST /api/jobs/:id/save` - Save a job (Job Seeker only)
- `POST /api/jobs/:id/review` - Add a review (Authenticated users)

### Users
- `GET /api/users/dashboard` - Get job seeker dashboard (Job Seeker only)
- `GET /api/users/owner-dashboard` - Get employer dashboard (Employer only)

### Admin
- `GET /api/admin/stats` - Get admin statistics (Admin only)
- `GET /api/admin/activity` - Get recent activity (Admin only)
- `PUT /api/admin/users/:id` - Activate/deactivate user (Admin only)
- `PUT /api/admin/jobs/:id` - Flag/remove job (Admin only)

## Testing

### Backend Testing
Run tests with:
```bash
cd backend
npm test
```

### Frontend Testing
Run tests with:
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
1. Set environment variables in production
2. Run `npm start` to start the server

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist/` folder to your web server

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the PORT in `.env` file
   - Or kill the process using the port

2. **MongoDB connection error**:
   - Ensure MongoDB is running
   - Check the MONGO_URI in `.env` file

3. **CORS error**:
   - Check if the frontend and backend URLs match the CORS configuration

4. **JWT token error**:
   - Ensure JWT_SECRET is set in `.env` file
   - Check if the token has expired

### Getting Help

If you encounter any issues, please check:
1. The console logs in both frontend and backend
2. The browser's developer tools (Network tab)
3. MongoDB logs
4. The documentation in README.md

For further assistance, please open an issue on the repository.