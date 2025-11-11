import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  
  // Use environment variable for socket URL, fallback to localhost for development
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';

  // Initialize socket connection
  useEffect(() => {
    let newSocket;
    
    if (user) {
      // Create socket connection with proper configuration
      newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });
      
      setSocket(newSocket);

      // Listen for connection events
      newSocket.on('connect', () => {
        console.log('Socket connected successfully:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // The server disconnected, do not attempt to reconnect
          console.log('Server disconnected socket, reconnecting...');
          newSocket.connect();
        }
      });

      // Listen for new notifications
      newSocket.on('new_notification', (notification) => {
        console.log('Received new notification (broadcast):', notification);
        addNotification(notification);
      });

      // Listen for user-specific notifications
      newSocket.on(`notification_${user._id}`, (notification) => {
        console.log(`Received user-specific notification for ${user._id}:`, notification);
        addNotification(notification);
      });

      // Listen for role-based notifications
      newSocket.on(`notification_${user.role}`, (notification) => {
        console.log(`Received role-based notification for ${user.role}:`, notification);
        addNotification(notification);
      });

      console.log(`Setting up socket listeners for user ${user._id} with role ${user.role}`);
    }

    // Cleanup function
    return () => {
      if (newSocket) {
        console.log(`Cleaning up socket listeners for user ${user?._id}`);
        newSocket.removeAllListeners();
        newSocket.close();
      }
    };
  }, [user, SOCKET_URL]);

  // Fetch notifications when the app loads or user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      const fetchedNotifications = response.data;
      
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data if API fails
      const mockNotifications = [
        {
          id: '1',
          type: 'new_job',
          title: 'New Job Posted',
          message: 'A new job "Senior React Developer" has been posted',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          read: false,
          jobId: 'job123'
        },
        {
          id: '2',
          type: 'application_update',
          title: 'Application Update',
          message: 'Your application for "Frontend Developer" has been reviewed',
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          read: false,
          applicationId: 'app456'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
      setLoading(false);
    }
  };

  const addNotification = (notification) => {
    // Check if notification already exists
    const exists = notifications.some(n => n.id === notification.id);
    if (!exists) {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update locally even if API fails
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(unreadCount - 1);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Update locally even if API fails
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    }
  };

  const removeNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(n => n.id !== id));
    if (!notification.read) {
      setUnreadCount(unreadCount - 1);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    fetchNotifications,
    socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};