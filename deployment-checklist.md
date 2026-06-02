# AgeSense Initiative Production Deployment Checklist

```text
✓ GitHub Ready

✓ Supabase Ready

✓ Cloudinary Ready

✓ Render Ready

✓ Vercel Ready

✓ Hostinger Ready

✓ Production Ready
```

---

## Remaining Manual Actions Required for Deploying to Production

The codebase is fully verified, optimized, and ready. You must manually execute the following setup steps:

### 1. Database (Supabase) Setup
* Go to the **Supabase Dashboard** and copy your database connection password.
* Replace the `[YOUR-PASSWORD]` placeholder in the `DATABASE_URL` within the Render and local `.env` settings.
* Once the connection string is valid, run migrations from the terminal to create the tables:
  ```bash
  cd backend
  npm run migrate
  npm run seed-admin
  ```

### 2. Backend Deployment on Render
* Log in to **Render** and create a new **Web Service**.
* Connect your GitHub repository. Set the **Root Directory** to `backend`.
* In environment settings, copy all keys from `backend/.env.example` and set their values. Make sure to generate a secure random string (at least 32 characters) for `JWT_SECRET`.
* Configure your real `ADMIN_EMAIL` and `ADMIN_PASSWORD` keys.
* Click Deploy.

### 3. Image Storage (Cloudinary) Setup
* Log in to **Cloudinary** and copy your Credentials (Cloud Name, API Key, API Secret).
* Set these credentials as environment variables on Render (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

### 4. Frontend Deployment on Vercel
* Log in to **Vercel** and select **New Project**.
* Connect your GitHub repository.
* Set the **Root Directory** to `frontend`.
* Add the environment variable `NEXT_PUBLIC_BACKEND_URL` and point it to your deployed Render URL (e.g. `https://agesense-backend.onrender.com`).
* Deploy the project.

### 5. Custom Domain Configuration (Hostinger)
* Go to **Vercel** > **Settings** > **Domains** and add your custom domain.
* Log in to your **Hostinger control panel**, navigate to **DNS Zone Editor**, and add CNAME and A records pointing to Vercel's nameservers as instructed.
