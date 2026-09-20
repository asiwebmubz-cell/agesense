# Render Deployment Guide - AgeSense Backend

This guide outlines the production deployment settings for the Express.js & TypeScript backend on Render.

## Build and Start Commands

* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm start`
* **Environment**: `Node`

## Required Environment Variables

Configure these variables in the Render Dashboard under **Environment**:

| Variable | Description | Example / Note |
|---|---|---|
| `NODE_ENV` | Mode of the application | `production` |
| `PORT` | Port for the express app | `5000` |
| `FRONTEND_URL` | Primary frontend origin for CORS | `https://agesense.vercel.app` |
| `ALLOWED_ORIGINS` | Comma-separated additional CORS origins | `https://agesense.org,https://www.agesense.org,https://agesense.vercel.app` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase REST API URL | `https://<project-ref>.supabase.co/rest/v1/` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret key | `sb_secret_...` |
| `JWT_SECRET` | Secret key for JWT | Secure random string (min 16 chars) |
| `ADMIN_EMAIL` | Administrator Email | `admin@agesense.org` |
| `ADMIN_PASSWORD` | Administrator Password | Secure admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | `dbacpre0g` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `266564921745161` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | _(your Cloudinary secret)_ |
| `RENDER_EXTERNAL_URL` | External URL of this Render service | `https://agesense-backend.onrender.com` |

> **Important**: `ALLOWED_ORIGINS` must include every custom domain that serves the frontend. If the frontend is accessible via both `agesense.vercel.app` and `agesense.org`, both must be listed. Missing origins will cause CORS errors (HTTP 500) for users on those domains.

## Health Check URL

* **Path**: `/api/health`
* **Dedicated DB Health Path**: `/api/db-health`
* **Dedicated Cloudinary Health Path**: `/api/cloudinary-health`

## Database Setup Workflow

1. Prior to deployment, create the database instance on Supabase.
2. Provide the `DATABASE_URL` in the Render environment settings.
3. Deploy the service. Once built, run migrations to set up tables.

## Troubleshooting

* **Zod validation errors on startup**: Ensure all required environment variables are defined. If any are missing or incorrect, the app will exit immediately.
* **Database connection timeout**: Ensure `rejectUnauthorized: false` is configured for SSL (already default).
