# Graph Report - AgeSense  (2026-09-20)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 495 nodes · 979 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23dd5401`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- apiFetch
- backend/package.json
- routes/index.ts
- frontend/package.json
- dependencies
- partnerships.routes.ts
- programs.routes.ts
- partnerships/page.tsx
- 04_security_hardening.sql
- compilerOptions
- volunteers.routes.ts
- test_login.js
- compilerOptions
- migrate.ts
- scripts
- 03_partnership_inquiries.sql
- (public)/layout.tsx
- app/layout.tsx
- next-env.d.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `express` - 27 edges
2. `apiFetch()` - 24 edges
3. `ApiError` - 22 edges
4. `next` - 19 edges
5. `react` - 16 edges
6. `compilerOptions` - 16 edges
7. `useApi()` - 15 edges
8. `Env` - 12 edges
9. `compilerOptions` - 11 edges
10. `getPublishedPrograms()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ProgramDetailViewProps` --references--> `Program`  [EXTRACTED]
  frontend/src/components/ui/ProgramDetailView.tsx → frontend/src/types/index.ts
- `CreateProgramPayload` --references--> `Program`  [EXTRACTED]
  frontend/src/services/programs.service.ts → frontend/src/types/index.ts
- `notFoundMiddleware()` --calls--> `ApiError`  [EXTRACTED]
  backend/src/middleware/notFound.middleware.ts → backend/src/utils/ApiError.ts
- `DonorsAdminPage()` --indirect_call--> `getAllDonorsAdmin()`  [INFERRED]
  frontend/src/app/admin/(dashboard)/donors/page.tsx → frontend/src/services/donors.service.ts
- `VolunteersAdminPage()` --indirect_call--> `getAllVolunteersAdmin()`  [INFERRED]
  frontend/src/app/admin/(dashboard)/volunteers/page.tsx → frontend/src/services/volunteers.service.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "apiFetch"
Cohesion: 0.05
Nodes (59): nextConfig, ContentAdminPage(), DonorsAdminPage(), AdminLayout(), VolunteersAdminPage(), AdminLoginPage(), ImpactPage(), Home() (+51 more)

### Community 1 - "backend/package.json"
Cohesion: 0.05
Nodes (50): author, description, keywords, license, main, name, version, createApp() (+42 more)

### Community 2 - "routes/index.ts"
Cohesion: 0.07
Nodes (46): login, logout, refresh, cloudinaryHealthCheck(), createDonor, exportDonors, getAllDonors, updateDonorStatus (+38 more)

### Community 3 - "frontend/package.json"
Cohesion: 0.06
Nodes (33): @types/node, typescript, eslintConfig, dependencies, lucide-react, next, react, react-dom (+25 more)

### Community 4 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, argon2, cloudinary, cors, dotenv, express, express-rate-limit, helmet (+18 more)

### Community 5 - "partnerships.routes.ts"
Cohesion: 0.14
Nodes (20): createPartnership, getAllPartnerships, getPartnershipById, getPartnershipStats, updatePartnershipStatus, router, PartnershipActivity, PartnershipInquiry (+12 more)

### Community 6 - "programs.routes.ts"
Cohesion: 0.14
Nodes (17): createProgram, deleteProgram, getAllPrograms, getPublishedPrograms, updateProgram, router, Program, programsService (+9 more)

### Community 7 - "partnerships/page.tsx"
Cohesion: 0.15
Nodes (21): DetailModal(), formatDate(), formatDateTime(), PartnershipsAdminPage(), STAT_CARDS, STATUS_STYLES, INITIAL_FORM, PartnerPage() (+13 more)

### Community 8 - "04_security_hardening.sql"
Cohesion: 0.15
Nodes (15): donors, programs, users, volunteers, program_images, idx_refresh_tokens_user_id, idx_security_logs_action, idx_security_logs_user_id (+7 more)

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

### Community 13 - "migrate.ts"
Cohesion: 0.18
Nodes (6): { Pool }, ref_crypto, dotenv, ref_fs, ref_path, pg

### Community 14 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, dev, migrate, seed-admin, start, type-check

### Community 15 - "03_partnership_inquiries.sql"
Cohesion: 0.52
Nodes (6): idx_partnership_activity_inquiry, idx_partnership_created_at, idx_partnership_status, idx_partnership_type, partnership_activity, partnership_inquiries

### Community 17 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): frontend_src_app_globals, inter, metadata

## Knowledge Gaps
- **156 isolated node(s):** `ShowcaseGalleryProps`, `UseApiState`, `FetchOptions`, `CreateDonorPayload`, `StatsResponse` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 186 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `apiFetch` to `(public)/layout.tsx`, `frontend/package.json`, `partnerships/page.tsx`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **Why does `express` connect `routes/index.ts` to `backend/package.json`, `volunteers.routes.ts`, `partnerships.routes.ts`, `programs.routes.ts`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `@types/node` connect `frontend/package.json` to `backend/package.json`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **What connects `ShowcaseGalleryProps`, `UseApiState`, `FetchOptions` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `apiFetch` be split into smaller, more focused modules?**
  _Cohesion score 0.05304982817869416 - nodes in this community are weakly interconnected._
- **Should `backend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05115089514066496 - nodes in this community are weakly interconnected._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07023705004389816 - nodes in this community are weakly interconnected._