# Graph Report - AgeSense  (2026-09-20)

## Corpus Check
- 196 files · ~562,975 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 950 nodes · 1871 edges · 69 communities (58 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `926d51e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiFetch
- backend/package.json
- frontend/src/services/programs.service.ts
- frontend/package.json
- dependencies
- partnerships.routes.ts
- programs.routes.ts
- partnerships/page.tsx
- users
- compilerOptions
- volunteers.routes.ts
- test_login.js
- compilerOptions
- dotenv
- scripts
- 03_partnership_inquiries.sql
- next
- roles.routes.ts
- next-env.d.ts
- postcss.config.mjs
- What You Must Do When Invoked
- types/index.ts
- policies.routes.ts
- users.routes.ts
- useApi
- frontend/src/services/annual-reports.service.ts
- team.routes.ts
- frontend/src/services/site-content.service.ts
- annual-reports.routes.ts
- auth.controller.ts
- branches.routes.ts
- donors.routes.ts
- auth.service.ts
- AgeSense Initiative
- ApiError
- api.ts
- Database Migration Documentation
- routes/index.ts
- System Architecture & Design Document
- volunteers/page.tsx
- 15_roles_permissions.sql
- graphify reference: extra exports and benchmark
- Supabase Database Guide - AgeSense PostgreSQL
- AgeSense Initiative Web App
- Remaining Manual Actions Required for Deploying to Production
- Production Deployment Playbook
- frontend/src/services/policies.service.ts
- Render Deployment Guide - AgeSense Backend
- Vercel Deployment Guide - AgeSense Frontend
- Project Status & Documentation: AgeSense Initiative
- branches
- graphify reference: query, path, explain
- Cloudinary Configuration Guide - AgeSense Image Storage
- 08_annual_reports.sql
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- 09_policies.sql
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- frontend/src/services/branches.service.ts
- react
- (dashboard)/team/page.tsx
- kilo.json

## God Nodes (most connected - your core abstractions)
1. `apiFetch()` - 67 edges
2. `express` - 41 edges
3. `ApiError` - 35 edges
4. `next` - 27 edges
5. `react` - 24 edges
6. `db` - 17 edges
7. `compilerOptions` - 16 edges
8. `zod` - 15 edges
9. `validate()` - 15 edges
10. `asyncHandler()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `assertAllPermissionsExist()` --calls--> `ApiError`  [EXTRACTED]
  backend/src/services/roles.service.ts → backend/src/utils/ApiError.ts
- `forgotPassword()` --calls--> `apiFetch()`  [EXTRACTED]
  frontend/src/services/auth.service.ts → frontend/src/lib/api.ts
- `getBranchById()` --calls--> `apiFetch()`  [EXTRACTED]
  frontend/src/services/branches.service.ts → frontend/src/lib/api.ts
- `getTeamMemberById()` --calls--> `apiFetch()`  [EXTRACTED]
  frontend/src/services/team.service.ts → frontend/src/lib/api.ts
- `createApp()` --indirect_call--> `errorMiddleware()`  [INFERRED]
  backend/src/app.ts → backend/src/middleware/error.middleware.ts

## Import Cycles
- None detected.

## Communities (69 total, 11 thin omitted)

### Community 0 - "apiFetch"
Cohesion: 0.20
Nodes (20): UsersAdminPage(), CATEGORY_LABELS, KNOWN_GROUPS, RolesSection(), apiFetch(), createRole(), CreateRolePayload, deleteRole() (+12 more)

### Community 1 - "backend/package.json"
Cohesion: 0.05
Nodes (51): author, description, @types/node, typescript, keywords, license, main, name (+43 more)

### Community 2 - "frontend/src/services/programs.service.ts"
Cohesion: 0.25
Nodes (13): ContentAdminPage(), ProgramDetailViewProps, getOptimizedUrl(), ShowcaseGallery(), ShowcaseGalleryProps, createProgram(), CreateProgramPayload, deleteProgram() (+5 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, dependencies, lucide-react, next, react, react-dom, devDependencies, eslint (+25 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, argon2, cloudinary, cors, dotenv, express, express-rate-limit, helmet (+18 more)

### Community 5 - "partnerships.routes.ts"
Cohesion: 0.12
Nodes (22): createPartnership, getAllPartnerships, getPartnershipById, getPartnershipStats, updatePartnershipStatus, strictLimiter, router, PartnershipActivity (+14 more)

### Community 6 - "programs.routes.ts"
Cohesion: 0.14
Nodes (17): createProgram, deleteProgram, getAllPrograms, getPublishedPrograms, updateProgram, router, Program, programsService (+9 more)

### Community 7 - "partnerships/page.tsx"
Cohesion: 0.15
Nodes (21): DetailModal(), formatDate(), formatDateTime(), PartnershipsAdminPage(), STAT_CARDS, STATUS_STYLES, INITIAL_FORM, PartnerPage() (+13 more)

### Community 8 - "users"
Cohesion: 0.09
Nodes (23): donors, programs, users, volunteers, program_images, idx_refresh_tokens_user_id, idx_security_logs_action, idx_security_logs_user_id (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "volunteers.routes.ts"
Cohesion: 0.24
Nodes (12): createVolunteer, exportVolunteers, getAllVolunteers, updateVolunteerStatus, router, Volunteer, volunteersService, CreateVolunteerInput (+4 more)

### Community 11 - "test_login.js"
Cohesion: 0.12
Nodes (13): data, http, options, req, data, http, options, req (+5 more)

### Community 12 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, rootDir (+4 more)

### Community 13 - "dotenv"
Cohesion: 0.09
Nodes (15): apiCall(), record(), results, runQA(), TestResult, SeedUser, seedUsers, { Pool } (+7 more)

### Community 14 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, migrate, seed-admin, start, type-check

### Community 15 - "03_partnership_inquiries.sql"
Cohesion: 0.52
Nodes (6): idx_partnership_activity_inquiry, idx_partnership_created_at, idx_partnership_status, idx_partnership_type, partnership_activity, partnership_inquiries

### Community 16 - "next"
Cohesion: 0.10
Nodes (7): nextConfig, frontend_src_app_globals, inter, metadata, EmptyState(), config, next

### Community 17 - "roles.routes.ts"
Cohesion: 0.21
Nodes (14): createRole, deleteRole, getAllRoles, getRoleById, updateRole, router, assertAllPermissionsExist(), rolesService (+6 more)

### Community 21 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 22 - "types/index.ts"
Cohesion: 0.23
Nodes (11): metadata, RegionalChaptersPage(), metadata, TeamPage(), getActiveBranches(), getActiveTeam(), CommitteeType, ContentItem (+3 more)

### Community 23 - "policies.routes.ts"
Cohesion: 0.22
Nodes (14): createPolicy, deletePolicy, getAllPolicies, getPolicyById, getPublishedPolicies, updatePolicy, router, policiesService (+6 more)

### Community 24 - "users.routes.ts"
Cohesion: 0.21
Nodes (14): createUser, deleteUser, getAllUsers, getUserById, updateUser, router, usersService, UserSummary (+6 more)

### Community 25 - "useApi"
Cohesion: 0.25
Nodes (12): ImpactPage(), Home(), ProgramDetailPage(), ProgramsPage(), ErrorMessage(), LoadingSpinner(), ProgramDetailView(), useApi() (+4 more)

### Community 26 - "frontend/src/services/annual-reports.service.ts"
Cohesion: 0.29
Nodes (10): AnnualReportsAdminPage(), AnnualReportsPage(), metadata, AnnualReportPayload, createAnnualReport(), deleteAnnualReport(), getAllAnnualReports(), getPublishedAnnualReports() (+2 more)

### Community 27 - "team.routes.ts"
Cohesion: 0.22
Nodes (14): createTeamMember, deleteTeamMember, getActiveTeam, getAllTeam, getTeamMemberById, updateTeamMember, TeamMember, teamService (+6 more)

### Community 28 - "frontend/src/services/site-content.service.ts"
Cohesion: 0.17
Nodes (14): CMS_ITEMS, ContentItemConfig, SiteContentAdminPage(), FoundersStatementPage(), metadata, metadata, OurStoryPage(), metadata (+6 more)

### Community 29 - "annual-reports.routes.ts"
Cohesion: 0.24
Nodes (13): createAnnualReport, deleteAnnualReport, getAllAnnualReports, getAnnualReportById, getPublishedAnnualReports, updateAnnualReport, AnnualReport, annualReportsService (+5 more)

### Community 30 - "auth.controller.ts"
Cohesion: 0.19
Nodes (17): forgotPassword, login, logout, NOTE: never log the raw reset token — it grants password-reset access., refresh, resetPassword, router, logSecurityEvent() (+9 more)

### Community 31 - "branches.routes.ts"
Cohesion: 0.24
Nodes (13): createBranch, deleteBranch, getActiveBranches, getAllBranches, getBranchById, updateBranch, Branch, branchesService (+5 more)

### Community 32 - "donors.routes.ts"
Cohesion: 0.23
Nodes (12): createDonor, exportDonors, getAllDonors, updateDonorStatus, router, Donor, donorsService, CreateDonorInput (+4 more)

### Community 33 - "auth.service.ts"
Cohesion: 0.22
Nodes (8): AdminLayout(), AdminLoginPage(), ResetPasswordForm(), forgotPassword(), login(), logout(), resetPassword(), LoginResponse

### Community 34 - "AgeSense Initiative"
Cohesion: 0.14
Nodes (13): 1. Clone & Setup Workspace, 2. Configure Environment Variables, 3. Run the Backend Server, 4. Run the Frontend Client, AgeSense Initiative, ⚙️ Available Scripts, Backend (`/backend`), 🚀 Deployment Playbook (+5 more)

### Community 35 - "ApiError"
Cohesion: 0.14
Nodes (21): getAllSiteContent, getSiteContentByKey, updateSiteContentByKey, AuthenticatedRequest, authMiddleware(), NOTE: Currently validates token structure only., requireAnyPermission(), requirePermission() (+13 more)

### Community 36 - "api.ts"
Cohesion: 0.28
Nodes (10): DonorsAdminPage(), API_BASE_URL, FetchOptions, getAuthHeaders(), getToken(), CreateDonorPayload, getAllDonorsAdmin(), updateDonorStatusAdmin() (+2 more)

### Community 37 - "Database Migration Documentation"
Cohesion: 0.17
Nodes (11): 1. Overview of the Migration, 2. PostgreSQL Connection Pool Settings, 3. Database Schema Layout, 4. Admin Seeding Script, 5. Health Monitoring, Database Migration Documentation, `donors` table, `programs` table (+3 more)

### Community 38 - "routes/index.ts"
Cohesion: 0.12
Nodes (19): cloudinaryHealthCheck(), healthCheck(), getStats, handleImageUpload, handleMultipleImagesUpload, storage, upload, router (+11 more)

### Community 39 - "System Architecture & Design Document"
Cohesion: 0.18
Nodes (10): 1. System Overview, 2. Tech Stack Specification, 3. Database Schema Blueprint, 4. Security Framework, Backend, `donors`, Frontend, `programs` (+2 more)

### Community 40 - "volunteers/page.tsx"
Cohesion: 0.33
Nodes (7): VolunteersAdminPage(), VolunteerPage(), getAllVolunteersAdmin(), submitVolunteerApplication(), updateVolunteerStatusAdmin(), Volunteer, VolunteerStatus

### Community 41 - "15_roles_permissions.sql"
Cohesion: 0.60
Nodes (5): idx_role_permissions_role, idx_roles_name, permissions, role_permissions, roles

### Community 42 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 43 - "Supabase Database Guide - AgeSense PostgreSQL"
Cohesion: 0.22
Nodes (8): Backup Process, Connection Pool Configuration, Connection String Setup, Health Monitoring, Migration Process, Seeding:, Supabase Database Guide - AgeSense PostgreSQL, To Apply Migrations:

### Community 44 - "AgeSense Initiative Web App"
Cohesion: 0.22
Nodes (8): AgeSense Initiative Web App, Backend Integration Note, Customization, Features, Prerequisites, Project Structure, Setup & Run Instructions, Tech Stack

### Community 45 - "Remaining Manual Actions Required for Deploying to Production"
Cohesion: 0.25
Nodes (7): 1. Database (Supabase) Setup, 2. Backend Deployment on Render, 3. Image Storage (Cloudinary) Setup, 4. Frontend Deployment on Vercel, 5. Custom Domain Configuration (Hostinger), AgeSense Initiative Production Deployment Checklist, Remaining Manual Actions Required for Deploying to Production

### Community 46 - "Production Deployment Playbook"
Cohesion: 0.25
Nodes (7): 1. Supabase PostgreSQL Setup, 2. Backend Deployment on Render, 3. Frontend Deployment on Vercel, Environment Variables, Production Deployment Playbook, Steps to Deploy, Steps to Deploy

### Community 47 - "frontend/src/services/policies.service.ts"
Cohesion: 0.29
Nodes (10): PoliciesAdminPage(), metadata, PoliciesPage(), createPolicy(), deletePolicy(), getAllPolicies(), getPublishedPolicies(), PolicyPayload (+2 more)

### Community 48 - "Render Deployment Guide - AgeSense Backend"
Cohesion: 0.29
Nodes (6): Build and Start Commands, Database Setup Workflow, Health Check URL, Render Deployment Guide - AgeSense Backend, Required Environment Variables, Troubleshooting

### Community 49 - "Vercel Deployment Guide - AgeSense Frontend"
Cohesion: 0.29
Nodes (6): Build Settings, Domain Configuration, Environment Variables, Root Directory, Troubleshooting, Vercel Deployment Guide - AgeSense Frontend

### Community 50 - "Project Status & Documentation: AgeSense Initiative"
Cohesion: 0.29
Nodes (6): 1. Project Overview & Folder Structure, 2. Codebase Architecture, 3. How to Run the Project Locally, Project Status & Documentation: AgeSense Initiative, Running the Backend API, Running the Frontend Website

### Community 51 - "branches"
Cohesion: 0.47
Nodes (4): branches, idx_branches_active, idx_team_branch, team_members

### Community 52 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 53 - "Cloudinary Configuration Guide - AgeSense Image Storage"
Cohesion: 0.33
Nodes (5): Allowed Types, API Usage, Cloudinary Configuration Guide - AgeSense Image Storage, Folder Structure, Upload Limits

### Community 54 - "08_annual_reports.sql"
Cohesion: 0.83
Nodes (3): annual_reports, idx_annual_reports_published, idx_annual_reports_year

### Community 55 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 56 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 57 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 63 - "frontend/src/services/branches.service.ts"
Cohesion: 0.40
Nodes (8): BranchesAdminPage(), BranchPayload, createBranch(), deleteBranch(), getAllBranches(), getBranchById(), updateBranch(), Branch

### Community 64 - "react"
Cohesion: 0.24
Nodes (5): DonateForm(), Footer(), Navbar(), submitDonationVerification(), react

### Community 65 - "(dashboard)/team/page.tsx"
Cohesion: 0.40
Nodes (8): TeamAdminPage(), createTeamMember(), deleteTeamMember(), getAllTeam(), getTeamMemberById(), TeamMemberPayload, updateTeamMember(), TeamMember

## Knowledge Gaps
- **308 isolated node(s):** `$schema`, `plugin`, `name`, `version`, `description` (+303 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `routes/index.ts` to `donors.routes.ts`, `backend/package.json`, `ApiError`, `partnerships.routes.ts`, `programs.routes.ts`, `volunteers.routes.ts`, `roles.routes.ts`, `policies.routes.ts`, `users.routes.ts`, `team.routes.ts`, `annual-reports.routes.ts`, `auth.controller.ts`, `branches.routes.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `backend/package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `apiFetch`, `auth.service.ts`, `frontend/src/services/programs.service.ts`, `frontend/package.json`, `api.ts`, `(dashboard)/team/page.tsx`, `partnerships/page.tsx`, `volunteers/page.tsx`, `frontend/src/services/policies.service.ts`, `useApi`, `frontend/src/services/annual-reports.service.ts`, `frontend/src/services/site-content.service.ts`, `frontend/src/services/branches.service.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `name` to the rest of the system?**
  _308 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05004389815627744 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._