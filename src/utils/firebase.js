// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhF-lCa_kXJMC1FYPNiZKrLN3u5PBLI4M",
  authDomain: "local-job-portal-81337.firebaseapp.com",
  projectId: "local-job-portal-81337",
  storageBucket: "local-job-portal-81337.firebasestorage.app",
  messagingSenderId: "840241849777",
  appId: "1:840241849777:web:0252f55e7210a0f064c990",
  databaseURL: "https://local-job-portal-81337-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Add scopes and prompt for account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, database, googleProvider, signInWithPopup, signOut };