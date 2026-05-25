# Ceremonie Project

Ceremonie is a Next.js portfolio/demo project for event planning and ceremony management. It includes a public marketing site, a guest-facing mode, and an admin dashboard with authenticated demo flows.

Live demo
---------

A live demo is available at: https://your-demo-domain.example (replace with your deployed URL).

Brief summary
-------------

Ceremonie helps couples and event planners manage ceremonies and guest lists. Key features include: authentication (NextAuth), MongoDB-backed persistence, an admin dashboard for tasks, guest management, vendor tracking, and a checkout flow for paid services. This repository contains the full Next.js app (app directory), reusable UI components (components), and server API routes (app/api).

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` and fill in the values.

3. Start the app.

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - start the development server
- `pnpm build` - create a production build
- `pnpm start` - run the production build locally
- `pnpm lint` - run ESLint

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth signing secret
- `NEXTAUTH_URL` - app URL used by NextAuth

## Deploying

Vercel is the easiest deployment target:

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables listed above.
4. Deploy the production branch.

## Notes

- `node_modules/` and `.next/` are intentionally ignored and should not be committed.
- `pnpm-lock.yaml` is the active lockfile for this repo.
