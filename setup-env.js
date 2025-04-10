const fs = require('fs');
const path = require('path');

// Paths
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
const frontendEnvExamplePath = path.join(__dirname, 'frontend', '.env.example');
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendEnvExamplePath = path.join(__dirname, 'backend', '.env.example');

// Check and copy frontend .env
if (!fs.existsSync(frontendEnvPath) && fs.existsSync(frontendEnvExamplePath)) {
  console.log('Creating frontend .env from .env.example');
  fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
  console.log('Frontend .env created successfully!');
} else if (fs.existsSync(frontendEnvPath)) {
  console.log('Frontend .env already exists');
} else {
  console.error('Frontend .env.example not found');
}

// Check and copy backend .env
if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
  console.log('Creating backend .env from .env.example');
  fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
  console.log('Backend .env created successfully!');
} else if (fs.existsSync(backendEnvPath)) {
  console.log('Backend .env already exists');
} else {
  console.error('Backend .env.example not found');
}

console.log('\nEnvironment setup complete!');
console.log('NOTE: You may need to update the values in the .env files with your specific configuration.');
console.log('Start the application with: npm run dev'); 