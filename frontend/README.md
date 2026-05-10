# Market Cloud Frontend

This is the official React frontend for Market Cloud.

## Stack

- React
- TypeScript
- Vite
- CSS modules by feature are not used yet; global app styles live in `src/styles/app.css`.

## Development

The frontend expects the FastAPI backend on port `8001`.

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

Vite proxies `/api` to:

```text
http://127.0.0.1:8001
```

## Build

```powershell
npm.cmd run build
```

## Source Layout

- `src/app/`: app shell and top-level state wiring
- `src/entities/`: TypeScript API models
- `src/features/market-map/`: market and sector map
- `src/features/insights/`: insight panel
- `src/features/news-feed/`: news and disclosure dock
- `src/features/stock-overview/`: stock Overview, KPI, chart
- `src/services/`: API client
- `src/shared/`: formatting and selection state helpers
- `src/styles/`: global app styles

## Migration Note

Do not import from `legacy/static-prototype/`.
That prototype is preserved only for visual and interaction reference.
