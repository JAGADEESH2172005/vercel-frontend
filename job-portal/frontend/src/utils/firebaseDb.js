import { database } from './firebase.js';
import { 
  ref, 
  set, 
  push, 
  onValue, 
  off, 
  update, 
  remove,
  get,
  child
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Function to write data to Realtime Database
export const writeData = async (path, data) => {
  try {
    const dbRef = ref(database, path);
    await set(dbRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error writing data to Realtime Database:", error);
    return { success: false, error: error.message };
  }
};

// Function to push data to Realtime Database (creates new unique key)
export const pushData = async (path, data) => {
  try {
    const dbRef = ref(database, path);
    const newRef = push(dbRef, data);
    return { success: true, key: newRef.key };
  } catch (error) {
    console.error("Error pushing data to Realtime Database:", error);
    return { success: false, error: error.message };
  }
};

// Function to update data in Realtime Database
export const updateData = async (path, data) => {
  try {
    const dbRef = ref(database, path);
    await update(dbRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating data in Realtime Database:", error);
    return { success: false, error: error.message };
  }
};

// Function to remove data from Realtime Database
export const removeData = async (path) => {
  try {
    const dbRef = ref(database, path);
    await remove(dbRef);
    return { success: true };
  } catch (error) {
    console.error("Error removing data from Realtime Database:", error);
    return { success: false, error: error.message };
  }
};

// Function to read data once from Realtime Database
export const readDataOnce = async (path) => {
  try {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: false, error: "No data available" };
    }
  } catch (error) {
    console.error("Error reading data from Realtime Database:", error);
    return { success: false, error: error.message };
  }
};

// Function to listen for real-time updates
export const listenForData = (path, callback) => {
  const dbRef = ref(database, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ success: true, data: snapshot.val() });
    } else {
      callback({ success: false, error: "No data available" });
    }
  }, (error) => {
    console.error("Error listening for data:", error);
    callback({ success: false, error: error.message });
  });
  
  // Return unsubscribe function
  return () => off(dbRef);
};

// Function to get a child reference
export const getChildRef = (parentPath, childPath) => {
  const parentRef = ref(database, parentPath);
  return child(parentRef, childPath);
};

export { database };