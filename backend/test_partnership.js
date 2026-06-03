const http = require('http');

const data = JSON.stringify({
  organization_name: "Test Org API Verification",
  contact_person: "John Doe",
  email: "john@example.com",
  partnership_type: "Corporate Partnership",
  message: "Testing the partnership API endpoint end-to-end"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/partnerships',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log('Status:', res.statusCode);
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Response:', responseData);
    process.exit(0);
  });
});

req.on('error', e => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
