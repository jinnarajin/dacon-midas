# Sector Contract

This document defines the MVP response for a sector-level dashboard view.

Endpoint:

```http
GET /api/sectors/{sectorId}
```

Used by:

- `MarketMap` in sector drill-down mode
- `InsightPanel`
- `NewsDock`

## Response Shape

```json
{
  "selection": {
    "level": "sector",
    "market": "KR",
    "sector_id": "semiconductor"
  },
  "as_of": "2026-05-10 15:30:00",
  "summary": {
    "sector_id": "semiconductor",
    "sector_name": "Semiconductor",
    "industry_group": "Information Technology",
    "stock_count": 42,
    "rising_stock_count": 30,
    "falling_stock_count": 10,
    "flat_stock_count": 2,
    "rising_stock_ratio": 71.43,
    "average_change_rate": 2.14,
    "market_average_change_rate": 0.74,
    "excess_return": 1.4,
    "total_market_cap": 682000000000000,
    "total_trading_value": 1180000000000,
    "volume_growth_rate": 84.2,
    "volatility": 1.36,
    "risk_level": "watch",
    "keywords": ["HBM", "AI server", "memory"]
  },
  "stock_tiles": [
    {
      "stock_code": "000660",
      "stock_name": "SK hynix",
      "market": "KOSPI",
      "industry": "Memory",
      "current_price": 189400,
      "previous_close": 181900,
      "change_rate": 4.12,
      "excess_return": 1.98,
      "volume": 650000,
      "average_volume": 310000,
      "volume_growth_rate": 109.68,
      "trading_value": 123110000000,
      "market_cap": 137800000000000,
      "volatility": 1.88,
      "has_disclosure": false,
      "keywords": ["HBM", "memory"]
    }
  ],
  "rankings": {
    "top_gainers": [
      {
        "stock_code": "000660",
        "stock_name": "SK hynix",
        "rank": 1,
        "change_rate": 4.12
      }
    ],
    "top_decliners": [
      {
        "stock_code": "042700",
        "stock_name": "Hanmi Semiconductor",
        "rank": 1,
        "change_rate": -1.25
      }
    ],
    "trading_value_leaders": [
      {
        "stock_code": "005930",
        "stock_name": "Samsung Electronics",
        "rank": 1,
        "trading_value": 152656000000
      }
    ]
  },
  "risk_flags": [
    {
      "code": "concentrated_leadership",
      "level": "watch",
      "message": "Sector movement is concentrated in a small number of large stocks."
    }
  ],
  "insight": {
    "headline": "Semiconductor is outperforming the broader market with strong trading activity.",
    "rows": [
      {
        "label": "Sector strength",
        "value": "The sector average is 1.40 percentage points above the market average.",
        "basis": "excess_return"
      },
      {
        "label": "Participation",
        "value": "71.43% of tracked semiconductor stocks are rising.",
        "basis": "rising_stock_ratio"
      }
    ],
    "keywords": ["HBM", "AI server", "trading activity"]
  },
  "related_news_ids": ["news-20260510-011", "news-20260510-012"]
}
```

## Field Rules

### `selection`

- `level` must be `"sector"` for this endpoint.
- `market` identifies the market universe. MVP uses `"KR"`.
- `sector_id` must match the path parameter.

### `as_of`

- Format: `YYYY-MM-DD HH:mm:ss`.
- Represents the freshness timestamp of the sector dataset.

### `summary`

- `sector_id` is the stable identifier used by routes and selection state.
- `sector_name` is user-facing.
- `industry_group` is optional but recommended for grouping.
- `stock_count` counts stocks included in this sector response.
- `rising_stock_ratio`: `rising_stock_count / stock_count * 100`.
- `average_change_rate`: average change rate across valid sector stocks.
- `market_average_change_rate`: market-level comparison value from `GET /api/market/summary`.
- `excess_return`: `average_change_rate - market_average_change_rate`.
- `total_market_cap`: sum of stock-level market cap values.
- `total_trading_value`: sum of stock-level trading value values.
- `volume_growth_rate`: sector-level average or weighted value according to backend rule.
- `volatility`: sector-level volatility indicator.
- `risk_level`: one of `"normal"`, `"watch"`, `"risk"`.
- `keywords` must be short user-facing tags.

### `stock_tiles`

Each item is rendered as one stock tile in the sector map.

- Size metric candidates: `market_cap`, `trading_value`.
- Color metric candidates: `change_rate`, `volatility`.
- `excess_return` compares the stock against its sector average.
- `has_disclosure` marks notable stock-level disclosure availability.
- `keywords` should describe market themes, not internal logic.

### `rankings`

Used by the sector insight panel.

- `top_gainers` is ordered by highest `change_rate`.
- `top_decliners` is ordered by lowest `change_rate`.
- `trading_value_leaders` is ordered by highest `trading_value`.
- Ranking arrays should be limited by the backend to a compact UI-friendly count.

### `risk_flags`

Used to surface cautionary states.

- `code` is a stable backend code.
- `level` is one of `"info"`, `"watch"`, `"risk"`.
- `message` must be informational and must not use investment recommendation wording.

### `insight`

Sector-level narrative generated from rule-based indicators.

- `headline` summarizes sector movement.
- `rows` provide data-backed observations.
- `basis` names the source field or rule input.
- Text must not say buy, sell, hold, or recommend.

### `related_news_ids`

- IDs reference items returned by `GET /api/news`.
- Sector-level response keeps only IDs to avoid duplicating news payloads.

## Required MVP Fields

- `selection.level`
- `selection.sector_id`
- `as_of`
- `summary.sector_id`
- `summary.sector_name`
- `summary.stock_count`
- `summary.rising_stock_ratio`
- `summary.average_change_rate`
- `summary.excess_return`
- `summary.total_trading_value`
- `summary.risk_level`
- `stock_tiles[].stock_code`
- `stock_tiles[].stock_name`
- `stock_tiles[].change_rate`
- `stock_tiles[].trading_value`
- `stock_tiles[].market_cap`
- `stock_tiles[].volatility`
- `rankings.top_gainers`
- `rankings.trading_value_leaders`
- `insight.headline`
- `related_news_ids`

