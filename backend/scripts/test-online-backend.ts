import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });

const CANDIDATE_BACKENDS = [
  'https://agesense-backend.onrender.com',
  'https://agesense-api.onrender.com',
  'https://agesense.org/api',
  'https://www.agesense.org/api'
];

const TEST_ACCOUNTS = [
  { email: 'admin@agesense.org', role: 'super_admin' },
  { email: 'marketing@agesense.org', role: 'marketing' },
  { email: 'rajshahi@agesense.org', role: 'branch_manager' }
];

async function testOnlineBackend() {
  console.log('==================================================');
  console.log('       TESTING ONLINE DEPLOYED BACKENDS          ');
  console.log('==================================================\n');

  for (const baseUrl of CANDIDATE_BACKENDS) {
    console.log(`\n🔍 Checking Backend URL: ${baseUrl}`);
    
    // 1. Health check
    try {
      const healthUrl = `${baseUrl.replace(/\/api$/, '')}/api/health`;
      console.log(`   Pinging ${healthUrl}...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const healthRes = await fetch(healthUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      console.log(`   Health Check Status: ${healthRes.status}`);
      let healthBody = '';
      try { healthBody = JSON.stringify(await healthRes.json()); } catch (e) { healthBody = await healthRes.text(); }
      console.log(`   Health Response: ${healthBody.substring(0, 150)}`);

      if (healthRes.status === 200 || healthRes.status === 404) {
        // Test login on this backend
        for (const acc of TEST_ACCOUNTS) {
          const loginUrl = `${baseUrl.endsWith('/api') ? baseUrl : baseUrl + '/api'}/auth/login`;
          console.log(`   Testing POST ${loginUrl} for ${acc.email}...`);
          try {
            const loginRes = await fetch(loginUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: acc.email, password: 'AgeSense@123' }),
            });

            let loginBody: any = {};
            try { loginBody = await loginRes.json(); } catch (e) { loginBody = { raw: await loginRes.text() }; }

            console.log(`   👉 ${acc.email} -> Status ${loginRes.status}, Success: ${loginBody.success}, Message: "${loginBody.message || loginBody.error || ''}"`);
          } catch (err: any) {
            console.log(`   ❌ Login fetch failed for ${acc.email}: ${err.message}`);
          }
        }
      }
    } catch (err: any) {
      console.log(`   ❌ Health ping failed: ${err.message}`);
    }
  }
}

testOnlineBackend().catch(console.error);
