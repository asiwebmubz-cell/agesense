# Vercel Deployment Guide - AgeSense Frontend

This guide outlines the production deployment settings for the Next.js frontend on Vercel.

## Build Settings

* **Framework Preset**: `Next.js`
* **Build Command**: `npm run build`
* **Output Directory**: `.next`

## Root Directory

Set the **Root Directory** to `frontend` in your Vercel project settings if importing the monorepo root.

## Environment Variables

Configure these variables in the Vercel Dashboard under **Environment Variables**:

| Variable | Description | Value |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Base URL of the backend API | e.g. `https://agesense-backend.onrender.com` |

## Domain Configuration

1. In Vercel, navigate to **Settings** > **Domains**.
2. Add your custom domain (e.g. `agesense.org` or custom Hostinger domain).
3. Update the DNS CNAME/A records in your Hostinger panel as guided by Vercel.

## Troubleshooting

* **Build fails on Typescript check**: Ensure all types in `@/types` align with backend API responses.
* **API requests fail**: Ensure `NEXT_PUBLIC_BACKEND_URL` is set without a trailing slash (e.g., `https://agesense-backend.onrender.com`).
