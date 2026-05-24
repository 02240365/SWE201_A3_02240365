# Backend — JSON Server (Mock REST API)

Mock REST backend powered by [JSON Server](https://github.com/typicode/json-server), serving `db.json`.

## Run it (from the project root)

```bash
npm run backend
```

This runs `json-server --watch backend/db.json --port 3001 --host 0.0.0.0`.
`--host 0.0.0.0` makes it reachable from a physical phone on the same Wi-Fi.
API base: `http://localhost:3001`.

## Endpoints

| Method | URL           | Purpose             |
| ------ | ------------- | ------------------- |
| GET    | `/tasks`      | List all tasks      |
| GET    | `/tasks/:id`  | Get one task        |
| POST   | `/tasks`      | Create a task       |
| PATCH  | `/tasks/:id`  | Update a task       |
| DELETE | `/tasks/:id`  | Delete a task       |
| GET    | `/categories` | List all categories |

To reset data, revert `db.json` (e.g. `git checkout backend/db.json`).
