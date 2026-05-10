# Market Cloud Project Structure

<!--
Purpose:
- Keep the old static prototype separate from the new product structure.
- Build the next version around clear frontend, backend, shared contract, data, docs, and scripts boundaries.
- Keep implementation details out of the UI until each layer has a stable contract.
-->

```text
midas/
  frontend/                     # React + TypeScript client
    src/
      app/                      # App entry, routing, global providers
      features/                 # Screen features: market map, insights, news feed, stock overview
      entities/                 # Domain-facing UI models: market, sector, stock, news
      services/                 # API clients and adapters
      shared/                   # Shared UI, state, formatting, utilities
      assets/                   # Static frontend assets
      styles/                   # Global styles and theme tokens
    tests/                      # Frontend tests

  backend/                      # FastAPI server
    app/
      api/                      # HTTP route modules
      core/                     # Config, errors, logging, app settings
      domains/                  # Business logic by domain
      repositories/             # External API, DB, cache access
      schemas/                  # Request/response DTOs
      workers/                  # Data sync and scheduled jobs
    tests/                      # Backend tests

  shared/                       # Shared contracts and domain language
    contracts/                  # API contract drafts and schema notes

  data/                         # Local data workspace
    master/                     # Stock/sector master data
    samples/                    # Sample API payloads
    cache/                      # Local cache output
    raw/                        # Raw imported files
    processed/                  # Normalized local data

  skills/                       # Analysis rule documents
  docs/                         # Architecture, screen flow, data flow, audits
  scripts/                      # Developer and data validation scripts

  legacy/
    static-prototype/           # Preserved old index.html/styles.css/app.js prototype, reference-only

  dev-artifacts/
    playwright-mcp/             # Tool logs and captured development artifacts
```

## Layer Rules

<!--
- frontend must not calculate core financial indicators directly.
- backend domains own indicator calculation and insight generation.
- shared/contracts owns the response shape before frontend/backend implementation.
- repositories only fetch or store data; they do not create user-facing insights.
- skills documents are the source of analysis rules, not UI copy.
- legacy/static-prototype is reference-only and must not be imported by the React app.
-->

## Recommended Build Order

<!--
1. Finalize shared/contracts for market, sector, stock, and news responses.
2. Implement backend schemas and mock-backed routes.
3. Connect frontend services to the backend contract.
4. Build market > sector > stock navigation.
5. Attach skills-based indicator and insight rules.
6. Replace mock data sources with KIS, KRX, KIND/DART, and news adapters.
-->
