# Data Rules Implementation Notes

This note maps `skills/data_rules.md` into the current backend implementation.

## MVP Required Data

The mock backend currently validates the following contract-shaped sample payloads:

- `data/samples/market-summary.json`
- `data/samples/sector-semiconductor.json`
- `data/samples/stock-000660-overview.json`
- `data/samples/news-stock-000660.json`

Required field groups:

- stock identity: `stock_code`, `stock_name`, `market`, `sector_id`
- quote values: `current_price`, `previous_close`, `change_rate`, `volume`, `trading_value`
- sector values: `average_change_rate`, `rising_stock_ratio`, `total_trading_value`
- news values: `id`, `item_type`, `title`, `source`, `published_at`, relation fields

## Missing Data Rules

- `previous_close == 0` returns `None` for `change_rate`.
- `average_volume == 0` returns `None` for `volume_growth_rate`.
- Indicator averages ignore `None` values.
- News responses can return `empty_state` when no item exists.

## Current Backend Mapping

- `backend/app/repositories/cache_repository.py` loads sample payloads.
- `backend/app/schemas/*.py` validates contract shape.
- `backend/app/domains/rules/indicator_rules.py` owns indicator calculations.
- `backend/app/domains/rules/insight_rules.py` blocks investment recommendation wording.

