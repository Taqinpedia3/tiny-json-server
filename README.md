# Tiny JSON Server + Postgres

A tiny backend with Postgres running in Docker.

## Run

```bash
copy .env.example .env
docker compose up --build
```

## Try It

```bash
curl http://localhost:3000/health
curl http://localhost:3000/items
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d "{\"name\":\"first row\"}"
curl -X POST http://localhost:3000/items
```

Open these in your browser:

- `http://localhost:3000/health`
- `http://localhost:3000/items`

## Persistence Check

Create a row, restart the stack, then fetch rows again:

```bash
curl -X POST http://localhost:3000/items
docker compose restart
curl http://localhost:3000/items
```

The row stays because Postgres uses the `postgres-data` Docker volume.
