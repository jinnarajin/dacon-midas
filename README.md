# Market Cloud

Market Cloud is a Korean stock market intelligence dashboard.

The frontend has been migrated to React + TypeScript + Vite. The old static prototype is kept only as a reference under `legacy/static-prototype/`.

## Current App

- Frontend: React, TypeScript, Vite
- Backend: FastAPI
- Data: contract-shaped sample JSON under `data/samples/`
- Flow: market map -> sector map -> stock Overview

## Run Locally

Start the backend:

```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001
```

Start the frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

Open:

```text
http://127.0.0.1:5174
```

## Verify

Backend tests:

```powershell
python -m unittest discover backend/tests
```

Frontend build:

```powershell
cd frontend
npm.cmd run build
```

## Important Paths

- `frontend/`: official React frontend
- `backend/`: FastAPI mock backend and rule logic
- `shared/contracts/`: API contracts
- `data/samples/`: sample payloads used by mock backend
- `legacy/static-prototype/`: old static prototype, reference-only
- `Todo.md`: implementation checklist
