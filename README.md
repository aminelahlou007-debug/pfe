# Ceremonie Project (PFE)

This is the Ceremonie project. Optimizations applied:

- Enabled `reactStrictMode` and `swcMinify` in `next.config.mjs`.
- Enabled Next.js image optimization (set `unoptimized: false`).

To publish this repository to GitHub and deploy (recommended: Vercel):

1. Create a GitHub repo named `pfe` and copy its remote URL.
2. Link the remote and push:

```bash
git remote add origin <GITHUB_REMOTE_URL>
git branch -M main
git push -u origin main
```

3. Import the repo into Vercel, configure environment variables, and deploy.
