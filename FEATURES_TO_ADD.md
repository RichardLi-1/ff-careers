# Features To Add

## Quick Wins / Tech Debt
- [ ] Fix `services/users.ts` — queries use callback style and always return `false`; convert to `async/await` like `services/tasks.ts`
- [ ] Fix task routes in `routes/tasks.ts` — `POST /users:userId/:tasks` is missing a `/` (should be `/users/:userId/tasks`)
- [ ] Wire the frontend rating modal Submit button to call `POST /tasks/:taskId/rating`

## Auth
- [ ] Build out login screen (`login.tsx` exists but untracked)
- [ ] Auth flow — redirect unauthenticated users to login

## Career Matching
- [ ] `GET /users/me/career-matches` endpoint — query Pinecone with averaged user task embeddings against careers namespace
- [ ] Embed task title + description + review_response into Pinecone on rating submission
- [ ] Build careers namespace in Pinecone with embedded career descriptions
- [ ] Frontend career match screen

## Embedding Infrastructure (blocked)
- [ ] Oracle Cloud free VM setup for self-hosted Ollama (see memory for plan)
- [ ] Fallback: upgrade EC2 to t3.small ($15/mo) and run Ollama there

---

## Known Bugs
- [ ] Fix `services/users.ts` callback style (same as above)


"Find users who responded similarly to this type of task" (candidate matching)
"Given a job description, find users whose task feelings align with it"


This could become almost a research tool



Unit tests

Railway next steps (checklist)
Create a Railway project and connect this GitHub repo (or deploy from CLI).

Set the service root to backend/ (monorepo) so Railway runs npm install / npm run build / npm start from that folder.

Add Postgres in Railway (or attach your existing DB). Copy the DATABASE_URL (or reference it) into the backend service environment variables.

Point the app at that DB — whatever your code expects (DATABASE_URL vs POSTGRES_*). Managed Postgres usually needs TLS; many setups use SSL options or a URL with sslmode=require.

Set PORT — Railway injects PORT; the server should listen(process.env.PORT || 3000) (or equivalent) instead of a hardcoded port.

Set secrets your API already needs: Firebase admin creds, HF_API_TOKEN, Pinecone keys, etc. — same names as local .env.

CORS — set CORS_ORIGIN to your real web origin(s) (e.g. your Expo web / marketing URL), not only localhost.

Run migrations / schema — if you don’t have automatic migrations, run SQL against the Railway DB once so tables match what users / tasks expect.

Smoke test — open the Railway public URL + /health (or /) and confirm DB connectivity.

Point the client — update the app’s API base URL to the Railway hostname (or your custom domain).

If you want, we can stick to questions-only from here (e.g. “does Railway need a Dockerfile or is Nixpacks enough?”) without touching the codebase.

