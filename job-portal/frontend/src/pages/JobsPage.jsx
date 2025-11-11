import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(10);
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterAndSortJobs();
  }, [jobs, searchTerm, location, radius, minSalary, sortBy]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
      setFilteredJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Simplified distance calculation based on city matching
  // In a real implementation with lat/lng data, this would calculate actual distances
  const isWithinRadius = (jobLocation, userLocation, radiusKm) => {
    // For now, we'll do a simple city match
    // A more accurate implementation would use lat/lng coordinates
    if (!userLocation || radiusKm === 0) return true;
    return jobLocation.city.toLowerCase().includes(userLocation.toLowerCase()) ||
           jobLocation.state.toLowerCase().includes(userLocation.toLowerCase());
  };

  const filterAndSortJobs = () => {
    let result = [...jobs];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location and radius
    if (location) {
      result = result.filter(job => 
        isWithinRadius(job.location, location, radius)
      );
    }

    // Filter by minimum salary
    result = result.filter(job => job.salary >= minSalary);

    // Sort jobs
    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'salary':
        result.sort((a, b) => b.salary - a.salary);
        break;
      case 'distance':
        // In a real app with lat/lng data, we would sort by actual distance
        // For now, we'll keep the current order
        break;
      default:
        break;
    }

    setFilteredJobs(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering is handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Find Your Dream Job
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Browse through thousands of job opportunities
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords
              </label>
              <input
                type="text"
                id="search"
                placeholder="Job title, keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="City, state"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Radius: {radius} km
              </label>
              <input
                type="range"
                id="radius"
                min="0"
                max="100"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Most Recent</option>
                <option value="salary">Highest Salary</option>
                <option value="distance">Closest Distance</option>
              </select>
            </div>
          </form>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Salary: ₹{minSalary.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="5000000"
              step="10000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} user={user} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;