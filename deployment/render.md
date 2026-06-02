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
| `FRONTEND_URL` | URL of the frontend app | `https://agesense.vercel.app` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres` |
| `JWT_SECRET` | Secret key for JWT | Secure random string (min 16 chars) |
| `ADMIN_EMAIL` | Administrator Email | `admin@agesense.org` |
| `ADMIN_PASSWORD` | Administrator Password | Secure admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | `dbacpre0g` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `266564921745161` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `PDDSEBsmDfsr4Hxa3MvsOZJEHf4` |
| `RENDER_EXTERNAL_URL` | External URL of the service | Set to the Render assigned URL (e.g. `https://agesense-api.onrender.com`) |

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
