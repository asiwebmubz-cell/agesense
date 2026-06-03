const http = require('http');

const data = JSON.stringify({
  full_name: "Volunteer Test API",
  email: "volunteer@example.com",
  phone: "+1 555-1234",
  form_data: {
    skills: ["Digital Literacy", "RND"],
    availability: ["Weekends"],
    notes: "Eager to help out!"
  }
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/volunteers',
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
