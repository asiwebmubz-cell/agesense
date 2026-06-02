import 'dotenv/config';
import crypto from 'crypto';
import { Client } from 'pg';

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required for seeding.');
    process.exit(1);
  }
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('🔌 Connected to PostgreSQL database...');

    // Ensure the users table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if user already exists
    const checkUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      console.log(`ℹ️  User "${email}" already exists. Updating password...`);
      await client.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2',
        [hashedPassword, email]
      );
      console.log('✅ Admin password updated successfully.');
    } else {
      console.log(`🌱 Creating admin user "${email}"...`);
      await client.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, hashedPassword]
      );
      console.log('✅ Admin user created successfully.');
    }
  } catch (err) {
    console.error('❌ Seeding operation failed:', err);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

seed();
