import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { auth, signInWithPopup, signOut, googleProvider } from '../utils/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }

    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    // Check for language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Handle Google auth success
    const handleGoogleAuthSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const user = urlParams.get('user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(decodeURIComponent(user));
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userData);
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Google auth error:', err);
        }
      }
    };

    // Check for Google auth success on mount
    handleGoogleAuthSuccess();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        console.log('Firebase user signed in:', firebaseUser);
      } else {
        // User is signed out
        console.log('Firebase user signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (err) {
      // Check if response exists before accessing data
      if (err.response && err.response.data) {
        throw err.response.data;
      } else {
        // Handle network errors or other issues
        throw { message: 'Network error or server is unreachable' };
      }
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/signup', userData);
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (err) {
      // Check if response exists before accessing data
      if (err.response && err.response.data) {
        throw err.response.data;
      } else {
        // Handle network errors or other issues
        throw { message: 'Network error or server is unreachable' };
      }
    }
  };

  const firebaseGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Send Firebase user data to backend to create/link account
      const res = await api.post('/auth/firebase-login', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Firebase Google login error:', error);
      throw error;
    }
  };

  const firebaseLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Firebase logout error:', error);
      // Still clear local state even if Firebase logout fails
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    user,
    loading,
    darkMode,
    language,
    login,
    register,
    logout,
    firebaseGoogleLogin,
    firebaseLogout,
    toggleDarkMode,
    changeLanguage,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};