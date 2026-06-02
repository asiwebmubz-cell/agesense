import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

async function migrate() {
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
    console.log('🔌 Connected to PostgreSQL database for migration...');

    // Path to the migrations directory
    const migrationsDir = path.join(__dirname, '../src/database/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    if (files.length === 0) {
      console.log('ℹ️ No migration SQL files found.');
      return;
    }

    for (const file of files) {
      console.log(`🏃 Running migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute SQL content
      await client.query(sql);
      console.log(`✅ Completed migration: ${file}`);
    }

    console.log('🎉 All migrations completed successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

migrate();
