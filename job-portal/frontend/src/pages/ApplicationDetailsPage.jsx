import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching application details for ID:', applicationId);
      
      // Fetch application details
      const applicationRes = await api.get(`/applications/${applicationId}`);
      console.log('Application data received:', applicationRes.data);
      setApplication(applicationRes.data);
      
      // Set job data directly from the populated application data
      // If jobId is already populated, use it directly; otherwise fetch it
      if (applicationRes.data.jobId && typeof applicationRes.data.jobId === 'object') {
        setJob(applicationRes.data.jobId);
      } else {
        // Fetch job details
        const jobRes = await api.get(`/jobs/${applicationRes.data.jobId}`);
        console.log('Job data received:', jobRes.data);
        setJob(jobRes.data);
      }
      
      // Set applicant data directly from the populated application data
      // If userId is already populated, use it directly; otherwise fetch it
      if (applicationRes.data.userId && typeof applicationRes.data.userId === 'object') {
        setApplicant(applicationRes.data.userId);
      } else {
        // Fetch applicant details
        const applicantRes = await api.get(`/users/${applicationRes.data.userId}`);
        console.log('Applicant data received:', applicantRes.data);
        setApplicant(applicantRes.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching application details:', err);
      console.error('Error response:', err.response);
      setError(`Failed to fetch application details: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const handleViewResume = (resumePath) => {
    // Create the full URL to the resume file
    const resumeUrl = `http://localhost:5002/${resumePath}`;
    // Open the resume file in a new tab
    window.open(resumeUrl, '_blank');
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Refresh the application details
      fetchApplicationDetails();
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status');
    }
  };

  const handleDeleteApplication = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/applications/${applicationId}`);
        // Navigate back to the previous page
        navigate(-1);
      } catch (err) {
        console.error('Error deleting application:', err);
        // Check if it's a 404 error (application not found)
        if (err.response && err.response.status === 404) {
          alert('Application has already been deleted or does not exist.');
          // Navigate back to the previous page
          navigate(-1);
        } else {
          alert('Failed to delete application. Please try again.');
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Application Details
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                For position: {job?.title}
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={application?.status || 'pending'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleDeleteApplication}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Details</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
                  <p className="text-gray-900 dark:text-white">{job?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="text-gray-900 dark:text-white">{job?.ownerId?.name}</p>
                </div>
                {job?.ownerId?.phone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Employer Contact</p>
                    <p className="text-gray-900 dark:text-white">
                      <a href={`tel:${job.ownerId.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {job.ownerId.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">
                    {job?.location?.city}, {job?.location?.state}, {job?.location?.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                  <p className="text-gray-900 dark:text-white">
                    ₹{job?.salary?.toLocaleString()}{job?.salaryType === 'monthly' ? '/month' : '/year'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Work Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {job?.workType === 'onsite' ? 'On-site' : 
                     job?.workType === 'remote' ? 'Remote' : 
                     job?.workType === 'hybrid' ? 'Hybrid' : 
                     'Work from Home'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Job Type</p>
                  <p className="text-gray-900 dark:text-white">
                    {job?.jobType === 'fulltime' ? 'Full Time' : 
                     job?.jobType === 'parttime' ? 'Part Time' : 
                     job?.jobType === 'intern' ? 'Intern' : 
                     'Contract'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Applicant Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Applicant Details</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-gray-900 dark:text-white">{applicant?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-900 dark:text-white">{applicant?.email}</p>
                </div>
                {applicant?.phone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white">
                      <a href={`tel:${applicant.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {applicant.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-gray-900 dark:text-white capitalize">{applicant?.role}</p>
                </div>
                {applicant?.address && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white">
                      {[applicant.address.street, applicant.address.city, applicant.address.state, applicant.address.zipCode, applicant.address.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}
                {applicant?.bio && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
                    <p className="text-gray-900 dark:text-white">{applicant?.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Application Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Cover Letter</h3>
              {application?.coverLetter ? (
                <div className="prose max-w-none text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {application.coverLetter}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No cover letter provided</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Resume</h3>
              {application?.resumeFile ? (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <button
                    onClick={() => handleViewResume(application.resumeFile)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Resume
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No resume uploaded</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on: {application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {application?.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application?.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  application?.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                  application?.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application?.status?.charAt(0).toUpperCase() + application?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;