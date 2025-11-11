import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { locationData, countries } from '../utils/locationData';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const [owner, setOwner] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'profile', 'applications'
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    salary: '',
    salaryType: 'annum',
    workType: 'onsite',
    jobType: 'fulltime',
    requiredSkills: [],
    location: {
      city: '',
      state: '',
      country: 'India',
    },
    memberLimit: 0 // 0 means no limit
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/users/owner-dashboard');
      setOwner(res.data.owner);
      setJobs(res.data.jobs);
      setRecentApplications(res.data.recentApplications || []);
      setStats(res.data.stats);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/jobs', {
        ...newJob,
        salary: Number(newJob.salary),
      });
      
      // Send notification about new job posting to job seekers and admin
      try {
        await api.post('/notifications/job-posted', {
          jobId: response.data._id,
          jobTitle: newJob.title,
          ownerId: response.data.ownerId
        });
      } catch (notificationError) {
        console.error('Failed to send job posted notifications:', notificationError);
      }
      
      // Reset form and refresh data
      setNewJob({
        title: '',
        description: '',
        salary: '',
        salaryType: 'annum',
        workType: 'onsite',
        jobType: 'fulltime',
        requiredSkills: [],
        location: {
          city: '',
          state: '',
          country: 'India',
        },
        memberLimit: 0
      });
      setShowCreateForm(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleViewApplications = (jobId) => {
    // Navigate to the applications page for this job
    navigate(`/owner/jobs/${jobId}/applications`);
  };

  const handleViewApplicationDetails = (applicationId) => {
    // Navigate to the application details page
    navigate(`/applications/${applicationId}`);
  };

  const handleContactApplicant = (email, phone) => {
    // Check if we have either email or phone
    if (!email && !phone) {
      alert('No contact information available for this applicant.');
      return;
    }
    
    // Create a message showing both email and phone if available
    let contactInfo = 'Contact Information:\n';
    if (email) {
      contactInfo += `\nEmail: ${email}`;
    }
    if (phone) {
      contactInfo += `\nPhone: ${phone}`;
    }
    
    // Show contact information to the user
    alert(contactInfo);
    
    // Ask user how they want to contact
    if (email && phone) {
      const contactMethod = window.confirm('How would you like to contact this applicant?\n\nClick OK to call or Cancel to email.');
      if (contactMethod) {
        window.location.href = `tel:${phone}`;
      } else {
        window.location.href = `mailto:${email}`;
      }
    } else if (phone) {
      const call = window.confirm(`Would you like to call ${phone}?`);
      if (call) {
        window.location.href = `tel:${phone}`;
      }
    } else if (email) {
      const emailUser = window.confirm(`Would you like to email ${email}?`);
      if (emailUser) {
        window.location.href = `mailto:${email}`;
      }
    }
  };

  const handleShortlistApplication = async (applicationId) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: 'interview' });
      // Refresh the dashboard data
      fetchDashboardData();
      alert('Application shortlisted successfully!');
    } catch (err) {
      console.error('Error shortlisting application:', err);
      alert('Failed to shortlist application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section with Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-xl">
                {owner?.businessName?.charAt(0).toUpperCase() || owner?.name?.charAt(0).toUpperCase() || 'E'}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {owner?.businessName || owner?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {owner?.email}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  Employer
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showCreateForm ? 'Cancel' : 'Post New Job'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                My Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Recent Applications ({recentApplications.length})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                Company Profile
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'jobs' && (
              <div>
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Jobs</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Jobs</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Applicants</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplicants}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create Job Form */}
                {showCreateForm && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Post a New Job</h2>
                    <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t('salary_per', { type: newJob.salaryType === 'annum' ? 'year' : 'month' })}
                        </label>
                        <input
                          type="number"
                          required
                          value={newJob.salary}
                          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <select
                          value={newJob.location.country}
                          onChange={(e) => setNewJob({ 
                            ...newJob, 
                            location: { 
                              ...newJob.location, 
                              country: e.target.value,
                              state: '' // Reset state when country changes
                            } 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State/Region
                        </label>
                        <select
                          value={newJob.location.state}
                          onChange={(e) => setNewJob({ 
                            ...newJob, 
                            location: { ...newJob.location, state: e.target.value } 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                          required
                        >
                          <option value="">Select State/Region</option>
                          {locationData[newJob.location.country]?.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={newJob.location.city}
                          onChange={(e) => setNewJob({ 
                            ...newJob, 
                            location: { ...newJob.location, city: e.target.value } 
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Description
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Work Type
                        </label>
                        <select
                          value={newJob.workType}
                          onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="onsite">On-site</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="workFromHome">Work from Home</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Type
                        </label>
                        <select
                          value={newJob.jobType}
                          onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="fulltime">Full Time</option>
                          <option value="parttime">Part Time</option>
                          <option value="intern">Intern</option>
                          <option value="contract">Contract</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Salary Type
                        </label>
                        <select
                          value={newJob.salaryType}
                          onChange={(e) => setNewJob({ ...newJob, salaryType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="annum">Per Annum</option>
                          <option value="monthly">Per Month</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Required Skills
                        </label>
                        <input
                          type="text"
                          placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                          value={newJob.requiredSkills.join(', ')}
                          onChange={(e) => setNewJob({ 
                            ...newJob, 
                            requiredSkills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill !== '')
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                        {newJob.requiredSkills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {newJob.requiredSkills.map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Application Limit (0 for no limit)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={newJob.memberLimit}
                          onChange={(e) => setNewJob({ ...newJob, memberLimit: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Jobs List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    My Jobs
                  </h2>
                  
                  {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {jobs.map((job) => (
                        <div key={job._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                {job.location?.city}, {job.location?.state}, {job.location?.country}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {job.workType === 'onsite' ? 'On-site' : 
                                   job.workType === 'remote' ? 'Remote' : 
                                   job.workType === 'hybrid' ? 'Hybrid' : 
                                   'Work from Home'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {job.jobType === 'fulltime' ? 'Full Time' : 
                                   job.jobType === 'parttime' ? 'Part Time' : 
                                   job.jobType === 'intern' ? 'Intern' : 
                                   'Contract'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Posted on: {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₹{job.salary?.toLocaleString()}{job.salaryType === 'monthly' ? '/month' : '/year'}
                              </p>
                              <div className="mt-2 flex space-x-2">
                                <button
                                  onClick={() => handleViewApplications(job._id)}
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  View Applications
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job._id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : job.status === 'inactive' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        You haven't posted any jobs yet.
                      </p>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Post Your First Job
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Recent Applications
                </h2>
                
                {recentApplications.length > 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Applicant
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Job Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Applied On
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {recentApplications.map((application) => (
                            <tr key={application._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                      {application.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {application.userId?.name || 'Unknown Applicant'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {application.userId?.email || 'No email provided'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {application.jobId?.title || 'Unknown Job'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(application.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                  application.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => handleViewApplicationDetails(application._id)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => handleContactApplicant(application.userId?.email, application.userId?.phone)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  >
                                    Contact
                                  </button>
                                  <button
                                    onClick={() => handleShortlistApplication(application._id)}
                                    className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                  >
                                    Shortlist
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No applications yet</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      You haven't received any job applications yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Company Profile
                </h2>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-xl">
                      {owner?.businessName?.charAt(0).toUpperCase() || owner?.name?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {owner?.businessName || owner?.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {owner?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {owner?.businessName || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {owner?.email}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Employer
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Member Since
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {owner?.createdAt ? new Date(owner.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;