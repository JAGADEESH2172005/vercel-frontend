import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

const Chat = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Use environment variable for socket URL, fallback to localhost for development
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';

  useEffect(() => {
    // Initialize socket connection
    socket = io(SOCKET_URL);
    
    // Join room
    socket.emit('join_room', { jobId, userId: user._id, userName: user.name });
    
    // Listen for messages
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    
    // Listen for online users
    socket.on('online_users', (users) => {
      setOnlineUsers(users);
    });
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [jobId, user._id, user.name, SOCKET_URL]);

  useEffect(() => {
    // Scroll to bottom of messages
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    const messageData = {
      jobId,
      userId: user._id,
      userName: user.name,
      message,
      timestamp: new Date().toISOString(),
    };
    
    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-600 dark:bg-blue-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white">Job Chat</h1>
              <div className="flex items-center">
                <span className="text-sm text-blue-200 mr-2">{onlineUsers.length} online</span>
                <div className="flex -space-x-2">
                  {onlineUsers.slice(0, 3).map((user, index) => (
                    <div key={index} className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                  ))}
                  {onlineUsers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-xs text-white">
                      +{onlineUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-2">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.userId === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        msg.userId === user._id
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-bl-none'
                      }`}
                    >
                      {msg.userId !== user._id && (
                        <p className="text-xs font-semibold">{msg.userName}</p>
                      )}
                      <p>{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;