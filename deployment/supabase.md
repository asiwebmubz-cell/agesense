# Supabase Database Guide - AgeSense PostgreSQL

This guide outlines connection configuration, migrations, backups, and health checks for the Supabase PostgreSQL database.

## Connection String Setup

* **Format**: `postgresql://postgres:[YOUR-PASSWORD]@db.htwrjivyplipyyrlgvdp.supabase.co:5432/postgres`
* **SSL Settings**: SSL connection is required. Ensure connection settings include `ssl: { rejectUnauthorized: false }` to prevent certificate handshake rejections.

## Migration Process

The database utilizes a local migration runner in the backend.

### To Apply Migrations:
```bash
# Inside the backend folder:
npm run migrate
```
This script reads `backend/src/database/migrations/01_init.sql` and builds all required tables (`users`, `programs`, `volunteers`, `donors`).

### Seeding:
```bash
# Seed the initial administrator login account:
npm run seed-admin
```

## Backup Process

* Supabase performs daily automatic backups of your database.
* To execute a manual backup, use `pg_dump`:
  ```bash
  pg_dump -H db.htwrjivyplipyyrlgvdp.supabase.co -U postgres -d postgres -F c -b -v -f agesense_backup.sql
  ```

## Connection Pool Configuration

The connection pool settings are configured in `backend/src/database/index.ts`:
* **Max Connections**: `20`
* **Idle Timeout**: `30,000ms` (30 seconds)

## Health Monitoring

Database connectivity is tracked programmatically.
* **Endpoint**: `GET /api/db-health`
* **Checks**: Executes `SELECT 1` or connects/releases pool clients to verify availability.
