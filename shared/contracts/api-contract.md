# API Contract

This document lists the MVP API surface for Market Cloud.

Base path:

```text
/api
```

Common rules:

- All timestamps use `YYYY-MM-DD HH:mm:ss`.
- Percent values are numeric percentage points, for example `2.35`.
- Money values are raw KRW numbers.
- Response text must be informational and must not include buy, sell, hold, or recommendation wording.
- News and disclosure payloads are fetched through `GET /api/news`; other endpoints reference them by ID.

## `GET /api/market/summary`

Returns the market-level dashboard payload.

Detailed contract:

- `shared/contracts/market.md`

Example:

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
    "rising_stock_ratio": 55.0,
    "average_change_rate": 0.74,
    "total_trading_value": 14230000000000,
    "risk_level": "normal"
  },
  "sector_tiles": [],
  "leading_sectors": [],
  "risk_flags": [],
  "insight": {
    "headline": "Market strength is concentrated in leading sectors.",
    "rows": [],
    "keywords": []
  },
  "related_news_ids": []
}
```

## `GET /api/sectors/{sectorId}`

Returns one sector dashboard payload and the stock tiles inside that sector.

Detailed contract:

- `shared/contracts/sector.md`

Example:

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
    "stock_count": 42,
    "rising_stock_ratio": 71.43,
    "average_change_rate": 2.14,
    "excess_return": 1.4,
    "total_trading_value": 1180000000000,
    "risk_level": "watch"
  },
  "stock_tiles": [],
  "rankings": {
    "top_gainers": [],
    "top_decliners": [],
    "trading_value_leaders": []
  },
  "risk_flags": [],
  "insight": {
    "headline": "The sector is outperforming the broader market.",
    "rows": [],
    "keywords": []
  },
  "related_news_ids": []
}
```

## `GET /api/stocks/{stockCode}/overview`

Returns the stock Overview payload.

Detailed contract:

- `shared/contracts/stock.md`

Example:

```json
{
  "selection": {
    "level": "stock",
    "market": "KR",
    "sector_id": "semiconductor",
    "stock_code": "000660"
  },
  "as_of": "2026-05-10 15:30:00",
  "identity": {
    "stock_code": "000660",
    "stock_name": "SK hynix",
    "market": "KOSPI",
    "sector_id": "semiconductor",
    "sector_name": "Semiconductor",
    "industry": "Memory"
  },
  "quote": {
    "current_price": 189400,
    "previous_close": 181900,
    "change_rate": 4.12,
    "volume": 650000,
    "trading_value": 123110000000,
    "volume_growth_rate": 109.68
  },
  "kpis": [],
  "sector_comparison": {
    "excess_return": 1.98
  },
  "chart": {
    "default_period": "1M",
    "available_periods": ["1D", "1W", "1M", "3M", "1Y"],
    "price_series": [],
    "volume_series": []
  },
  "risk_flags": [],
  "insight": {
    "headline": "The stock is outperforming its sector.",
    "rows": [],
    "keywords": []
  },
  "related_news_ids": [],
  "related_disclosure_ids": []
}
```

## `GET /api/news`

Returns news, disclosures, and reports for the current selection.

Detailed contract:

- `shared/contracts/news.md`

Query examples:

```http
GET /api/news?selection_level=market&market=KR
GET /api/news?selection_level=sector&market=KR&sector_id=semiconductor
GET /api/news?selection_level=stock&market=KR&sector_id=semiconductor&stock_code=000660
```

Example:

```json
{
  "selection": {
    "level": "stock",
    "market": "KR",
    "sector_id": "semiconductor",
    "stock_code": "000660"
  },
  "as_of": "2026-05-10 15:30:00",
  "items": [
    {
      "id": "news-20260510-021",
      "item_type": "news",
      "title": "Memory stocks rise on AI server demand expectations",
      "source": "Example News",
      "published_at": "2026-05-10 10:07:00",
      "url": "https://example.com/news/20260510-021",
      "summary": "Semiconductor names moved higher as investors focused on AI server demand.",
      "related_market": "KR",
      "related_sector_ids": ["semiconductor"],
      "related_stock_codes": ["000660"],
      "tags": ["HBM", "AI server"],
      "priority": 1,
      "is_direct_match": true
    }
  ],
  "empty_state": null
}
```

## Error Shape

```json
{
  "error": {
    "code": "not_found",
    "message": "The requested resource was not found.",
    "details": {}
  }
}
```

Recommended error codes:

- `not_found`
- `invalid_selection`
- `missing_required_parameter`
- `source_unavailable`
- `data_not_fresh`
- `internal_error`
