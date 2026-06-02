# Database Migration Documentation

This document logs the database layer migration of the AgeSense backend from in-memory mock stubs to a production-grade PostgreSQL database on Supabase.

---

## 1. Overview of the Migration

The business layer services previously retrieved and manipulated mock in-memory javascript arrays (`stub` variables). The backend has been migrated to use raw SQL query bindings via the native `pg` connection pooling library.

---

## 2. PostgreSQL Connection Pool Settings

The connection configuration resides in [`backend/src/database/index.ts`](file:///d:/New%20folder/AgeSense/backend/src/database/index.ts):

```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for secure database providers like Supabase
  },
  max: 20,                       // Limit active connection pool size to 20
  idleTimeoutMillis: 30000,      // Close idle connections after 30 seconds
});
```

---

## 3. Database Schema Layout

Initial schemas are defined in [`backend/src/database/migrations/01_init.sql`](file:///d:/New%20folder/AgeSense/backend/src/database/migrations/01_init.sql). All tables utilize **UUID primary keys** and automatic **created_at** / **updated_at** timestamps.

### `users` table
For administrator logins.
- `id`: UUID (Primary Key, default `gen_random_uuid()`)
- `email`: VARCHAR(255) (Unique, Not Null)
- `password`: VARCHAR(255) (Hashed securely via SHA-256, Not Null)
- `created_at`: TIMESTAMP WITH TIME ZONE (Default `NOW()`)
- `updated_at`: TIMESTAMP WITH TIME ZONE (Default `NOW()`)

### `programs` table
For programs, work initiatives, and impact stories.
- Includes detail columns such as `goals`, `beneficiaries`, `expense_categories`, `duration`, etc., and gallery links.
- Retains only file link strings (`image_url TEXT`) prepared for external storage integration (e.g. Cloudinary). No binaries are saved inside PostgreSQL.

### `volunteers` table
For volunteer registration applications.
- Includes a `form_data_json` `JSONB` column to flexibly support multi-step form questions.

### `donors` table
For keeping audit records of donations.
- Uses `amount` `DECIMAL(12, 2)` for precision financial tracking.

---

## 4. Admin Seeding Script

To register the first administrator login safely without execution on every system reboot, we created a dedicated seed script at [`backend/scripts/seed-admin.ts`](file:///d:/New%20folder/AgeSense/backend/scripts/seed-admin.ts).

### Running Seed Script
```bash
# Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env, then run:
npm run seed-admin
```
The password is saved as a secure SHA-256 hash inside the database. The login controller compares the SHA-256 hash of incoming password requests against the stored database value.

---

## 5. Health Monitoring

A dedicated health check endpoint has been registered:
- **Endpoint**: `GET /api/db-health`
- **Output**:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2026-06-03T00:00:00.000Z"
  }
  ```
This endpoint connects and connects-release to verify connection health.
