import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-9xl font-extrabold text-gray-900 dark:text-white">404</h1>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go back home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
      
      <footer className="py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            &copy; 2023 JobLocal. All rights reserved by M. J. L
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;