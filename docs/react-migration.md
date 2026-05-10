# React Migration

The frontend is now migrated from the old static prototype to a React + TypeScript + Vite app.

## Source Of Truth

- Official frontend: `frontend/`
- Reference-only prototype: `legacy/static-prototype/`

## What Was Migrated

- Market dashboard shell
- Market map and sector drill-down
- Stock tile click into stock Overview
- Insight panel by current selection level
- News/disclosure dock by current selection level
- KPI cards and simple price/volume chart
- Empty states for missing map, news, stock, and chart data

## Runtime Contract

The React app calls FastAPI through Vite proxy:

```text
frontend :5174 -> /api -> backend :8001
```

Backend endpoints used:

- `GET /api/market/summary`
- `GET /api/sectors/{sector_id}`
- `GET /api/stocks/{stock_code}/overview`
- `GET /api/news`

## Migration Rules

- Keep API field names aligned with `shared/contracts/`.
- Keep indicator calculations in `backend/app/domains/rules/`.
- Keep React components focused on rendering and interaction state.
- Keep old static files in `legacy/static-prototype/` out of imports.
- User-facing UI must not expose internal words such as mock, test, prompt, or rule engine.

## Verification

```powershell
python -m unittest discover backend/tests
cd frontend
npm.cmd run build
```
