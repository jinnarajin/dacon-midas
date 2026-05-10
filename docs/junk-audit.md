# Junk Code Audit

<!--
Audit date: 2026-05-10

Findings:
1. Root static prototype files were mixed with the new app structure.
   Action: moved app.js, index.html, and styles.css to legacy/static-prototype/.

2. The old prototype contains broken Korean text and temporary mock market data.
   Action: preserved as reference-only instead of deleting.

3. Playwright MCP logs were stored at the project root.
   Action: moved .playwright-mcp output to dev-artifacts/playwright-mcp/.

4. New scaffold files are comment-only placeholders by design.
   Action: kept them because they define ownership boundaries for the next implementation step.

Current source root should now contain only:
- frontend/
- backend/
- shared/
- data/
- skills/
- docs/
- scripts/
- legacy/
- dev-artifacts/
-->
