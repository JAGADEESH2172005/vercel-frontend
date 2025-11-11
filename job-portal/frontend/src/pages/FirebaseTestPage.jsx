import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { database } from '../utils/firebase';
import { 
  ref, 
  set, 
  onValue, 
  push,
  get
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const FirebaseTestPage = () => {
  const { user } = useAuth();
  const [testData, setTestData] = useState('');
  const [retrievedData, setRetrievedData] = useState('');
  const [status, setStatus] = useState('');

  // Test Firebase Realtime Database connection
  useEffect(() => {
    if (!user) return;
    
    const dbRef = ref(database, `testConnection/${user._id}`);
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log('Firebase Realtime Database connection successful');
      }
    }, (error) => {
      console.error('Firebase Realtime Database connection error:', error);
    });
    
    return () => unsubscribe();
  }, [user]);

  const testWriteData = async () => {
    if (!user) {
      setStatus('User not authenticated');
      return;
    }
    
    try {
      setStatus('Writing data...');
      const dbRef = ref(database, `testData/${user._id}`);
      await set(dbRef, {
        testData,
        timestamp: new Date().toISOString(),
        userId: user._id
      });
      setStatus('Data written successfully!');
    } catch (error) {
      console.error('Error writing data:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const testReadData = async () => {
    if (!user) {
      setStatus('User not authenticated');
      return;
    }
    
    try {
      setStatus('Reading data...');
      const dbRef = ref(database, `testData/${user._id}`);
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        setRetrievedData(JSON.stringify(snapshot.val(), null, 2));
        setStatus('Data retrieved successfully!');
      } else {
        setRetrievedData('No data found');
        setStatus('No data available');
      }
    } catch (error) {
      console.error('Error reading data:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  const testPushData = async () => {
    if (!user) {
      setStatus('User not authenticated');
      return;
    }
    
    try {
      setStatus('Pushing data...');
      const dbRef = ref(database, `testList/${user._id}`);
      const newRef = await push(dbRef, {
        testData,
        timestamp: new Date().toISOString(),
        userId: user._id
      });
      setStatus(`Data pushed successfully with key: ${newRef.key}`);
    } catch (error) {
      console.error('Error pushing data:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Firebase Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please log in to test Firebase functionality
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Firebase Connection Test
          </h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              User Information
            </h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">User ID:</span> {user._id}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Name:</span> {user.name}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Test Data Operations
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="testData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Data
                </label>
                <input
                  type="text"
                  id="testData"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter test data"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={testWriteData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Test Write Data
                </button>
                
                <button
                  onClick={testReadData}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Test Read Data
                </button>
                
                <button
                  onClick={testPushData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Test Push Data
                </button>
              </div>
            </div>
          </div>
          
          {status && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Status
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200">{status}</p>
              </div>
            </div>
          )}
          
          {retrievedData && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Retrieved Data
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {retrievedData}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseTestPage;