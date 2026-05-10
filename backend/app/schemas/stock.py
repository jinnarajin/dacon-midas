from typing import Literal

from pydantic import BaseModel

from backend.app.schemas.market import Insight, RiskFlag


class StockSelection(BaseModel):
    level: Literal["stock"]
    market: str
    sector_id: str
    stock_code: str


class StockIdentity(BaseModel):
    stock_code: str
    stock_name: str
    market: Literal["KOSPI", "KOSDAQ", "KONEX", "OTHER"]
    sector_id: str
    sector_name: str
    industry: str | None = None


class StockQuote(BaseModel):
    current_price: int
    previous_close: int
    change: int | None = None
    change_rate: float
    volume: int
    average_volume: int | None = None
    volume_growth_rate: float | None = None
    trading_value: int
    market_cap: int | None = None
    volatility: float | None = None
    has_disclosure: bool


class StockKpi(BaseModel):
    key: str
    label: str
    value: float | int | str | None
    unit: Literal["krw", "number", "percent", "rank", "text"]
    status: Literal["positive", "negative", "neutral", "watch", "risk"]


class SectorComparison(BaseModel):
    sector_average_change_rate: float
    excess_return: float
    sector_average_volume_growth_rate: float | None = None
    volume_growth_gap: float | None = None
    rank_in_sector_by_change_rate: int | None = None
    rank_in_sector_by_trading_value: int | None = None
    sector_stock_count: int


class PricePoint(BaseModel):
    date: str
    open: int
    high: int
    low: int
    close: int
    volume: int


class VolumePoint(BaseModel):
    date: str
    volume: int


class StockChart(BaseModel):
    default_period: Literal["1D", "1W", "1M", "3M", "1Y"]
    available_periods: list[Literal["1D", "1W", "1M", "3M", "1Y"]]
    price_series: list[PricePoint]
    volume_series: list[VolumePoint]


class StockOverviewResponse(BaseModel):
    selection: StockSelection
    as_of: str
    identity: StockIdentity
    quote: StockQuote
    kpis: list[StockKpi]
    sector_comparison: SectorComparison
    chart: StockChart
    risk_flags: list[RiskFlag]
    insight: Insight
    related_news_ids: list[str]
    related_disclosure_ids: list[str]
