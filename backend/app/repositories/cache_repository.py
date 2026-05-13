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
            "industry_group": "미분류",
            "stock_count": 20,
            "rising_stock_count": 10,
            "rising_stock_ratio": 50.0,
            "average_change_rate": 0.0,
            "total_market_cap": 100000000000,
            "total_trading_value": 1000000000,
            "volume_growth_rate": 0.0,
            "volatility": 1.0,
            "has_disclosure": False,
            "keywords": ["샘플"],
        }

    def _build_dummy_sector(self, sector_id: str) -> dict[str, Any]:
        tile = self._market_sector_tile(sector_id)
        stock_tiles = self._dummy_stock_tiles(tile)
        top_gainers = sorted(stock_tiles, key=lambda item: item["change_rate"], reverse=True)[:3]
        top_decliners = sorted(stock_tiles, key=lambda item: item["change_rate"])[:3]
        trading_value_leaders = sorted(
            stock_tiles,
            key=lambda item: item["trading_value"],
            reverse=True,
        )[:3]
        stock_count = len(stock_tiles)
        rising_count = sum(1 for stock in stock_tiles if stock["change_rate"] > 0)
        falling_count = sum(1 for stock in stock_tiles if stock["change_rate"] < 0)
        flat_count = stock_count - rising_count - falling_count

        return {
            "selection": {"level": "sector", "market": "KR", "sector_id": sector_id},
            "as_of": "2026-05-10 15:30:00",
            "summary": {
                "sector_id": sector_id,
                "sector_name": tile["sector_name"],
                "industry_group": tile.get("industry_group"),
                "stock_count": stock_count,
                "rising_stock_count": rising_count,
                "falling_stock_count": falling_count,
                "flat_stock_count": flat_count,
                "rising_stock_ratio": round(rising_count / stock_count * 100, 2),
                "average_change_rate": tile["average_change_rate"],
                "market_average_change_rate": 0.82,
                "excess_return": round(tile["average_change_rate"] - 0.82, 2),
                "total_market_cap": tile["total_market_cap"],
                "total_trading_value": tile["total_trading_value"],
                "volume_growth_rate": tile.get("volume_growth_rate"),
                "volatility": tile["volatility"],
                "risk_level": "watch" if tile["volatility"] >= 1.7 else "normal",
                "keywords": tile["keywords"],
            },
            "stock_tiles": stock_tiles,
            "rankings": {
                "top_gainers": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "change_rate": stock["change_rate"],
                    }
                    for index, stock in enumerate(top_gainers)
                ],
                "top_decliners": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "change_rate": stock["change_rate"],
                    }
                    for index, stock in enumerate(top_decliners)
                ],
                "trading_value_leaders": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "trading_value": stock["trading_value"],
                    }
                    for index, stock in enumerate(trading_value_leaders)
                ],
            },
            "risk_flags": [],
            "insight": {
                "headline": f"{tile['sector_name']} 섹터의 샘플 종목 20개 흐름을 표시합니다.",
                "rows": [
                    {
                        "label": "샘플 범위",
                        "value": "실시간 데이터 연결 전까지 GICS 섹터 단위로 생성한 한국어 더미 종목을 사용합니다.",
                        "basis": "sample_fallback",
                    }
                ],
                "keywords": tile["keywords"],
            },
            "related_news_ids": [],
        }

    def _dummy_stock_tiles(self, tile: dict[str, Any]) -> list[dict[str, Any]]:
        names = [
            "대장",
            "테크",
            "솔루션",
            "시스템",
            "정밀",
            "홀딩스",
            "인프라",
            "플랫폼",
            "소재",
            "장비",
            "서비스",
            "네트웍스",
            "코어",
            "이노베이션",
            "랩스",
            "파트너스",
            "엔지니어링",
            "글로벌",
            "모빌리티",
            "에너지",
        ]
        base_code = sum(ord(char) for char in tile["sector_id"]) % 900000
        average_change = float(tile["average_change_rate"])
        total_value = int(tile["total_trading_value"])
        total_cap = int(tile["total_market_cap"])
        stocks = []

        for index, suffix in enumerate(names):
            current_price = 18000 + index * 7400
            change_rate = round(average_change + (index - 9) * 0.28, 2)
            previous_close = int(current_price / (1 + change_rate / 100)) if change_rate != -100 else current_price
            volume = 80000 + index * 27000
            average_volume = 70000 + index * 21000
            stocks.append(
                {
                    "stock_code": f"{(base_code + index) % 1000000:06d}",
                    "stock_name": f"{tile['sector_name']}{suffix}",
                    "market": "KOSPI" if index % 2 == 0 else "KOSDAQ",
                    "industry": tile.get("industry_group") or tile["sector_name"],
                    "current_price": current_price,
                    "previous_close": previous_close,
                    "change_rate": change_rate,
                    "excess_return": round(change_rate - average_change, 2),
                    "volume": volume,
                    "average_volume": average_volume,
                    "volume_growth_rate": round((volume - average_volume) / average_volume * 100, 2),
                    "trading_value": max(1, total_value // (index + 3)),
                    "market_cap": max(1, total_cap // (index + 2)),
                    "volatility": round(float(tile["volatility"]) + index * 0.04, 2),
                    "has_disclosure": bool(tile["has_disclosure"] and index == 0),
                    "keywords": tile["keywords"],
                }
            )
        return stocks

    def _dummy_period_series(self, stock: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
        current = int(stock["current_price"])
        volume = int(stock["volume"])

        def price_point(date: str, close: int, volume_value: int) -> dict[str, Any]:
            open_price = int(close * 0.992)
            high = int(close * 1.018)
            low = int(close * 0.982)
            return {
                "date": date,
                "open": open_price,
                "high": max(open_price, high, close),
                "low": min(open_price, low, close),
                "close": close,
                "volume": volume_value,
            }

        return {
            "1D": [
                price_point("2026-05-10 09:05", int(current * 0.982), int(volume * 0.08)),
                price_point("2026-05-10 10:00", int(current * 0.988), int(volume * 0.11)),
                price_point("2026-05-10 11:00", int(current * 0.994), int(volume * 0.12)),
                price_point("2026-05-10 12:00", int(current * 0.99), int(volume * 0.10)),
                price_point("2026-05-10 13:00", int(current * 1.006), int(volume * 0.15)),
                price_point("2026-05-10 14:00", int(current * 1.012), int(volume * 0.18)),
                price_point("2026-05-10 15:00", int(current * 1.004), int(volume * 0.14)),
                price_point("2026-05-10 15:30", current, int(volume * 0.12)),
            ],
            "1W": [
                price_point("2026-05-04", int(current * 0.93), int(volume * 0.56)),
                price_point("2026-05-05", int(current * 0.95), int(volume * 0.60)),
                price_point("2026-05-06", int(current * 0.965), int(volume * 0.62)),
                price_point("2026-05-07", int(current * 0.98), int(volume * 0.65)),
                price_point("2026-05-10", current, volume),
            ],
            "1M": [
                price_point("2026-04-10", int(current * 0.86), int(volume * 0.51)),
                price_point("2026-04-14", int(current * 0.88), int(volume * 0.49)),
                price_point("2026-04-17", int(current * 0.89), int(volume * 0.58)),
                price_point("2026-04-21", int(current * 0.91), int(volume * 0.62)),
                price_point("2026-04-24", int(current * 0.94), int(volume * 0.69)),
                price_point("2026-04-28", int(current * 0.93), int(volume * 0.55)),
                price_point("2026-05-03", int(current * 0.96), int(volume * 0.65)),
                price_point("2026-05-07", int(current * 0.97), int(volume * 0.65)),
                price_point("2026-05-10", current, volume),
            ],
            "3M": [
                price_point("2026-02-10", int(current * 0.76), int(volume * 0.46)),
                price_point("2026-02-24", int(current * 0.78), int(volume * 0.49)),
                price_point("2026-03-10", int(current * 0.81), int(volume * 0.57)),
                price_point("2026-03-24", int(current * 0.84), int(volume * 0.59)),
                price_point("2026-04-07", int(current * 0.87), int(volume * 0.65)),
                price_point("2026-04-21", int(current * 0.91), int(volume * 0.62)),
                price_point("2026-05-03", int(current * 0.96), int(volume * 0.65)),
                price_point("2026-05-10", current, volume),
            ],
            "1Y": [
                price_point("2025-05-10", int(current * 0.62), int(volume * 0.38)),
                price_point("2025-06-10", int(current * 0.66), int(volume * 0.42)),
                price_point("2025-07-10", int(current * 0.69), int(volume * 0.47)),
                price_point("2025-08-10", int(current * 0.67), int(volume * 0.49)),
                price_point("2025-09-10", int(current * 0.71), int(volume * 0.53)),
                price_point("2025-10-10", int(current * 0.74), int(volume * 0.57)),
                price_point("2025-11-10", int(current * 0.78), int(volume * 0.61)),
                price_point("2025-12-10", int(current * 0.81), int(volume * 0.58)),
                price_point("2026-01-10", int(current * 0.79), int(volume * 0.55)),
                price_point("2026-02-10", int(current * 0.76), int(volume * 0.46)),
                price_point("2026-03-10", int(current * 0.81), int(volume * 0.57)),
                price_point("2026-04-10", int(current * 0.86), int(volume * 0.51)),
                price_point("2026-05-10", current, volume),
            ],
        }

    def _build_dummy_stock(self, stock_code: str) -> dict[str, Any]:
        sector = self._load_json("sector-information-technology.json")
        stock = next(
            (item for item in sector["stock_tiles"] if item["stock_code"] == stock_code),
            None,
        )
        if stock is None:
            stock = {
                "stock_code": stock_code,
                "stock_name": f"샘플종목 {stock_code}",
                "market": "KOSPI",
                "industry": "샘플",
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
                "keywords": ["샘플"],
            }
        change = stock["current_price"] - stock["previous_close"]
        period_series = self._dummy_period_series(stock)
        return {
            "selection": {
                "level": "stock",
                "market": "KR",
                "sector_id": "information-technology",
                "stock_code": stock_code,
            },
            "as_of": "2026-05-10 15:30:00",
            "identity": {
                "stock_code": stock_code,
                "stock_name": stock["stock_name"],
                "market": stock["market"],
                "sector_id": "information-technology",
                "sector_name": "정보기술",
                "industry": stock["industry"],
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
                "has_disclosure": stock["has_disclosure"],
            },
            "kpis": [
                {
                    "key": "change_rate",
                    "label": "등락률",
                    "value": stock["change_rate"],
                    "unit": "percent",
                    "status": "positive" if stock["change_rate"] > 0 else "neutral",
                },
                {
                    "key": "trading_value",
                    "label": "거래대금",
                    "value": stock["trading_value"],
                    "unit": "krw",
                    "status": "neutral",
                },
            ],
            "sector_comparison": {
                "sector_average_change_rate": sector["summary"]["average_change_rate"],
                "excess_return": stock["excess_return"],
                "sector_average_volume_growth_rate": sector["summary"]["volume_growth_rate"],
                "volume_growth_gap": 0.0,
                "rank_in_sector_by_change_rate": None,
                "rank_in_sector_by_trading_value": None,
                "sector_stock_count": sector["summary"]["stock_count"],
            },
            "chart": {
                "default_period": "1M",
                "available_periods": ["1D", "1W", "1M", "3M", "1Y"],
                "price_series": period_series["1Y"],
                "volume_series": [
                    {"date": point["date"], "volume": point["volume"]}
                    for point in period_series["1Y"]
                ],
                "period_series": period_series,
            },
            "risk_flags": [],
            "insight": {
                "headline": f"{stock['stock_name']}은 샘플 Overview 데이터로 표시됩니다.",
                "rows": [
                    {
                        "label": "샘플 범위",
                        "value": "실시간 데이터 연결 전까지 생성된 한국어 종목 데이터를 사용합니다.",
                        "basis": "sample_fallback",
                    }
                ],
                "keywords": stock["keywords"],
            },
            "related_news_ids": [],
            "related_disclosure_ids": [],
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
                "stock_code": stock_code,
            },
            "as_of": "2026-05-10 15:30:00",
            "items": [],
            "empty_state": {
                "message": "현재 선택 항목과 직접 연결된 뉴스나 공시가 없습니다.",
                "reason": "no_items",
            },
        }
