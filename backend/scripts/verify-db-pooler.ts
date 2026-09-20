import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { Client } from 'pg';

async function testConnections() {
  console.log('--- VERIFYING SUPABASE DATABASE TARGETS & POOLER ---');

  const rawUrl = process.env.DATABASE_URL || '';
  const match = rawUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  if (!match) {
    console.error('Could not parse DATABASE_URL from .env');
    return;
  }

  const [, user, pass, host, port, dbname] = match;
  console.log(`Extracted Project Ref Target: htwrjivyplipyyrlgvdp`);

  // 1. Test Direct Connection (from .env)
  console.log('\n1. Testing Direct Host Connection (db.htwrjivyplipyyrlgvdp.supabase.co)...');
  try {
    const client1 = new Client({ connectionString: rawUrl, ssl: { rejectUnauthorized: false } });
    await client1.connect();
    const userRes1 = await client1.query('SELECT email, role FROM users ORDER BY email');
    console.log('   ✅ Direct DB Connected successfully!');
    console.log('   Users in Direct DB:', userRes1.rows);
    await client1.end();
  } catch (err: any) {
    console.log('   ❌ Direct DB failed:', err.message);
  }

  // 2. Test Pooler without project ref (user = postgres)
  const poolerUrlPlain = `postgresql://${user}:${pass}@aws-1-ap-northeast-1.pooler.supabase.com:${port}/${dbname}`;
  console.log('\n2. Testing Pooler Host WITHOUT Project Ref in User (postgres@aws-1-ap-northeast-1.pooler.supabase.com)...');
  try {
    const client2 = new Client({ connectionString: poolerUrlPlain, ssl: { rejectUnauthorized: false } });
    await client2.connect();
    const userRes2 = await client2.query('SELECT email, role FROM users ORDER BY email');
    console.log('   ✅ Pooler Plain Connected successfully!');
    console.log('   Users in Pooler Plain DB:', userRes2.rows);
    await client2.end();
  } catch (err: any) {
    console.log('   ❌ Pooler Plain failed:', err.message);
  }

  // 3. Test Pooler with project ref (user = postgres.htwrjivyplipyyrlgvdp)
  const poolerUrlScoped = `postgresql://${user}.htwrjivyplipyyrlgvdp:${pass}@aws-1-ap-northeast-1.pooler.supabase.com:${port}/${dbname}`;
  console.log('\n3. Testing Pooler Host WITH Project Ref in User (postgres.htwrjivyplipyyrlgvdp@aws-1-ap-northeast-1.pooler.supabase.com)...');
  try {
    const client3 = new Client({ connectionString: poolerUrlScoped, ssl: { rejectUnauthorized: false } });
    await client3.connect();
    const userRes3 = await client3.query('SELECT email, role FROM users ORDER BY email');
    console.log('   ✅ Pooler Scoped Connected successfully!');
    console.log('   Users in Pooler Scoped DB:', userRes3.rows);
    await client3.end();
  } catch (err: any) {
    console.log('   ❌ Pooler Scoped failed:', err.message);
  }
}

testConnections().catch(console.error);
