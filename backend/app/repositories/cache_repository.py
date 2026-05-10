import json
from pathlib import Path
from typing import Any

from backend.app.schemas.market import MarketSummaryResponse
from backend.app.schemas.news import NewsResponse
from backend.app.schemas.sector import SectorResponse
from backend.app.schemas.stock import StockOverviewResponse


class SampleRepository:
    """Read contract-shaped sample payloads for the mock backend."""

    def __init__(self, sample_dir: Path | None = None) -> None:
        project_root = Path(__file__).resolve().parents[3]
        self.sample_dir = sample_dir or project_root / "data" / "samples"

    def _load_json(self, filename: str) -> dict[str, Any]:
        path = self.sample_dir / filename
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _try_load_json(self, filename: str) -> dict[str, Any] | None:
        path = self.sample_dir / filename
        if not path.exists():
            return None
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def get_market_summary(self) -> MarketSummaryResponse:
        return MarketSummaryResponse.model_validate(self._load_json("market-summary.json"))

    def get_sector(self, sector_id: str) -> SectorResponse:
        payload = self._try_load_json(f"sector-{sector_id}.json")
        if payload is None:
            payload = self._build_dummy_sector(sector_id)
        return SectorResponse.model_validate(payload)

    def get_stock_overview(self, stock_code: str) -> StockOverviewResponse:
        payload = self._try_load_json(f"stock-{stock_code}-overview.json")
        if payload is None:
            payload = self._build_dummy_stock(stock_code)
        return StockOverviewResponse.model_validate(payload)

    def get_news(
        self,
        selection_level: str,
        sector_id: str | None = None,
        stock_code: str | None = None,
    ) -> NewsResponse:
        if selection_level == "stock" and stock_code:
            payload = self._try_load_json(f"news-stock-{stock_code}.json")
        else:
            payload = self._try_load_json("news-stock-000660.json")

        if payload is None:
            payload = self._build_dummy_news(selection_level, sector_id, stock_code)

        response = NewsResponse.model_validate(payload)
        if selection_level == "market":
            response.selection.level = "market"
            response.selection.sector_id = None
            response.selection.stock_code = None
        elif selection_level == "sector":
            response.selection.level = "sector"
            response.selection.sector_id = sector_id
            response.selection.stock_code = None
        return response

    def _market_sector_tile(self, sector_id: str) -> dict[str, Any]:
        market = self._load_json("market-summary.json")
        for tile in market["sector_tiles"]:
            if tile["sector_id"] == sector_id:
                return tile
        return {
            "sector_id": sector_id,
            "sector_name": sector_id.replace("-", " ").replace("_", " ").title(),
            "industry_group": "Unclassified",
            "stock_count": 1,
            "rising_stock_count": 0,
            "rising_stock_ratio": 0.0,
            "average_change_rate": 0.0,
            "total_market_cap": 100000000000,
            "total_trading_value": 1000000000,
            "volume_growth_rate": 0.0,
            "volatility": 1.0,
            "has_disclosure": False,
            "keywords": ["sample"]
        }

    def _build_dummy_sector(self, sector_id: str) -> dict[str, Any]:
        tile = self._market_sector_tile(sector_id)
        stock_code = f"D{abs(hash(sector_id)) % 100000:05d}"[:6]
        stock = {
            "stock_code": stock_code,
            "stock_name": f"{tile['sector_name']} Sample",
            "market": "KOSPI",
            "industry": tile.get("industry_group") or tile["sector_name"],
            "current_price": 50000,
            "previous_close": 50000,
            "change_rate": tile["average_change_rate"],
            "excess_return": 0.0,
            "volume": 100000,
            "average_volume": 100000,
            "volume_growth_rate": tile.get("volume_growth_rate"),
            "trading_value": tile["total_trading_value"],
            "market_cap": tile["total_market_cap"],
            "volatility": tile["volatility"],
            "has_disclosure": tile["has_disclosure"],
            "keywords": tile["keywords"]
        }
        return {
            "selection": {"level": "sector", "market": "KR", "sector_id": sector_id},
            "as_of": "2026-05-10 15:30:00",
            "summary": {
                "sector_id": sector_id,
                "sector_name": tile["sector_name"],
                "industry_group": tile.get("industry_group"),
                "stock_count": tile["stock_count"],
                "rising_stock_count": tile["rising_stock_count"],
                "falling_stock_count": max(0, tile["stock_count"] - tile["rising_stock_count"]),
                "flat_stock_count": 0,
                "rising_stock_ratio": tile["rising_stock_ratio"],
                "average_change_rate": tile["average_change_rate"],
                "market_average_change_rate": 0.74,
                "excess_return": tile["average_change_rate"] - 0.74,
                "total_market_cap": tile["total_market_cap"],
                "total_trading_value": tile["total_trading_value"],
                "volume_growth_rate": tile.get("volume_growth_rate"),
                "volatility": tile["volatility"],
                "risk_level": "watch" if tile["volatility"] >= 1.7 else "normal",
                "keywords": tile["keywords"]
            },
            "stock_tiles": [stock],
            "rankings": {
                "top_gainers": [{
                    "stock_code": stock_code,
                    "stock_name": stock["stock_name"],
                    "rank": 1,
                    "change_rate": stock["change_rate"]
                }],
                "top_decliners": [],
                "trading_value_leaders": [{
                    "stock_code": stock_code,
                    "stock_name": stock["stock_name"],
                    "rank": 1,
                    "trading_value": stock["trading_value"]
                }]
            },
            "risk_flags": [],
            "insight": {
                "headline": f"{tile['sector_name']} has sample sector data for exploration.",
                "rows": [{
                    "label": "Sample coverage",
                    "value": "This sector uses generated placeholder data until a live source is connected.",
                    "basis": "sample_fallback"
                }],
                "keywords": tile["keywords"]
            },
            "related_news_ids": []
        }

    def _build_dummy_stock(self, stock_code: str) -> dict[str, Any]:
        sector = self._load_json("sector-semiconductor.json")
        stock = next(
            (item for item in sector["stock_tiles"] if item["stock_code"] == stock_code),
            None,
        )
        if stock is None:
            stock = {
                "stock_code": stock_code,
                "stock_name": f"Stock {stock_code}",
                "market": "KOSPI",
                "industry": "Sample",
                "current_price": 50000,
                "previous_close": 50000,
                "change_rate": 0.0,
                "excess_return": 0.0,
                "volume": 100000,
                "average_volume": 100000,
                "volume_growth_rate": 0.0,
                "trading_value": 5000000000,
                "market_cap": 100000000000,
                "volatility": 1.0,
                "has_disclosure": False,
                "keywords": ["sample"]
            }
        change = stock["current_price"] - stock["previous_close"]
        return {
            "selection": {
                "level": "stock",
                "market": "KR",
                "sector_id": "semiconductor",
                "stock_code": stock_code
            },
            "as_of": "2026-05-10 15:30:00",
            "identity": {
                "stock_code": stock_code,
                "stock_name": stock["stock_name"],
                "market": stock["market"],
                "sector_id": "semiconductor",
                "sector_name": "Semiconductor",
                "industry": stock["industry"]
            },
            "quote": {
                "current_price": stock["current_price"],
                "previous_close": stock["previous_close"],
                "change": change,
                "change_rate": stock["change_rate"],
                "volume": stock["volume"],
                "average_volume": stock["average_volume"],
                "volume_growth_rate": stock["volume_growth_rate"],
                "trading_value": stock["trading_value"],
                "market_cap": stock["market_cap"],
                "volatility": stock["volatility"],
                "has_disclosure": stock["has_disclosure"]
            },
            "kpis": [
                {
                    "key": "change_rate",
                    "label": "Change rate",
                    "value": stock["change_rate"],
                    "unit": "percent",
                    "status": "positive" if stock["change_rate"] > 0 else "neutral"
                },
                {
                    "key": "trading_value",
                    "label": "Trading value",
                    "value": stock["trading_value"],
                    "unit": "krw",
                    "status": "neutral"
                }
            ],
            "sector_comparison": {
                "sector_average_change_rate": sector["summary"]["average_change_rate"],
                "excess_return": stock["excess_return"],
                "sector_average_volume_growth_rate": sector["summary"]["volume_growth_rate"],
                "volume_growth_gap": 0.0,
                "rank_in_sector_by_change_rate": None,
                "rank_in_sector_by_trading_value": None,
                "sector_stock_count": sector["summary"]["stock_count"]
            },
            "chart": {
                "default_period": "1M",
                "available_periods": ["1D", "1W", "1M", "3M", "1Y"],
                "price_series": [
                    {
                        "date": "2026-05-08",
                        "open": stock["previous_close"],
                        "high": max(stock["previous_close"], stock["current_price"]),
                        "low": min(stock["previous_close"], stock["current_price"]),
                        "close": stock["previous_close"],
                        "volume": stock["average_volume"] or stock["volume"]
                    },
                    {
                        "date": "2026-05-10",
                        "open": stock["previous_close"],
                        "high": max(stock["previous_close"], stock["current_price"]),
                        "low": min(stock["previous_close"], stock["current_price"]),
                        "close": stock["current_price"],
                        "volume": stock["volume"]
                    }
                ],
                "volume_series": [
                    {"date": "2026-05-08", "volume": stock["average_volume"] or stock["volume"]},
                    {"date": "2026-05-10", "volume": stock["volume"]}
                ]
            },
            "risk_flags": [],
            "insight": {
                "headline": f"{stock['stock_name']} has sample Overview data.",
                "rows": [{
                    "label": "Sample coverage",
                    "value": "This stock uses generated placeholder data until a live source is connected.",
                    "basis": "sample_fallback"
                }],
                "keywords": stock["keywords"]
            },
            "related_news_ids": [],
            "related_disclosure_ids": []
        }

    def _build_dummy_news(
        self,
        selection_level: str,
        sector_id: str | None,
        stock_code: str | None,
    ) -> dict[str, Any]:
        return {
            "selection": {
                "level": selection_level,
                "market": "KR",
                "sector_id": sector_id,
                "stock_code": stock_code
            },
            "as_of": "2026-05-10 15:30:00",
            "items": [],
            "empty_state": {
                "message": "No directly related news or disclosures are available for the current selection.",
                "reason": "no_items"
            }
        }
