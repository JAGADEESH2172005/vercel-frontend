import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const JobCard = ({ job, user }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Check if job is already saved
    if (user && user.savedJobs) {
      const saved = user.savedJobs.some(savedJob => savedJob._id === job._id);
      setIsSaved(saved);
    }
  }, [user, job]);

  const handleApply = () => {
    navigate(`/jobs/${job._id}/apply`);
  };

  const handleSave = async () => {
    try {
      const response = await api.post(`/jobs/${job._id}/save`);
      if (response.data) {
        setIsSaved(response.data.saved);
        // Show success message or update UI
        console.log(response.data.message);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      // Show error message to user
      alert('Failed to save job. Please try again.');
    }
  };

  const handleReview = () => {
    // Navigate to job details page where review can be added
    navigate(`/jobs/${job._id}`);
  };

  // Format location display
  const getLocationDisplay = () => {
    if (job.location) {
      if (job.location.city && job.location.state && job.location.country) {
        return `${job.location.city}, ${job.location.state}, ${job.location.country}`;
      } else if (job.location.city && job.location.state) {
        return `${job.location.city}, ${job.location.state}`;
      } else if (job.location.city) {
        return job.location.city;
      }
    }
    return 'Location not specified';
  };

  // Format work type display
  const getWorkTypeDisplay = () => {
    switch (job.workType) {
      case 'onsite': return 'On-site';
      case 'remote': return 'Remote';
      case 'hybrid': return 'Hybrid';
      case 'workFromHome': return 'Work from Home';
      default: return 'On-site';
    }
  };

  // Format job type display
  const getJobTypeDisplay = () => {
    switch (job.jobType) {
      case 'fulltime': return 'Full Time';
      case 'parttime': return 'Part Time';
      case 'intern': return 'Intern';
      case 'contract': return 'Contract';
      default: return 'Full Time';
    }
  };

  // Format salary display
  const getSalaryDisplay = () => {
    if (!job.salary) return 'Not specified';
    
    const formattedSalary = job.salary.toLocaleString();
    const salaryType = job.salaryType === 'monthly' ? 'month' : 'year';
    return `₹${formattedSalary}/${salaryType}`;
  };

  // Format member limit display
  const getMemberLimitDisplay = () => {
    if (job.memberLimit > 0) {
      return `Limit: ${job.currentApplicants}/${job.memberLimit} applicants`;
    }
    return 'No application limit';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{job.ownerId?.name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{getLocationDisplay()}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getWorkTypeDisplay()}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {getJobTypeDisplay()}
            </span>
            {job.memberLimit > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {getMemberLimitDisplay()}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{getSalaryDisplay()}</p>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">
        {job.description}
      </p>
      
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Required Skills:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {job.requiredSkills.slice(0, 5).map((skill, index) => (
              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{job.requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-2">
          <button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Apply Now
          </button>
          <button
            onClick={handleSave}
            className={`border px-4 py-2 rounded-md text-sm font-medium ${
              isSaved 
                ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isSaved ? 'Saved' : 'Save Job'}
          </button>
          <button
            onClick={handleReview}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            Review
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span className="text-gray-600 dark:text-gray-300 text-sm">4.2</span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;