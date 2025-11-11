import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const CompaniesPage = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Fetch jobs and extract unique owners/companies
      const res = await api.get('/jobs');
      // Extract unique owners from jobs
      const uniqueOwners = {};
      res.data.forEach(job => {
        if (job.ownerId) {
          uniqueOwners[job.ownerId._id] = {
            _id: job.ownerId._id,
            name: job.ownerId.name,
            businessName: job.ownerId.businessName,
            email: job.ownerId.email,
            phone: job.ownerId.phone
          };
        }
      });
      setCompanies(Object.values(uniqueOwners));
      setError('');
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('business')}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            {t('browse_thousands_jobs')}
          </p>
        </div>

        <div className="mt-10">
          {error ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{t('error')}</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {error}
                </p>
                <div className="mt-6">
                  <button
                    onClick={fetchCompanies}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    {t('try_again')}
                  </button>
                </div>
              </div>
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <div key={company._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                        {company.businessName?.charAt(0).toUpperCase() || company.name?.charAt(0).toUpperCase() || 'B'}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {company.businessName || company.name}
                        </h3>
                        {company.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {company.email}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {company.phone && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{t('phone')}:</span> {company.phone}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Link
                        to={`/jobs?owner=${company._id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none"
                      >
                        {t('view_jobs')}
                        <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">{t('no_businesses_found')}</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {t('no_businesses_description')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;