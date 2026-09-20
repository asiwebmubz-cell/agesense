import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { Client } from 'pg';
import * as argon2 from 'argon2';

async function checkAccountStatus() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('--- CHECKING ACCOUNT PASSWORDS & LOCK STATUS ---');

  const emails = ['admin@agesense.org', 'marketing@agesense.org', 'rajshahi@agesense.org'];

  for (const email of emails) {
    const res = await client.query('SELECT id, email, password, failed_login_attempts, locked_until FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      console.log(`User ${email}: NOT FOUND!`);
      continue;
    }

    const user = res.rows[0];
    const passwordMatch = await argon2.verify(user.password, 'AgeSense@123');

    console.log(`User ${email}:`);
    console.log(`  - Exists: YES`);
    console.log(`  - Failed Attempts: ${user.failed_login_attempts}`);
    console.log(`  - Locked Until: ${user.locked_until}`);
    console.log(`  - Password 'AgeSense@123' Match: ${passwordMatch ? 'YES (MATCHES!)' : 'NO (MISMATCH!)'}`);

    // Unlock and reset failed attempts if locked
    if (user.failed_login_attempts > 0 || user.locked_until !== null) {
      await client.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE email = $1', [email]);
      console.log(`  - RESET failed attempts and unlocked account for ${email}.`);
    }
  }

  await client.end();
}

checkAccountStatus().catch(console.error);
