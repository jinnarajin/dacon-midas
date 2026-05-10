# Source Text Inventory

<!--
Purpose:
Track the source documents that define Market Cloud before rewriting or restoring broken Korean text.
This is the reference point for Todo section 0 before editing the skills documents.
-->

## Confirmed Source Candidates

- `기획서 PDF 34eebdc8582d80d88be1f5e154705568.md`
  - Role: original planning export for Market Cloud.
  - Status: kept at project root as the highest-level product planning source.
  - Issue: Korean text appears mojibaked in terminal output and should be reviewed in the IDE or replaced with a clean export.

- `skills/data_rules.md`
  - Role: data source, required field, missing value, cache, and usage rule source.
  - Status: active rule source.
  - Issue: Korean text appears mojibaked in terminal output and needs cleanup before implementation.

- `skills/indicator_rules.md`
  - Role: indicator calculation source.
  - Status: active rule source.
  - Issue: needs clean Korean review before translating rules into backend code.

- `skills/visualization_rules.md`
  - Role: market map, color, size, and UI visualization rule source.
  - Status: active rule source.
  - Issue: needs clean Korean review before frontend implementation.

- `skills/insight_rules.md`
  - Role: insight generation and wording policy source.
  - Status: active rule source.
  - Issue: needs clean Korean review before rules engine implementation.

- `skills/news_rules.md`
  - Role: news and disclosure filtering source.
  - Status: active rule source.
  - Issue: needs clean Korean review before news API design.

- `skills/stock_overview_rules.md`
  - Role: stock Overview screen and stock-level insight source.
  - Status: active rule source.
  - Issue: needs clean Korean review before stock contract finalization.

- `legacy/static-prototype/`
  - Role: visual and interaction reference only.
  - Status: preserved, not part of new app source.
  - Issue: contains mock data and broken Korean text, so it should not be copied directly.

## Decision

Use the root planning export and `skills/*.md` as the source text set.
Do not rewrite rules from memory while the text is mojibaked.
The next Todo item should restore or rewrite the `skills/*.md` documents into clean Korean before implementing rules.

