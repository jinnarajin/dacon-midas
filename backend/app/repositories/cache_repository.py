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

    def get_market_summary(self) -> MarketSummaryResponse:
        return MarketSummaryResponse.model_validate(self._load_json("market-summary.json"))

    def get_sector(self, sector_id: str) -> SectorResponse:
        payload = self._load_json(f"sector-{sector_id}.json")
        return SectorResponse.model_validate(payload)

    def get_stock_overview(self, stock_code: str) -> StockOverviewResponse:
        payload = self._load_json(f"stock-{stock_code}-overview.json")
        return StockOverviewResponse.model_validate(payload)

    def get_news(
        self,
        selection_level: str,
        sector_id: str | None = None,
        stock_code: str | None = None,
    ) -> NewsResponse:
        if selection_level == "stock" and stock_code:
            payload = self._load_json(f"news-stock-{stock_code}.json")
        else:
            payload = self._load_json("news-stock-000660.json")

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
