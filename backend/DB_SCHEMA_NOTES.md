# tasks table

| column      | type          | notes                                      |
|-------------|---------------|--------------------------------------------|
| id          | integer       | auto-generated (nextval) — never pass on insert |
| user_id     | varchar(255)  | Firebase UID — must exist in users(firebase_uid) or FK fails |
| title       | varchar(250)  | required                                   |
| description | text          | optional                                   |
| status      | task_status   | enum — default 'in_progress'               |
| created_at  | timestamp     | default CURRENT_TIMESTAMP — omit on insert |
| updated_at  | timestamp     | default CURRENT_TIMESTAMP — omit on insert |
| rating      | integer       | nullable — 1–5, set when task is completed |
| question    | varchar(255)  | nullable — the question shown to the user at time of rating (stored because question text may change) |
| review_response | varchar(255) | nullable — optional free-text response from the user |

## Migrations needed
```sql
ALTER TABLE tasks ADD COLUMN rating INTEGER CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE tasks ADD COLUMN question VARCHAR(255);
ALTER TABLE tasks ADD COLUMN review_response VARCHAR(255);
```

## task_status enum values
Run `\dT task_status` in psql to confirm exact values.

## Foreign key
tasks.user_id → users.firebase_uid (ON DELETE CASCADE)
The Firebase UID must be inserted into users before creating a task for that user.

---

# Future: pgvector

Add an `embedding` column to `tasks` for semantic search/recommendations:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE tasks ADD COLUMN embedding vector(1536);
```

- Embed task title+description at insert time (and on update)
- Query with cosine distance: `embedding <-> $1`
- Rating score can be stored as metadata alongside vectors

## Encryption note
If task titles are encrypted at the application layer (e.g. pgcrypto), embeddings must be
generated **before** encryption — you cannot embed ciphertext. Store embeddings separately
from encrypted fields if both are needed.
