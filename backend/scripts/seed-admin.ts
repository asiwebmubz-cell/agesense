import 'dotenv/config';
import crypto from 'crypto';
import { Client } from 'pg';

/**
 * Initial account seeding.
 *
 * SECURITY:
 * - Credentials come ONLY from environment variables. Never hardcode them.
 * - Passwords are stored as SHA-256 hex (the platform's legacy convention) and
 *   are auto-migrated to Argon2id by the login controller on first login.
 * - Seeding is idempotent: existing accounts are updated, not duplicated.
 * - The Rajshahi account is linked to the Rajshahi branch by name lookup.
 */

interface SeedUser {
  envEmail: string;
  envPassword: string;
  role: string;
  name: string;
  branchName?: string;
}

const seedUsers: SeedUser[] = [
  {
    envEmail: 'ADMIN_EMAIL',
    envPassword: 'ADMIN_PASSWORD',
    role: 'super_admin',
    name: 'Zarif',
  },
  {
    envEmail: 'MARKETING_EMAIL',
    envPassword: 'MARKETING_PASSWORD',
    role: 'marketing',
    name: 'Marketing Department',
  },
  {
    envEmail: 'BRANCH_MANAGER_EMAIL',
    envPassword: 'BRANCH_MANAGER_PASSWORD',
    role: 'branch_manager',
    name: 'Rajshahi Branch',
    branchName: 'Rajshahi Regional Chapter',
  },
];

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }

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

    for (const account of seedUsers) {
      const email = process.env[account.envEmail];
      const password = process.env[account.envPassword];

      if (!email || !password) {
        console.warn(`⚠️  Skipping ${account.role} account: ${account.envEmail} and ${account.envPassword} must be set in the environment.`);
        continue;
      }

      let branchId: string | null = null;
      if (account.branchName) {
        const branchRows = await client.query<{ id: string }>(
          'SELECT id FROM branches WHERE name = $1 OR division = $2 ORDER BY name LIMIT 1',
          [account.branchName, account.branchName.split(' ')[0]]
        );
        if (branchRows.rows.length === 0) {
          console.warn(`⚠️  Skipping ${account.role} account: branch "${account.branchName}" not found. Run migrations first.`);
          continue;
        }
        branchId = branchRows.rows[0].id;
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (checkUser.rows.length > 0) {
        await client.query(
          `UPDATE users
           SET password = $1, role = $2, name = $3, is_active = true,
               branch_id = COALESCE($4, branch_id), updated_at = NOW()
           WHERE email = $5`,
          [hashedPassword, account.role, account.name, branchId, email]
        );
        console.log(`✅ ${account.role} account "${account.name}" (${email}) updated.`);
      } else {
        await client.query(
          'INSERT INTO users (email, password, role, name, branch_id, is_active) VALUES ($1, $2, $3, $4, $5, true)',
          [email, hashedPassword, account.role, account.name, branchId]
        );
        console.log(`✅ ${account.role} account "${account.name}" (${email}) created.`);
      }
    }

    console.log('🎉 Initial account seeding complete.');
  } catch (err) {
    console.error('❌ Seeding operation failed:', err);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

seed();
