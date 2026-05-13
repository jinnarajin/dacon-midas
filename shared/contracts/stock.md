# Stock Contract

This document defines the MVP response for a stock Overview view.

Endpoint:

```http
GET /api/stocks/{stockCode}/overview
```

Used by:

- `StockOverview`
- `StockKpiGrid`
- `StockChart`
- stock-scoped `NewsDock`

## Response Shape

```json
{
  "selection": {
    "level": "stock",
    "market": "KR",
    "sector_id": "information-technology",
    "stock_code": "000660"
  },
  "as_of": "2026-05-10 15:30:00",
  "identity": {
    "stock_code": "000660",
    "stock_name": "SK hynix",
    "market": "KOSPI",
    "sector_id": "information-technology",
    "sector_name": "information-technology",
    "industry": "Memory"
  },
  "quote": {
    "current_price": 189400,
    "previous_close": 181900,
    "change": 7500,
    "change_rate": 4.12,
    "volume": 650000,
    "average_volume": 310000,
    "volume_growth_rate": 109.68,
    "trading_value": 123110000000,
    "market_cap": 137800000000000,
    "volatility": 1.88,
    "has_disclosure": false
  },
  "kpis": [
    {
      "key": "change_rate",
      "label": "Change rate",
      "value": 4.12,
      "unit": "percent",
      "status": "positive"
    },
    {
      "key": "trading_value",
      "label": "Trading value",
      "value": 123110000000,
      "unit": "krw",
      "status": "neutral"
    }
  ],
  "sector_comparison": {
    "sector_average_change_rate": 2.14,
    "excess_return": 1.98,
    "sector_average_volume_growth_rate": 84.2,
    "volume_growth_gap": 25.48,
    "rank_in_sector_by_change_rate": 2,
    "rank_in_sector_by_trading_value": 1,
    "sector_stock_count": 42
  },
  "chart": {
    "default_period": "1M",
    "available_periods": ["1D", "1W", "1M", "3M", "1Y"],
    "price_series": [
      {
        "date": "2026-05-10",
        "open": 183000,
        "high": 190000,
        "low": 181500,
        "close": 189400,
        "volume": 650000
      }
    ],
    "volume_series": [
      {
        "date": "2026-05-10",
        "volume": 650000
      }
    ]
  },
  "risk_flags": [
    {
      "code": "high_volume_growth",
      "level": "info",
      "message": "Trading volume is above the recent average."
    }
  ],
  "insight": {
    "headline": "SK hynix is outperforming its sector with elevated trading activity.",
    "rows": [
      {
        "label": "Sector comparison",
        "value": "The stock is 1.98 percentage points above the sector average.",
        "basis": "excess_return"
      },
      {
        "label": "Trading activity",
        "value": "Volume is 109.68% above the recent average.",
        "basis": "volume_growth_rate"
      }
    ],
    "keywords": ["HBM", "memory", "trading activity"]
  },
  "related_news_ids": ["news-20260510-021"],
  "related_disclosure_ids": []
}
```

## Field Rules

### `selection`

- `level` must be `"stock"` for this endpoint.
- `stock_code` must match the path parameter.
- `sector_id` connects the stock Overview back to the sector drill-down state.

### `as_of`

- Format: `YYYY-MM-DD HH:mm:ss`.
- Represents the freshness timestamp of quote and chart data.

### `identity`

- `stock_code` must be a 6-character Korean stock code string.
- `stock_name` is user-facing.
- `market` is one of `"KOSPI"`, `"KOSDAQ"`, `"KONEX"`, `"OTHER"`.
- `sector_id` must match the sector contract identifier.

### `quote`

- `current_price`, `previous_close`, `volume`, `trading_value`, and `market_cap` are raw numeric values.
- `change`: `current_price - previous_close`.
- `change_rate`: `(current_price - previous_close) / previous_close * 100`.
- `volume_growth_rate`: `(volume - average_volume) / average_volume * 100`.
- `trading_value`: `current_price * volume` when the source does not provide it.
- `has_disclosure` indicates notable stock-level disclosure presence.

### `kpis`

KPI entries are display-ready but still keep raw numeric values.

- `key` is stable for frontend rendering.
- `label` is user-facing.
- `unit` can be `"krw"`, `"number"`, `"percent"`, `"rank"`, or `"text"`.
- `status` can be `"positive"`, `"negative"`, `"neutral"`, `"watch"`, or `"risk"`.

### `sector_comparison`

Used to explain how the stock behaves relative to its sector.

- `excess_return`: `quote.change_rate - sector_average_change_rate`.
- `volume_growth_gap`: `quote.volume_growth_rate - sector_average_volume_growth_rate`.
- Ranking values are 1-based.

### `chart`

- `default_period` is `"1M"` for MVP.
- `available_periods` must include `["1D", "1W", "1M", "3M", "1Y"]`.
- `price_series` is OHLCV data sorted ascending by date.
- `volume_series` can duplicate volume from `price_series` when needed by chart components.

### `risk_flags`

- `code` is a stable backend code.
- `level` is one of `"info"`, `"watch"`, `"risk"`.
- `message` must not say buy, sell, hold, or recommend.

### `insight`

Stock-level narrative generated from rule-based indicators.

- `headline` gives one concise stock summary.
- `rows` provide data-backed observations.
- `basis` names the source field or rule input.
- Text must remain informational and must not be investment advice.

### `related_news_ids` and `related_disclosure_ids`

- IDs reference items returned by `GET /api/news`.
- Stock Overview keeps IDs only to avoid duplicating news and disclosure payloads.

## Required MVP Fields

- `selection.level`
- `selection.stock_code`
- `as_of`
- `identity.stock_code`
- `identity.stock_name`
- `identity.market`
- `identity.sector_id`
- `quote.current_price`
- `quote.previous_close`
- `quote.change_rate`
- `quote.volume`
- `quote.trading_value`
- `quote.volume_growth_rate`
- `sector_comparison.excess_return`
- `chart.default_period`
- `chart.available_periods`
- `chart.price_series`
- `insight.headline`
- `related_news_ids`
- `related_disclosure_ids`

