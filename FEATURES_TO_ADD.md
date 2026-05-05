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