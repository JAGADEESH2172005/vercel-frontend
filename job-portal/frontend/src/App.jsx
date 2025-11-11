import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import JobsPage from './pages/JobsPage';
import CompaniesPage from './pages/CompaniesPage';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminPanel from './pages/AdminPanel';
import JobApplicationsPage from './pages/JobApplicationsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import JobApplicationForm from './pages/JobApplicationForm';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginHistoryPage from './pages/LoginHistoryPage';
import Chat from './pages/Chat';
import NotFoundPage from './pages/NotFoundPage';
import FirebaseTestPage from './pages/FirebaseTestPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const { darkMode } = useAuth();

  return (
    <I18nextProvider i18n={i18n}>
      <NotificationProvider>
        <div className={darkMode ? 'dark' : ''}>
          <Router future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              
              {/* Protected Routes */}
              <Route path="/user" element={
                <PrivateRoute allowedRoles={['jobseeker']}>
                  <UserDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/owner" element={
                <PrivateRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </PrivateRoute>
              } />
              
              <Route path="/owner/jobs/:jobId/applications" element={
                <PrivateRoute allowedRoles={['owner']}>
                  <JobApplicationsPage />
                </PrivateRoute>
              } />
              
              <Route path="/applications/:applicationId" element={
                <PrivateRoute allowedRoles={['admin', 'owner', 'jobseeker']}>
                  <ApplicationDetailsPage />
                </PrivateRoute>
              } />
              
              <Route path="/jobs/:jobId/apply" element={
                <PrivateRoute allowedRoles={['jobseeker']}>
                  <JobApplicationForm />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </PrivateRoute>
              } />
              
              <Route path="/admin/login-history/:userId" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <LoginHistoryPage />
                </PrivateRoute>
              } />
              
              <Route path="/chat/:jobId" element={
                <PrivateRoute allowedRoles={['jobseeker', 'owner']}>
                  <Chat />
                </PrivateRoute>
              } />
              
              <Route path="/firebase-test" element={
                <PrivateRoute allowedRoles={['jobseeker', 'owner', 'admin']}>
                  <FirebaseTestPage />
                </PrivateRoute>
              } />
              
              {/* 404 Page - This should be the last route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </Router>
        </div>
      </NotificationProvider>
    </I18nextProvider>
  );
}

export default App;