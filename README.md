# AgeSense Initiative

[![CI Verification](https://github.com/AgeSense-Initiative/agesense/actions/workflows/verify.yml/badge.svg)](https://github.com/AgeSense-Initiative/agesense/actions/workflows/verify.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=20](https://img.shields.io/badge/Node->=20-blue.svg)](https://nodejs.org/)

AgeSense Initiative is a youth-led nonprofit organization platform dedicated to improving the quality of life and ensuring dignity for elderly individuals across Bangladesh. The platform serves as the central hub for showcasing program initiatives, raising donations, managing volunteers, and facilitating administrator oversight.

---

## 🏗️ Repository Architecture & Layout

This project is organized as a clean full-stack monorepo:

```text
AgeSense/
├── .github/              # CI/CD workflows and GitHub configurations
├── backend/              # Express.js Rest API (TypeScript)
│   ├── src/              # Source code (routes, controllers, services)
│   ├── .env.example      # Template for backend environment variables
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Backend dependencies and run scripts
├── frontend/             # Next.js 16 Web Application & Admin Console (React 19, TS, Tailwind)
│   ├── src/              # Next.js source code (app router, components, styles)
│   ├── public/           # Static assets (logos, svg files)
│   ├── .env.example      # Template for frontend environment variables
│   └── package.json      # Frontend dependencies and run scripts
├── docs/                 # Detailed architectural and deployment documentation
│   ├── architecture.md   # Core design guidelines, DB schema & state management
│   ├── deployment.md     # Production deployment playbook (Vercel & Render)
│   └── PROJECT_STATUS.md # Current status tracking and local boot guide
├── deployment/           # Deployment blueprint assets
└── scripts/              # Devops, tooling, and database migration helper scripts
```

For a deeper dive into architecture and schemas, see the [Architecture Guide](file:///d:/New%20folder/AgeSense/docs/architecture.md).

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **PostgreSQL** database (or Supabase instance)

### 1. Clone & Setup Workspace
```bash
git clone https://github.com/your-username/agesense.git
cd agesense
```

### 2. Configure Environment Variables
Copy the template files and fill in your local or production credentials:
```bash
# Setup backend environment variables
cp backend/.env.example backend/.env

# Setup frontend environment variables
cp frontend/.env.example frontend/.env.local
```

### 3. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend API will start on [http://localhost:5000](http://localhost:5000). You can check health at [http://localhost:5000/api/health](http://localhost:5000/api/health).*

### 4. Run the Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
*The Next.js frontend will boot on [http://localhost:3000](http://localhost:3000).*

---

## ⚙️ Available Scripts

### Backend (`/backend`)
- `npm run dev`: Boots development server with auto-reload using `ts-node`.
- `npm run build`: Compiles TypeScript source files into JavaScript in `/dist`.
- `npm run start`: Starts the compiled production server in `/dist`.
- `npm run type-check`: Verifies codebase type safety without compiling.
- `npm run clean`: Deletes the `/dist` directory.

### Frontend (`/frontend`)
- `npm run dev`: Launches Next.js dev server with hot module replacement (HMR).
- `npm run build`: Compiles the React/Next.js application for production.
- `npm run start`: Boots the Next.js server using production builds.
- `npm run lint`: Analyzes code style and TypeScript rules using ESLint.

---

## 🚀 Deployment Playbook
The frontend is designed for hosting on **Vercel**, and the backend Express server on **Render**. For comprehensive, step-by-step instructions on setting up pipelines, database connection pools, environment secrets, and automated tasks, refer to the [Deployment Guide](file:///d:/New%20folder/AgeSense/docs/deployment.md).

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
