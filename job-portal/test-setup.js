const { spawn } = require('child_process');
const path = require('path');

console.log('Testing JobLocal setup...');

// Test backend
console.log('Testing backend setup...');
const backend = spawn('node', ['--version'], {
  cwd: path.join(__dirname, 'backend')
});

backend.on('close', (code) => {
  if (code === 0) {
    console.log('✓ Backend Node.js is available');
  } else {
    console.log('✗ Backend Node.js is not available');
  }
  
  // Test frontend
  console.log('Testing frontend setup...');
  const frontend = spawn('node', ['--version'], {
    cwd: path.join(__dirname, 'frontend')
  });
  
  frontend.on('close', (code) => {
    if (code === 0) {
      console.log('✓ Frontend Node.js is available');
    } else {
      console.log('✗ Frontend Node.js is not available');
    }
    
    console.log('Setup test completed.');
  });
});