import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { Client } from 'pg';

async function checkDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('--- READ-ONLY ONLINE DATABASE VERIFICATION ---');

    // 1. Roles
    const rolesRes = await client.query('SELECT name, description, is_system, assignable FROM roles ORDER BY name');
    console.log('ROLES IN DB:', rolesRes.rows);

    // 2. Permissions count
    const permCount = await client.query('SELECT COUNT(*) FROM permissions');
    console.log('PERMISSIONS COUNT:', permCount.rows[0].count);

    // 3. Branches
    const branchesRes = await client.query('SELECT id, name, division FROM branches ORDER BY name');
    console.log('BRANCHES IN DB:', branchesRes.rows);

    // 4. Users (never print password or hash)
    const usersRes = await client.query(`
      SELECT u.id, u.email, u.name, u.role, u.is_active, b.name as branch_name 
      FROM users u 
      LEFT JOIN branches b ON u.branch_id = b.id 
      ORDER BY u.email
    `);
    console.log('USERS IN DB (Metadata Only):', usersRes.rows);

  } catch (err) {
    console.error('ERROR CHECKING DB:', err);
  } finally {
    await client.end();
  }
}

checkDb();
