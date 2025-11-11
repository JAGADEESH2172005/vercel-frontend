# JobLocal - Naukri Clone

A full-stack job portal application similar to Naukri.com with React frontend and Node.js backend.

## Features

### Frontend (React + Vite + Tailwind CSS)
- Role-based authentication (Job Seeker, Employer, Admin)
- Dark mode support
- Multi-language support (English + Hindi)
- Real-time chat using Socket.io
- Responsive design

### Backend (Node.js + Express + MongoDB)
- JWT-based authentication
- Role-based access control
- Job management
- Application system
- Review system

## Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

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

## Role-based Access

- **Job Seeker**: Can browse jobs, apply for jobs, save jobs, and chat with employers
- **Employer**: Can post jobs, manage their jobs, and chat with job seekers
- **Admin**: Can manage users, jobs, and view platform statistics

## Technologies Used

### Frontend
- React 18
- React Router v6
- Vite
- Tailwind CSS
- Socket.io-client
- Axios
- react-i18next

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Socket.io for real-time chat
- Multer for file uploads

## License

This project is licensed under the MIT License.