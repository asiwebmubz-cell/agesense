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
      console.log(`ℹ️  User "${email}" already exists. Updating role to super_admin and updating password...`);
      await client.query(
        'UPDATE users SET password = $1, role = $2, name = COALESCE(name, $3), is_active = true, updated_at = NOW() WHERE email = $4',
        [hashedPassword, 'super_admin', 'Zarif (Super Admin)', email]
      );
      console.log('✅ Super Admin password and role updated successfully.');
    } else {
      console.log(`🌱 Creating super_admin user "${email}"...`);
      await client.query(
        'INSERT INTO users (email, password, role, name, is_active) VALUES ($1, $2, $3, $4, true)',
        [email, hashedPassword, 'super_admin', 'Zarif (Super Admin)']
      );
      console.log('✅ Super Admin user created successfully.');
    }
  } catch (err) {
    console.error('❌ Seeding operation failed:', err);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

seed();
