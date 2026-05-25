Vercel deploy checklist and troubleshooting
=========================================

Follow these steps to ensure Vercel builds and connects to MongoDB Atlas correctly.

1) Required env vars (Project → Settings → Environment Variables)
   - `MONGODB_URI` = your Atlas connection string (include the database name), e.g.
     `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/wildflower-co?retryWrites=true&w=majority`
   - `MONGODB_URI` = your MongoDB connection string
   - `ENABLE_EXPERIMENTAL_COREPACK` = `1` (workaround for some Vercel/Corepack install issues)

   Add them for Production and Preview (or choose scopes intentionally).

2) Recommended build settings (Project → Settings → General → Build & Development Settings)
   - Install Command: `pnpm install`
   - Build Command: `pnpm build`
   - Output Directory: leave blank (Next.js default)

   Note: we added a `.npmrc` file to this repo to hint Vercel to use `pnpm`. If Vercel still runs `npm install`, set the Install Command explicitly.
   If the install still errors with `ERR_INVALID_THIS`, add `ENABLE_EXPERIMENTAL_COREPACK=1` in Vercel env vars and redeploy immediately after saving it.

3) MongoDB Atlas network access
   - In Atlas, go to Network Access and add Vercel IPs OR for quick testing add `0.0.0.0/0` (NOT recommended permanently).
   - Ensure the user in Database Access has correct username/password and the connection string you pasted matches those credentials.

4) Custom domain
   - Project → Settings → Domains → Add Domain: `www.yourdomain.com` or `yourdomain.com`
   - Follow the DNS instructions Vercel shows (CNAME or A records). After DNS propagation, set `NEXTAUTH_URL` to the custom domain origin.

5) Redeploy and view logs
   - Trigger a redeploy from the Vercel dashboard (Deployments → Redeploy) or push a small commit:

```bash
git commit --allow-empty -m "chore: trigger redeploy" && git push
```

   - Open the new deployment and watch the Build Logs. If the install step fails, confirm the install command above or the lockfile presence.

6) Common errors & fixes
   - "Command 'npm install' exited with 1": force `pnpm` by adding `.npmrc` (done) or set Install Command to `pnpm install`.
   - `querySrv ECONNREFUSED _mongodb._tcp...`: Atlas SRV DNS is not reachable from the build environment — ensure Atlas cluster is running and Network Access allows the build to connect (temporarily allow 0.0.0.0/0 for testing). Also confirm your `MONGODB_URI` uses the correct cluster host.
   - Authentication errors: check username/password and that the DB name in the URI matches (`/wildflower-co`).

7) After deploy: verify
   - Visit the deployment URL and try the main flows (login, dashboard, guests).
   - If build logs mention MongoDB DNS lookup failures, verify the Atlas cluster is reachable from Vercel and the URI is correct.

If you want me to watch the next deploy logs, redeploy and paste the build log output or grant me temporary view access by adding my GitHub/Vercel account — otherwise paste the error text and I'll diagnose it.
