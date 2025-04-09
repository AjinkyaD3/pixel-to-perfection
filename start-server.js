// This script starts the server with a custom port
const { spawn } = require('child_process');
const path = require('path');

const PORT = 3001;

// Set environment variables
process.env.PORT = PORT;

console.log(`Starting server on port ${PORT}...`);

// Path to server.js
const serverPath = path.join(__dirname, 'backend', 'server.js');

// Spawn the server process
const server = spawn('node', [serverPath], {
  env: { ...process.env, PORT: PORT.toString() },
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

console.log(`Server should be running at http://localhost:${PORT}`);
console.log('Press Ctrl+C to stop the server'); 