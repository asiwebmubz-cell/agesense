# AgeSense Initiative Web App

A modern, responsive, and accessible Next.js web application built for the AgeSense Initiative Foundation, a non-profit organization focused on bridging the generational gap.

## Features

- **Public Facing Pages:** Beautifully designed Home, Programs, Impact, Operations, Donate, and Volunteer pages.
- **Admin Dashboard:** A robust backend interface to manage Volunteers, Donors, and Content.
- **Design System:** Implemented with Tailwind CSS based on the "Professional Compassion" token system.
- **Responsive Design:** Fully responsive layout with mobile-first principles.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** Google Material Symbols (via external stylesheet in layout)
- **Deployment:** Vercel (Recommended)

## Prerequisites

- Node.js (v18.17 or later)
- npm, yarn, or pnpm

## Setup & Run Instructions

1. **Clone or Download the Repository:**
   Navigate into the project directory:
   ```bash
   cd agesense-web-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **View in Browser:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                  # Next.js App Router structure
│   ├── admin/            # Admin dashboard routes
│   │   ├── content/
│   │   ├── donors/
│   │   ├── volunteers/
│   │   └── layout.tsx    # Admin layout with sidebar
│   ├── donate/           # Public donate page
│   ├── impact/           # Public impact page
│   ├── operations/       # Public operations page
│   ├── programs/         # Public programs page
│   ├── volunteer/        # Public volunteer form page
│   ├── globals.css       # Global CSS with Tailwind v4 variables
│   ├── layout.tsx        # Root layout with public Navbar/Footer
│   └── page.tsx          # Homepage
├── components/           # Reusable React components
│   ├── Navbar.tsx        # Public navigation
│   ├── Footer.tsx        # Public footer
│   └── DonateForm.tsx    # Interactive donation form
```

## Backend Integration Note

This is the frontend implementation. Currently, the application uses local state and mock data to demonstrate functionality.

**Areas requiring backend/database integration are marked in the code:**
- **Donation Submission:** `src/components/DonateForm.tsx` (Handling donation logic/verification).
- **Volunteer Registration:** `src/app/volunteer/page.tsx` (Submitting the multi-step form data).
- **Admin Dashboards:** All pages under `src/app/admin/*` currently use mock state. These need to be connected to a real database (e.g., PostgreSQL, MongoDB) via Next.js API Routes or Server Actions.

## Customization

You can modify the core theme variables in `src/app/globals.css` within the `@theme` directive to adjust colors, typography, or spacing across the entire application globally.
