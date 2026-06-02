# Production Deployment Playbook

This document details the configuration and deployment pipelines for releasing the **AgeSense Initiative** platform to production environments.

---

## 1. Supabase PostgreSQL Setup

Before deploying the frontend or backend, provision your production database instance.

1. **Sign Up / Log In**: Visit [Supabase](https://supabase.com/).
2. **Create Project**: Start a new project and select your database region.
3. **Database Schema**: Execute the SQL schemas defined in [docs/architecture.md](file:///d:/New%20folder/AgeSense/docs/architecture.md) within the Supabase SQL Editor.
4. **Retrieve Connection String**:
   - Navigate to **Project Settings** → **Database**.
   - Copy the URI connection string under the **Connection pooling** section (use Transaction mode on port `5432` or `6543` for scale).
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[POOLER-HOST]:6543/postgres?pgbouncer=true`

---

## 2. Backend Deployment on Render

Render is the recommended hosting platform for our Express.js API.

### Steps to Deploy
1. **Log In to Render**: Go to [Render](https://render.com/).
2. **Create Service**: Click **New +** and select **Web Service**.
3. **Connect Repository**: Link your GitHub repository.
4. **Configure Service Settings**:
   - **Name**: `agesense-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to database location.
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or custom paid tier)

### Environment Variables
Under the **Environment** tab, add the following variables:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render binds automatically, but good to define)
- `FRONTEND_URL`: URL of your deployed Next.js frontend (e.g. `https://agesense.org` or Vercel subdomain)
- `JWT_SECRET`: A secure cryptographically generated secret key.
- `DATABASE_URL`: Connection string copied from Supabase.
- `ADMIN_EMAIL`: Email of primary administrator.
- `ADMIN_PASSWORD`: Secure administrator password.
- `IMGBB_API_KEY`: API key for image hosting.
- `RENDER_EXTERNAL_URL`: URL of this Render web service (e.g. `https://agesense-backend.onrender.com`). *This is required for the keep-alive self-ping worker.*

---

## 3. Frontend Deployment on Vercel

Vercel is the native hosting platform for Next.js applications.

### Steps to Deploy
1. **Log In to Vercel**: Visit [Vercel](https://vercel.com/).
2. **Import Project**: Click **Add New** → **Project**, and select your GitHub repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select the `frontend` folder.
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next` (default)
4. **Add Environment Variables**:
   - Add `NEXT_PUBLIC_BACKEND_URL` set to the Render backend URL (e.g. `https://agesense-backend.onrender.com`). Ensure it does **not** end with a trailing slash.
5. **Deploy**: Click **Deploy**. Vercel will build the frontend and serve it at a custom `.vercel.app` subdomain or your configured custom domain.
