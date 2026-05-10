# Domain Terms

This document defines shared vocabulary for frontend, backend, docs, and data contracts.

## Selection Terms

- `market`: The full Korean stock market universe currently shown by the dashboard.
- `sector`: A group of stocks by business theme or classification. MVP can use a fixed internal sector mapping.
- `industry`: A lower-level business classification under a sector. MVP may set `industry` equal to `sector` when detailed mapping is unavailable.
- `stock`: One listed Korean equity identified by a 6-character stock code.
- `selection`: The current UI context. Allowed levels are `market`, `sector`, and `stock`.

## Entity Terms

- `stock_code`: A 6-character Korean stock code string, for example `005930`.
- `stock_name`: User-facing stock name.
- `market`: Listing market value. Allowed values are `KOSPI`, `KOSDAQ`, `KONEX`, and `OTHER` when used in a stock identity.
- `sector_id`: Stable sector identifier used by API routes and frontend state.
- `sector_name`: User-facing sector name.
- `industry_group`: Optional broad category above sector or industry.

## Indicator Terms

- `current_price`: Latest available stock price.
- `previous_close`: Previous trading day's closing price.
- `change`: `current_price - previous_close`.
- `change_rate`: `(current_price - previous_close) / previous_close * 100`.
- `volume`: Latest available trading volume.
- `average_volume`: Recent average trading volume used for comparison.
- `volume_growth_rate`: `(volume - average_volume) / average_volume * 100`.
- `trading_value`: `current_price * volume` when the source does not provide a value.
- `market_cap`: Stock-level market capitalization.
- `total_market_cap`: Sum of market cap values for a sector or market group.
- `total_trading_value`: Sum of trading value values for a sector or market group.
- `volatility`: Price movement variability indicator. Exact calculation is owned by backend rules.
- `rising_stock_ratio`: Rising stocks divided by total valid stocks, multiplied by 100.
- `average_change_rate`: Average change rate for a market or sector group.
- `excess_return`: A stock or sector's change rate minus its comparison group's average change rate.

## Insight Terms

- `insight`: Rule-based, data-backed explanatory text. It is not investment advice.
- `headline`: One concise summary sentence for the current selection.
- `insight.rows`: Supporting observations with labels, values, and data basis.
- `basis`: The field or rule input used to generate an insight row.
- `risk_flag`: A caution or informational state derived from data.
- `risk_level`: Summary state. Allowed values are `normal`, `watch`, and `risk`.

## News And Disclosure Terms

- `news`: Market, sector, or stock-related news item.
- `disclosure`: Company disclosure from KIND, DART, or another official source.
- `report`: Research or market commentary item.
- `item_type`: One of `news`, `disclosure`, or `report`.
- `related_news_ids`: IDs that point to items from `GET /api/news`.
- `related_disclosure_ids`: Disclosure IDs that point to items from `GET /api/news`.
- `is_direct_match`: True when a news item directly matches the current selection.

## Data Quality Terms

- `as_of`: Data freshness timestamp.
- `source`: Original data provider or publisher name.
- `empty_state`: Structured response used when no displayable data exists.
- `mock`: Development-only sample data. This word must not appear in production UI.
- `fallback`: A safe substitute response used when a source is unavailable.

## Wording Policy

- User-facing insight text must not use buy, sell, hold, recommend, target price, or guaranteed outcome wording.
- User-facing text must not expose internal implementation terms such as mock, prompt, rule engine, or harness.
- API field names remain English snake_case.
