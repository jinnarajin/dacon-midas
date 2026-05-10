from typing import Literal

from pydantic import BaseModel

from backend.app.schemas.market import Insight, RiskFlag


class SectorSelection(BaseModel):
    level: Literal["sector"]
    market: str
    sector_id: str


class SectorSummary(BaseModel):
    sector_id: str
    sector_name: str
    industry_group: str | None = None
    stock_count: int
    rising_stock_count: int
    falling_stock_count: int
    flat_stock_count: int
    rising_stock_ratio: float
    average_change_rate: float
    market_average_change_rate: float
    excess_return: float
    total_market_cap: int
    total_trading_value: int
    volume_growth_rate: float | None = None
    volatility: float
    risk_level: Literal["normal", "watch", "risk"]
    keywords: list[str]


class StockTile(BaseModel):
    stock_code: str
    stock_name: str
    market: Literal["KOSPI", "KOSDAQ", "KONEX", "OTHER"]
    industry: str | None = None
    current_price: int
    previous_close: int
    change_rate: float
    excess_return: float
    volume: int
    average_volume: int | None = None
    volume_growth_rate: float | None = None
    trading_value: int
    market_cap: int
    volatility: float
    has_disclosure: bool
    keywords: list[str]


class GainerRankItem(BaseModel):
    stock_code: str
    stock_name: str
    rank: int
    change_rate: float


class TradingValueRankItem(BaseModel):
    stock_code: str
    stock_name: str
    rank: int
    trading_value: int


class SectorRankings(BaseModel):
    top_gainers: list[GainerRankItem]
    top_decliners: list[GainerRankItem]
    trading_value_leaders: list[TradingValueRankItem]


class SectorResponse(BaseModel):
    selection: SectorSelection
    as_of: str
    summary: SectorSummary
    stock_tiles: list[StockTile]
    rankings: SectorRankings
    risk_flags: list[RiskFlag]
    insight: Insight
    related_news_ids: list[str]
