# Market Contract

This document defines the MVP response for the market-level dashboard.

Endpoint:

```http
GET /api/market/summary
```

Used by:

- `MarketMap`
- `InsightPanel`
- `NewsDock`

## Response Shape

```json
{
  "selection": {
    "level": "market",
    "market": "KR"
  },
  "as_of": "2026-05-10 15:30:00",
  "summary": {
    "market_name": "Korea Stock Market",
    "total_stock_count": 2400,
    "rising_stock_count": 1320,
    "falling_stock_count": 910,
    "flat_stock_count": 170,
    "rising_stock_ratio": 55.0,
    "average_change_rate": 0.74,
    "total_trading_value": 14230000000000,
    "dominant_sector_id": "semiconductor",
    "risk_level": "normal"
  },
  "sector_tiles": [
    {
      "sector_id": "semiconductor",
      "sector_name": "Semiconductor",
      "industry_group": "Information Technology",
      "stock_count": 42,
      "rising_stock_count": 30,
      "rising_stock_ratio": 71.43,
      "average_change_rate": 2.14,
      "total_market_cap": 682000000000000,
      "total_trading_value": 1180000000000,
      "volume_growth_rate": 84.2,
      "volatility": 1.36,
      "has_disclosure": true,
      "keywords": ["HBM", "AI server"]
    }
  ],
  "leading_sectors": [
    {
      "sector_id": "semiconductor",
      "sector_name": "Semiconductor",
      "rank": 1,
      "basis": "trading_value",
      "value": 1180000000000
    }
  ],
  "risk_flags": [
    {
      "code": "high_volatility",
      "level": "watch",
      "message": "Some high-volume sectors show elevated volatility."
    }
  ],
  "insight": {
    "headline": "Market strength is concentrated in leading technology sectors.",
    "rows": [
      {
        "label": "Breadth",
        "value": "55.0% of tracked stocks are rising.",
        "basis": "rising_stock_ratio"
      },
      {
        "label": "Leadership",
        "value": "Semiconductor leads by trading value.",
        "basis": "dominant_sector_id"
      }
    ],
    "keywords": ["technology", "trading value", "breadth"]
  },
  "related_news_ids": ["news-20260510-001", "news-20260510-002"]
}
```

## Field Rules

### `selection`

- `level` must be `"market"` for this endpoint.
- `market` identifies the market universe. MVP uses `"KR"`.

### `as_of`

- Format: `YYYY-MM-DD HH:mm:ss`.
- Represents the data freshness timestamp, not the response generation time.

### `summary`

- `total_stock_count`: number of stocks included in the market universe.
- `rising_stock_count`: stocks with `change_rate > 0`.
- `falling_stock_count`: stocks with `change_rate < 0`.
- `flat_stock_count`: stocks with `change_rate == 0` or no meaningful price change.
- `rising_stock_ratio`: `rising_stock_count / total_stock_count * 100`.
- `average_change_rate`: average change rate across valid stocks.
- `total_trading_value`: sum of stock-level trading value.
- `dominant_sector_id`: sector with the strongest market leadership by selected backend rule.
- `risk_level`: one of `"normal"`, `"watch"`, `"risk"`.

### `sector_tiles`

Each item is rendered as one tile in the market map.

- Size metric candidates: `total_market_cap`, `total_trading_value`.
- Color metric candidates: `average_change_rate`, `volatility`.
- `has_disclosure` is true when any notable disclosure exists for stocks in the sector.
- `keywords` should be short market-facing tags, not internal rule names.

### `leading_sectors`

Used for ranked market summary UI.

- `basis` can be `"trading_value"`, `"average_change_rate"`, `"volume_growth_rate"`, or `"market_cap"`.
- `value` must use the raw numeric value for the selected basis.

### `risk_flags`

Used to display caution states without investment recommendation wording.

- `code` is a stable backend code.
- `level` is one of `"info"`, `"watch"`, `"risk"`.
- `message` must be user-facing and must not say buy, sell, hold, or recommend.

### `insight`

Market-level narrative generated from rule-based indicators.

- `headline` gives one concise market summary.
- `rows` provide data-backed observations.
- `basis` names the data field or rule input used to create the row.
- Text must remain informational and must not be investment advice.

### `related_news_ids`

- IDs reference items returned by `GET /api/news`.
- Market-level response keeps only IDs to avoid duplicating news payloads.

## Required MVP Fields

- `selection.level`
- `as_of`
- `summary.total_stock_count`
- `summary.rising_stock_ratio`
- `summary.average_change_rate`
- `summary.total_trading_value`
- `summary.risk_level`
- `sector_tiles[].sector_id`
- `sector_tiles[].sector_name`
- `sector_tiles[].average_change_rate`
- `sector_tiles[].total_trading_value`
- `sector_tiles[].total_market_cap`
- `sector_tiles[].volatility`
- `insight.headline`
- `related_news_ids`

