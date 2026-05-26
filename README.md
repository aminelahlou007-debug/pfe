# Ceremonie Project

Ceremonie is a Next.js portfolio/demo project for event planning and ceremony management. It includes a public marketing site, a guest-facing mode, and an admin dashboard with authenticated demo flows.

Live demo
---------

A live demo is available at: https://your-demo-domain.example (replace with your deployed URL).

Brief summary
-------------

Ceremonie helps couples and event planners manage ceremonies and guest lists. Key features include a public demo landing page, a client-side role switch for guest/admin views, MongoDB-backed persistence, an admin dashboard for tasks, guest management, vendor tracking, and a checkout flow for paid services. This repository contains the full Next.js app (app directory), reusable UI components (components), and server API routes (app/api).

## Quick Start

1. Install dependencies.

```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` and fill in the values. `OPENAI_API_KEY` is optional for the chatbot, but without it the assistant will fall back to built-in demo answers.

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
- `OPENAI_API_KEY` - optional; enables the AI-powered chatbot
- `OPENAI_MODEL` - optional; defaults to `gpt-4o-mini`
- `NEXTAUTH_SECRET` - not used in the current demo flow
- `NEXTAUTH_URL` - not used in the current demo flow

## Deploying

Vercel is the easiest deployment target:

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables listed above.
4. Deploy the production branch.

The chatbot route is server-side and Vercel-friendly. If `OPENAI_API_KEY` is set, the bot answers with an AI model; otherwise it still works with the built-in fallback responses.

If Vercel still fails during install with `ERR_INVALID_THIS`, add `ENABLE_EXPERIMENTAL_COREPACK=1` to the Vercel environment variables and redeploy immediately after saving it.

## Notes

- `node_modules/` and `.next/` are intentionally ignored and should not be committed.
- `pnpm-lock.yaml` is the active lockfile for this repo.
