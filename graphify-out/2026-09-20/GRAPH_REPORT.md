# Graph Report - AgeSense  (2026-09-20)

## Corpus Check
- 190 files · ~559,619 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 931 nodes · 1842 edges · 75 communities (64 shown, 11 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68e3f518`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- users/page.tsx
- app.ts
- ApiError
- frontend/package.json
- dependencies
- backend/src/services/partnerships.service.ts
- programs.validator.ts
- partnerships/page.tsx
- users
- compilerOptions
- volunteers.controller.ts
- test_login.js
- compilerOptions
- seed-admin.ts
- scripts
- 03_partnership_inquiries.sql
- next
- roles.routes.ts
- next-env.d.ts
- postcss.config.mjs
- What You Must Do When Invoked
- database/index.ts
- policies.routes.ts
- users.routes.ts
- useApi
- backend/package.json
- team.routes.ts
- frontend/src/services/site-content.service.ts
- annual-reports.routes.ts
- auth.controller.ts
- branches.controller.ts
- donors.routes.ts
- auth.service.ts
- AgeSense Initiative
- site-content.routes.ts
- react
- Database Migration Documentation
- express
- System Architecture & Design Document
- types/index.ts
- 15_roles_permissions.sql
- graphify reference: extra exports and benchmark
- Supabase Database Guide - AgeSense PostgreSQL
- AgeSense Initiative Web App
- Remaining Manual Actions Required for Deploying to Production
- Production Deployment Playbook
- sanitize.middleware.ts
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
- app/layout.tsx
- routes/index.ts
- frontend/src/services/programs.service.ts
- frontend/src/services/annual-reports.service.ts
- frontend/src/services/policies.service.ts
- apiFetch
- frontend/src/services/branches.service.ts
- (public)/layout.tsx
- volunteers/page.tsx
- api.ts
- health.controller.ts

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
- `createApp()` --indirect_call--> `notFoundMiddleware()`  [INFERRED]
  backend/src/app.ts → backend/src/middleware/notFound.middleware.ts
- `createApp()` --indirect_call--> `sanitizeMiddleware()`  [INFERRED]
  backend/src/app.ts → backend/src/middleware/sanitize.middleware.ts
- `requireSiteContentPermission()` --calls--> `ApiError`  [EXTRACTED]
  backend/src/routes/site-content.routes.ts → backend/src/utils/ApiError.ts
- `assertAllPermissionsExist()` --calls--> `ApiError`  [EXTRACTED]
  backend/src/services/roles.service.ts → backend/src/utils/ApiError.ts
- `forgotPassword()` --calls--> `apiFetch()`  [EXTRACTED]
  frontend/src/services/auth.service.ts → frontend/src/lib/api.ts

## Import Cycles
- None detected.

## Communities (75 total, 11 thin omitted)

### Community 0 - "users/page.tsx"
Cohesion: 0.18
Nodes (19): UsersAdminPage(), CATEGORY_LABELS, KNOWN_GROUPS, RolesSection(), createRole(), CreateRolePayload, deleteRole(), getRoles() (+11 more)

### Community 1 - "app.ts"
Cohesion: 0.14
Nodes (15): createApp(), corsOptions, getStaticOrigins(), normalizeOrigin(), env, envSchema, errorMiddleware(), generalLimiter (+7 more)

### Community 2 - "ApiError"
Cohesion: 0.24
Nodes (9): handleImageUpload, handleMultipleImagesUpload, storage, upload, notFoundMiddleware(), formatZodErrors(), validate(), ValidationTarget (+1 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, dependencies, lucide-react, next, react, react-dom, devDependencies, eslint (+25 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, argon2, cloudinary, cors, dotenv, express, express-rate-limit, helmet (+18 more)

### Community 5 - "backend/src/services/partnerships.service.ts"
Cohesion: 0.12
Nodes (19): createPartnership, getAllPartnerships, getPartnershipById, getPartnershipStats, updatePartnershipStatus, PartnershipActivity, PartnershipInquiry, partnershipsService (+11 more)

### Community 6 - "programs.validator.ts"
Cohesion: 0.16
Nodes (11): Program, programsService, CreateProgramInput, createProgramSchema, PROGRAM_STATUSES, PROGRAM_TYPES, programIdSchema, UpdateProgramInput (+3 more)

### Community 7 - "partnerships/page.tsx"
Cohesion: 0.15
Nodes (21): DetailModal(), formatDate(), formatDateTime(), PartnershipsAdminPage(), STAT_CARDS, STATUS_STYLES, INITIAL_FORM, PartnerPage() (+13 more)

### Community 8 - "users"
Cohesion: 0.09
Nodes (23): donors, programs, users, volunteers, program_images, idx_refresh_tokens_user_id, idx_security_logs_action, idx_security_logs_user_id (+15 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "volunteers.controller.ts"
Cohesion: 0.21
Nodes (11): createVolunteer, exportVolunteers, getAllVolunteers, updateVolunteerStatus, Volunteer, volunteersService, CreateVolunteerInput, createVolunteerSchema (+3 more)

### Community 11 - "test_login.js"
Cohesion: 0.12
Nodes (13): data, http, options, req, data, http, options, req (+5 more)

### Community 12 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, rootDir (+4 more)

### Community 13 - "seed-admin.ts"
Cohesion: 0.14
Nodes (8): SeedUser, seedUsers, { Pool }, ref_crypto, dotenv, ref_fs, ref_path, pg

### Community 14 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, migrate, seed-admin, start, type-check

### Community 15 - "03_partnership_inquiries.sql"
Cohesion: 0.52
Nodes (6): idx_partnership_activity_inquiry, idx_partnership_created_at, idx_partnership_status, idx_partnership_type, partnership_activity, partnership_inquiries

### Community 16 - "next"
Cohesion: 0.11
Nodes (7): nextConfig, EmptyState(), getOptimizedUrl(), ShowcaseGallery(), ShowcaseGalleryProps, config, next

### Community 17 - "roles.routes.ts"
Cohesion: 0.21
Nodes (14): createRole, deleteRole, getAllRoles, getRoleById, updateRole, router, assertAllPermissionsExist(), rolesService (+6 more)

### Community 21 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 22 - "database/index.ts"
Cohesion: 0.14
Nodes (15): dbHealthCheck(), db, pool, app, PORT, server, NOTE: Elders Helped, Aid Delivered, and Voluntary Hours have no verified, StatsResponse (+7 more)

### Community 23 - "policies.routes.ts"
Cohesion: 0.20
Nodes (15): createPolicy, deletePolicy, getAllPolicies, getPolicyById, getPublishedPolicies, updatePolicy, router, policiesService (+7 more)

### Community 24 - "users.routes.ts"
Cohesion: 0.19
Nodes (15): createUser, deleteUser, getAllUsers, getUserById, updateUser, router, usersService, UserSummary (+7 more)

### Community 25 - "useApi"
Cohesion: 0.27
Nodes (11): ImpactPage(), Home(), ProgramDetailPage(), ProgramsPage(), ErrorMessage(), LoadingSpinner(), useApi(), UseApiState (+3 more)

### Community 26 - "backend/package.json"
Cohesion: 0.10
Nodes (19): author, description, @types/node, typescript, keywords, license, main, name (+11 more)

### Community 27 - "team.routes.ts"
Cohesion: 0.20
Nodes (15): createTeamMember, deleteTeamMember, getActiveTeam, getAllTeam, getTeamMemberById, updateTeamMember, router, TeamMember (+7 more)

### Community 28 - "frontend/src/services/site-content.service.ts"
Cohesion: 0.17
Nodes (14): CMS_ITEMS, ContentItemConfig, SiteContentAdminPage(), FoundersStatementPage(), metadata, metadata, OurStoryPage(), metadata (+6 more)

### Community 29 - "annual-reports.routes.ts"
Cohesion: 0.22
Nodes (14): createAnnualReport, deleteAnnualReport, getAllAnnualReports, getAnnualReportById, getPublishedAnnualReports, updateAnnualReport, router, AnnualReport (+6 more)

### Community 30 - "auth.controller.ts"
Cohesion: 0.19
Nodes (17): forgotPassword, login, logout, NOTE: never log the raw reset token — it grants password-reset access., refresh, resetPassword, router, logSecurityEvent() (+9 more)

### Community 31 - "branches.controller.ts"
Cohesion: 0.17
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

### Community 35 - "site-content.routes.ts"
Cohesion: 0.20
Nodes (13): getAllSiteContent, getSiteContentByKey, updateSiteContentByKey, AuthenticatedRequest, requireAnyPermission(), requireSiteContentPermission(), router, SITE_CONTENT_PERMISSIONS (+5 more)

### Community 36 - "react"
Cohesion: 0.28
Nodes (8): DonorsAdminPage(), DonateForm(), CreateDonorPayload, getAllDonorsAdmin(), submitDonationVerification(), updateDonorStatusAdmin(), Donor, react

### Community 37 - "Database Migration Documentation"
Cohesion: 0.17
Nodes (11): 1. Overview of the Migration, 2. PostgreSQL Connection Pool Settings, 3. Database Schema Layout, 4. Admin Seeding Script, 5. Health Monitoring, Database Migration Documentation, `donors` table, `programs` table (+3 more)

### Community 38 - "express"
Cohesion: 0.25
Nodes (10): createProgram, deleteProgram, getAllPrograms, getPublishedPrograms, updateProgram, getStats, router, router (+2 more)

### Community 39 - "System Architecture & Design Document"
Cohesion: 0.18
Nodes (10): 1. System Overview, 2. Tech Stack Specification, 3. Database Schema Blueprint, 4. Security Framework, Backend, `donors`, Frontend, `programs` (+2 more)

### Community 40 - "types/index.ts"
Cohesion: 0.16
Nodes (15): metadata, RegionalChaptersPage(), metadata, TeamPage(), VolunteerPage(), getActiveBranches(), getActiveTeam(), submitVolunteerApplication() (+7 more)

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

### Community 47 - "sanitize.middleware.ts"
Cohesion: 0.48
Nodes (5): sanitizeMiddleware(), sanitizeHtml(), sanitizeObject(), sanitizeValue(), isomorphic-dompurify

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

### Community 63 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): frontend_src_app_globals, inter, metadata

### Community 64 - "routes/index.ts"
Cohesion: 0.25
Nodes (10): cloudinaryHealthCheck(), authMiddleware(), NOTE: Currently validates token structure only., strictLimiter, requirePermission(), requireRole(), router, UPLOAD_ROLES (+2 more)

### Community 65 - "frontend/src/services/programs.service.ts"
Cohesion: 0.33
Nodes (11): ContentAdminPage(), ProgramDetailView(), ProgramDetailViewProps, createProgram(), CreateProgramPayload, deleteProgram(), getAllPrograms(), updateProgram() (+3 more)

### Community 67 - "frontend/src/services/annual-reports.service.ts"
Cohesion: 0.29
Nodes (10): AnnualReportsAdminPage(), AnnualReportsPage(), metadata, AnnualReportPayload, createAnnualReport(), deleteAnnualReport(), getAllAnnualReports(), getPublishedAnnualReports() (+2 more)

### Community 68 - "frontend/src/services/policies.service.ts"
Cohesion: 0.29
Nodes (10): PoliciesAdminPage(), metadata, PoliciesPage(), createPolicy(), deletePolicy(), getAllPolicies(), getPublishedPolicies(), PolicyPayload (+2 more)

### Community 69 - "apiFetch"
Cohesion: 0.44
Nodes (9): TeamAdminPage(), apiFetch(), createTeamMember(), deleteTeamMember(), getAllTeam(), getTeamMemberById(), TeamMemberPayload, updateTeamMember() (+1 more)

### Community 70 - "frontend/src/services/branches.service.ts"
Cohesion: 0.40
Nodes (8): BranchesAdminPage(), BranchPayload, createBranch(), deleteBranch(), getAllBranches(), getBranchById(), updateBranch(), Branch

### Community 72 - "volunteers/page.tsx"
Cohesion: 0.60
Nodes (4): VolunteersAdminPage(), API_BASE_URL, getAllVolunteersAdmin(), updateVolunteerStatusAdmin()

### Community 73 - "api.ts"
Cohesion: 0.50
Nodes (4): FetchOptions, getAuthHeaders(), getToken(), ApiError

## Knowledge Gaps
- **302 isolated node(s):** `name`, `version`, `description`, `main`, `dev` (+297 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 358 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `express` to `routes/index.ts`, `app.ts`, `donors.routes.ts`, `site-content.routes.ts`, `ApiError`, `backend/src/services/partnerships.service.ts`, `health.controller.ts`, `volunteers.controller.ts`, `sanitize.middleware.ts`, `roles.routes.ts`, `database/index.ts`, `policies.routes.ts`, `users.routes.ts`, `backend/package.json`, `team.routes.ts`, `annual-reports.routes.ts`, `auth.controller.ts`, `branches.controller.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `users/page.tsx`, `frontend/src/services/programs.service.ts`, `auth.service.ts`, `frontend/src/services/annual-reports.service.ts`, `frontend/package.json`, `frontend/src/services/policies.service.ts`, `frontend/src/services/branches.service.ts`, `partnerships/page.tsx`, `apiFetch`, `volunteers/page.tsx`, `types/index.ts`, `(public)/layout.tsx`, `next`, `useApi`, `frontend/src/services/site-content.service.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `backend/package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._