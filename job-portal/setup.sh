#!/bin/bash

echo "Setting up JobLocal project..."

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setup complete!"
echo "To start the application:"
echo "1. Start MongoDB server"
echo "2. In backend directory, run: npm run dev"
echo "3. In frontend directory, run: npm run dev"