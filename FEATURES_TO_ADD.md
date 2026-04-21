# Features To Add

## Comments & Ratings

### Database
- [ ] Create `ratings` table: `id`, `task_id`, `user_id`, `rating` (1–5), `created_at`
- [ ] Create `comments` table: `id`, `task_id`, `user_id`, `body`, `created_at`

### Backend
- [ ] `POST /tasks/:taskId/ratings` — save a star rating for a completed task
- [ ] `GET /tasks/:taskId/ratings` — get the rating(s) for a task
- [ ] `POST /tasks/:taskId/comments` — add a comment to a task
- [ ] `GET /tasks/:taskId/comments` — list all comments for a task
- [ ] Add `services/ratings.ts`, `controllers/ratings.ts`, `routes/ratings.ts`
- [ ] Add `services/comments.ts`, `controllers/comments.ts`, `routes/comments.ts`
- [ ] Register new routes in `app.ts`

### Frontend
- [ ] Wire up the rating modal Submit button in `index.tsx` to call `POST /tasks/:taskId/ratings`
- [ ] Build out `tasks/[taskId].tsx` with a comment input and comment list
- [ ] Add API helper functions for ratings and comments calls

---

## Known Bugs / Tech Debt
- [ ] Fix `services/users.ts` — queries use callback style and always return `false`; convert to `async/await` like `services/tasks.ts`
- [ ] Fix task routes in `routes/tasks.ts` — `POST /users:userId/:tasks` is missing a `/` (should be `/users/:userId/tasks`)
- [ ] Wire routes into `app.ts` — user and task routes are currently imported but `app.ts` doesn't import the route files
