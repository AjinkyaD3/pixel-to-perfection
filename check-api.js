const http = require('http');

// Define the API endpoints to test
const endpoints = [
  { path: '/api/auth/signup', method: 'POST', data: { name: 'Test User', email: 'test@example.com', password: 'password123', role: 'student', rollNumber: 'IT1234', year: 'TE', division: 'A' } },
  { path: '/api/auth/login', method: 'POST', data: { email: 'test@example.com', password: 'password123' } },
  { path: '/api/students', method: 'GET' },
  { path: '/api/events', method: 'GET' },
  { path: '/api/announcements', method: 'GET' }
];

// Function to make HTTP request
function makeRequest(endpoint, callback) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: endpoint.path,
    method: endpoint.method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback({
        status: res.statusCode,
        headers: res.headers,
        data: data
      });
    });
  });

  req.on('error', (error) => {
    console.error(`Error with request to ${endpoint.path}:`, error.message);
    callback({ error: error.message });
  });

  if (endpoint.data) {
    req.write(JSON.stringify(endpoint.data));
  }
  req.end();
}

// Test each endpoint
console.log('Testing API endpoints...');
console.log('Make sure the server is running on port 3001');

let currentIndex = 0;
function testNextEndpoint() {
  if (currentIndex >= endpoints.length) {
    console.log('All tests completed!');
    return;
  }

  const endpoint = endpoints[currentIndex];
  console.log(`\nTesting ${endpoint.method} ${endpoint.path}...`);
  
  makeRequest(endpoint, (response) => {
    console.log(`Status: ${response.status || 'Error'}`);
    if (response.error) {
      console.log(`Error: ${response.error}`);
    } else {
      try {
        const parsed = JSON.parse(response.data);
        console.log('Response:', JSON.stringify(parsed, null, 2).substring(0, 500) + (JSON.stringify(parsed).length > 500 ? '...(truncated)' : ''));
      } catch (e) {
        console.log('Response:', response.data.substring(0, 200) + (response.data.length > 200 ? '...(truncated)' : ''));
      }
    }
    
    currentIndex++;
    testNextEndpoint();
  });
}

testNextEndpoint(); 