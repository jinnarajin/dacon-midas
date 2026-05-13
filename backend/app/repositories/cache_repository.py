import json
from pathlib import Path
from typing import Any

from backend.app.schemas.market import MarketSummaryResponse
from backend.app.schemas.news import NewsResponse
from backend.app.schemas.sector import SectorResponse
from backend.app.schemas.stock import StockOverviewResponse


def _stock(
    stock_code: str,
    stock_name: str,
    industry: str,
    current_price: int,
    change_rate: float,
    volume: int,
    average_volume: int,
    trading_value: int,
    market_cap: int,
    volatility: float,
    keywords: list[str],
) -> dict[str, Any]:
    previous_close = round(current_price / (1 + change_rate / 100))
    return {
        "stock_code": stock_code,
        "stock_name": stock_name,
        "market": "KOSPI",
        "industry": industry,
        "current_price": current_price,
        "previous_close": previous_close,
        "change_rate": change_rate,
        "excess_return": 0.0,
        "volume": volume,
        "average_volume": average_volume,
        "volume_growth_rate": round(((volume - average_volume) / average_volume) * 100, 2),
        "trading_value": trading_value,
        "market_cap": market_cap,
        "volatility": volatility,
        "has_disclosure": volatility >= 1.7,
        "keywords": keywords,
    }


GICS_SECTOR_STOCKS: dict[str, list[dict[str, Any]]] = {
    "information_technology": [
        _stock("005930", "Samsung Electronics", "Semiconductors", 81200, 2.14, 1880000, 1210000, 152656000000, 484000000000000, 1.28, ["memory", "AI server"]),
        _stock("000660", "SK hynix", "Semiconductors", 189400, 4.12, 650000, 310000, 123110000000, 137800000000000, 1.88, ["HBM", "memory"]),
        _stock("035420", "NAVER", "Internet Software", 214000, 1.24, 939000, 582000, 201000000000, 54000000000000, 1.14, ["AI", "cloud"]),
        _stock("036570", "NCSoft", "Application Software", 184500, -0.86, 226000, 180000, 41700000000, 4050000000000, 1.46, ["game", "software"]),
        _stock("034730", "SK Square", "Technology Holdings", 92100, 1.78, 702000, 420000, 64600000000, 12300000000000, 1.58, ["portfolio", "chip"]),
        _stock("042700", "Hanmi Semiconductor", "Semiconductor Equipment", 154300, -1.25, 484000, 391000, 74700000000, 14900000000000, 2.04, ["equipment", "HBM"])
    ],
    "financials": [
        _stock("105560", "KB Financial", "Banks", 84200, -0.21, 1377000, 950000, 116000000000, 33000000000000, 0.82, ["bank", "dividend"]),
        _stock("055550", "Shinhan Financial", "Banks", 51100, 0.34, 1660000, 1180000, 84800000000, 26400000000000, 0.78, ["bank", "NIM"]),
        _stock("086790", "Hana Financial", "Banks", 62800, 0.18, 1190000, 920000, 74700000000, 18300000000000, 0.74, ["bank", "FX"]),
        _stock("316140", "Woori Financial", "Banks", 16220, -0.43, 3810000, 3060000, 61800000000, 12100000000000, 0.68, ["bank", "capital"]),
        _stock("032830", "Samsung Life", "Insurance", 97200, 0.74, 402000, 280000, 39100000000, 19400000000000, 0.94, ["insurance", "rates"])
    ],
    "health_care": [
        _stock("207940", "Samsung Biologics", "CDMO", 821000, -0.48, 112000, 87000, 92000000000, 58400000000000, 1.16, ["CDMO", "capacity"]),
        _stock("068270", "Celltrion", "Biotechnology", 183000, 1.08, 502000, 390000, 91900000000, 39800000000000, 1.22, ["biosimilar", "drug"]),
        _stock("128940", "Hanmi Pharm", "Pharmaceuticals", 331500, -1.34, 114000, 72000, 37800000000, 4300000000000, 1.72, ["pipeline", "clinical"]),
        _stock("196170", "Alteogen", "Biotechnology", 286000, 2.92, 381000, 214000, 108900000000, 15200000000000, 2.28, ["platform", "licensing"]),
        _stock("145020", "Hugel", "Medical Aesthetics", 271000, 0.86, 89000, 61000, 24100000000, 3400000000000, 1.34, ["toxins", "exports"])
    ],
    "consumer_discretionary": [
        _stock("005380", "Hyundai Motor", "Automobiles", 263000, 0.58, 840000, 639000, 221000000000, 55000000000000, 1.02, ["autos", "hybrid"]),
        _stock("000270", "Kia", "Automobiles", 111500, 0.74, 1776000, 1369000, 198000000000, 44000000000000, 1.06, ["autos", "SUV"]),
        _stock("090430", "Amorepacific", "Consumer Products", 146800, -0.62, 266000, 205000, 39000000000, 8600000000000, 1.38, ["cosmetics", "China"]),
        _stock("161390", "Hankook Tire", "Auto Components", 44800, 1.16, 711000, 482000, 31900000000, 5550000000000, 1.21, ["tires", "exports"]),
        _stock("352820", "HYBE", "Entertainment", 201000, 1.12, 378000, 245000, 76000000000, 8370000000000, 1.64, ["artist", "tour"])
    ],
    "consumer_staples": [
        _stock("097950", "CJ CheilJedang", "Food Products", 332000, 0.22, 67000, 51000, 22200000000, 5000000000000, 0.72, ["food", "margin"]),
        _stock("004370", "Nongshim", "Food Products", 407500, 0.54, 42000, 33000, 17100000000, 2500000000000, 0.76, ["noodles", "exports"]),
        _stock("051900", "LG H&H", "Household Products", 381000, -0.38, 74000, 59000, 28200000000, 5950000000000, 0.98, ["beauty", "household"]),
        _stock("271560", "Orion", "Food Products", 103800, 0.18, 118000, 94000, 12200000000, 4100000000000, 0.68, ["snacks", "global"])
    ],
    "industrials": [
        _stock("329180", "HD Hyundai Heavy", "Shipbuilding", 178000, 2.64, 697000, 343000, 124000000000, 15800000000000, 1.94, ["LNG", "orders"]),
        _stock("010140", "Samsung Heavy", "Shipbuilding", 11780, 1.91, 9120000, 5400000, 107400000000, 10400000000000, 1.76, ["shipbuilding", "backlog"]),
        _stock("047810", "Korea Aerospace", "Aerospace", 68400, 1.42, 1240000, 730000, 84800000000, 6670000000000, 1.52, ["defense", "aircraft"]),
        _stock("012450", "Hanwha Aerospace", "Defense", 349500, 2.18, 431000, 244000, 150600000000, 17600000000000, 1.86, ["defense", "engine"]),
        _stock("000720", "Hyundai E&C", "Construction", 35600, -0.14, 522000, 419000, 18600000000, 3970000000000, 1.05, ["construction", "plant"])
    ],
    "energy": [
        _stock("096770", "SK Innovation", "Oil & Gas", 118600, -0.34, 498000, 391000, 59100000000, 11000000000000, 1.32, ["oil", "battery"]),
        _stock("010950", "S-Oil", "Oil Refining", 68800, 0.48, 332000, 251000, 22800000000, 7750000000000, 1.18, ["refining", "spread"]),
        _stock("267250", "HD Hyundai", "Energy Holdings", 85400, 0.66, 294000, 220000, 25100000000, 6740000000000, 1.04, ["oil", "ship"]),
        _stock("034020", "Doosan Enerbility", "Power Equipment", 21150, -0.72, 4020000, 3180000, 85000000000, 13600000000000, 1.72, ["nuclear", "turbine"])
    ],
    "materials": [
        _stock("051910", "LG Chem", "Chemicals", 402000, -1.32, 443000, 310000, 178000000000, 31000000000000, 1.88, ["chemicals", "battery"]),
        _stock("005490", "POSCO Holdings", "Steel", 392000, -0.54, 361000, 284000, 141500000000, 33200000000000, 1.42, ["steel", "lithium"]),
        _stock("373220", "LG Energy Solution", "Battery Materials", 421500, 1.86, 800000, 451000, 337000000000, 98600000000000, 1.96, ["battery", "EV"]),
        _stock("011170", "Lotte Chemical", "Chemicals", 98200, -1.08, 292000, 240000, 28700000000, 4200000000000, 1.66, ["naphtha", "spreads"]),
        _stock("010130", "Korea Zinc", "Metals", 534000, 0.44, 51000, 40000, 27200000000, 11100000000000, 1.08, ["zinc", "metals"])
    ],
    "utilities": [
        _stock("015760", "KEPCO", "Electric Utilities", 21950, 0.06, 1840000, 1520000, 40400000000, 14100000000000, 0.62, ["power", "tariff"]),
        _stock("036460", "Korea Gas", "Gas Utilities", 38200, -0.18, 311000, 250000, 11900000000, 3530000000000, 0.78, ["gas", "import"]),
        _stock("051600", "KEPCO KPS", "Utility Services", 44900, 0.32, 128000, 100000, 5750000000, 2020000000000, 0.72, ["maintenance", "power"])
    ],
    "communication_services": [
        _stock("017670", "SK Telecom", "Telecom", 55200, 0.42, 792000, 641000, 43700000000, 11900000000000, 0.84, ["telecom", "AI"]),
        _stock("030200", "KT", "Telecom", 41900, 0.24, 1030000, 780000, 43100000000, 10900000000000, 0.76, ["telecom", "IDC"]),
        _stock("032640", "LG Uplus", "Telecom", 11190, -0.16, 1980000, 1600000, 22100000000, 4880000000000, 0.66, ["telecom", "wireless"]),
        _stock("035720", "Kakao", "Interactive Media", 58900, -0.74, 2428000, 1900000, 143000000000, 26000000000000, 1.48, ["platform", "ads"])
    ],
    "real_estate": [
        _stock("088260", "Hyundai Glovis RE Proxy", "Real Estate Services", 184000, -0.24, 92000, 76000, 16900000000, 6900000000000, 0.88, ["assets", "lease"]),
        _stock("357120", "Koramco REITs", "REITs", 4780, 0.12, 480000, 410000, 2290000000, 390000000000, 0.58, ["REIT", "dividend"]),
        _stock("334890", "IGIS Value Plus REIT", "REITs", 5120, -0.08, 260000, 220000, 1330000000, 270000000000, 0.52, ["REIT", "office"])
    ]
}


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
        stocks = GICS_SECTOR_STOCKS.get(sector_id)
        if stocks is None:
            stock_code = f"D{sum(ord(char) for char in sector_id) % 100000:05d}"[:6]
            stocks = [{
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
            }]
        stocks = [
            {
                **stock,
                "excess_return": round(stock["change_rate"] - tile["average_change_rate"], 2),
            }
            for stock in stocks
        ]
        top_gainers = sorted(stocks, key=lambda item: item["change_rate"], reverse=True)
        top_decliners = sorted(stocks, key=lambda item: item["change_rate"])
        trading_value_leaders = sorted(stocks, key=lambda item: item["trading_value"], reverse=True)
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
            "stock_tiles": stocks,
            "rankings": {
                "top_gainers": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "change_rate": stock["change_rate"]
                    }
                    for index, stock in enumerate(top_gainers[:5])
                ],
                "top_decliners": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "change_rate": stock["change_rate"]
                    }
                    for index, stock in enumerate(top_decliners[:5])
                ],
                "trading_value_leaders": [
                    {
                        "stock_code": stock["stock_code"],
                        "stock_name": stock["stock_name"],
                        "rank": index + 1,
                        "trading_value": stock["trading_value"]
                    }
                    for index, stock in enumerate(trading_value_leaders[:5])
                ]
            },
            "risk_flags": [],
            "insight": {
                "headline": f"{tile['sector_name']} contains {len(stocks)} representative listed companies.",
                "rows": [{
                    "label": "Hierarchy",
                    "value": "Select a company tile to drill down into its stock overview.",
                    "basis": "sector_to_stock"
                }],
                "keywords": tile["keywords"]
            },
            "related_news_ids": []
        }

    def _build_dummy_stock(self, stock_code: str) -> dict[str, Any]:
        matched_sector_id, matched_sector_tile, matched_stock = self._find_gics_stock(stock_code)
        sector = self._load_json("sector-semiconductor.json")
        stock = matched_stock or next(
            (item for item in sector["stock_tiles"] if item["stock_code"] == stock_code),
            None,
        )
        sector_tile = matched_sector_tile or {
            "sector_id": "semiconductor",
            "sector_name": "Semiconductor",
            "average_change_rate": sector["summary"]["average_change_rate"],
            "volume_growth_rate": sector["summary"]["volume_growth_rate"],
            "stock_count": sector["summary"]["stock_count"],
        }
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
                "sector_id": matched_sector_id or "semiconductor",
                "stock_code": stock_code
            },
            "as_of": "2026-05-10 15:30:00",
            "identity": {
                "stock_code": stock_code,
                "stock_name": stock["stock_name"],
                "market": stock["market"],
                "sector_id": matched_sector_id or "semiconductor",
                "sector_name": sector_tile["sector_name"],
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
                "sector_average_change_rate": sector_tile["average_change_rate"],
                "excess_return": stock["excess_return"],
                "sector_average_volume_growth_rate": sector_tile["volume_growth_rate"],
                "volume_growth_gap": 0.0,
                "rank_in_sector_by_change_rate": None,
                "rank_in_sector_by_trading_value": None,
                "sector_stock_count": sector_tile["stock_count"]
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

    def _find_gics_stock(
        self,
        stock_code: str,
    ) -> tuple[str | None, dict[str, Any] | None, dict[str, Any] | None]:
        for sector_id, stocks in GICS_SECTOR_STOCKS.items():
            stock = next((item for item in stocks if item["stock_code"] == stock_code), None)
            if stock is not None:
                return sector_id, self._market_sector_tile(sector_id), stock
        return None, None, None

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
