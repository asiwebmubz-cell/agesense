const http = require('http');

const data = JSON.stringify({
  email: "admin@agesense.org",
  password: "password"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
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
