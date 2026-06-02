# Project Status & Documentation: AgeSense Initiative

This document provides a comprehensive overview of the full-stack architecture and directory structure of the **AgeSense Initiative** platform.

---

## 1. Project Overview & Folder Structure

The workspace is cleanly structured into exactly two top-level directories:

1. **`frontend/` (Next.js Application)**:
   - Contains the decoupled, user-facing Next.js 14 web application.
   - Built using **TypeScript**, **Tailwind CSS v4** implementing the *"Professional Compassion"* color token system, and Google Material Symbols.
   - Reaches out to the backend API via standard `fetch` methods.

2. **`backend/` (Express.js API)**:
   - An independent Express server built in **TypeScript** containing RESTful routing, Postgres connection management, and cron workers for keep-alive automation.

---

## 2. Codebase Architecture

```text
d:\New folder\
├── frontend/               # Next.js 14 Frontend Application
│   ├── public/             # Static assets (logos, banner pictures)
│   └── src/
│       ├── app/
│       │   ├── (public)/   # Public routes group (home, programs, donate, impact, etc.)
│       │   ├── admin/      # Admin dashboard login and secured content pages
│       │   └── layout.tsx  # Root layout structure
│       ├── components/     # Reusable React components (Navbar, Footer, DonateForm)
│       └── types/          # Shared TypeScript type definitions
│
├── backend/                # Express.js Backend API
│   ├── src/
│   │   └── server.ts       # Express server initialization & routing
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Dependencies list
```

---

## 3. How to Run the Project Locally

### Running the Backend API
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
* The API will start on `http://localhost:5000`.

### Running the Frontend Website
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js dev server:
   ```bash
   npm run dev
   ```
* The website will start on `http://localhost:3000`.
