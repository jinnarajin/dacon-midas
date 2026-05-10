from typing import Literal

from pydantic import BaseModel


class MarketSelection(BaseModel):
    level: Literal["market"]
    market: str


class MarketSummary(BaseModel):
    market_name: str
    total_stock_count: int
    rising_stock_count: int
    falling_stock_count: int
    flat_stock_count: int
    rising_stock_ratio: float
    average_change_rate: float
    total_trading_value: int
    dominant_sector_id: str | None = None
    risk_level: Literal["normal", "watch", "risk"]


class SectorTile(BaseModel):
    sector_id: str
    sector_name: str
    industry_group: str | None = None
    stock_count: int
    rising_stock_count: int
    rising_stock_ratio: float
    average_change_rate: float
    total_market_cap: int
    total_trading_value: int
    volume_growth_rate: float | None = None
    volatility: float
    has_disclosure: bool
    keywords: list[str]


class LeadingSector(BaseModel):
    sector_id: str
    sector_name: str
    rank: int
    basis: Literal["trading_value", "average_change_rate", "volume_growth_rate", "market_cap"]
    value: float


class RiskFlag(BaseModel):
    code: str
    level: Literal["info", "watch", "risk"]
    message: str


class InsightRow(BaseModel):
    label: str
    value: str
    basis: str


class Insight(BaseModel):
    headline: str
    rows: list[InsightRow]
    keywords: list[str]


class MarketSummaryResponse(BaseModel):
    selection: MarketSelection
    as_of: str
    summary: MarketSummary
    sector_tiles: list[SectorTile]
    leading_sectors: list[LeadingSector]
    risk_flags: list[RiskFlag]
    insight: Insight
    related_news_ids: list[str]
