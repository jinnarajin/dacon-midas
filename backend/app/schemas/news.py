from typing import Literal

from pydantic import BaseModel


class NewsSelection(BaseModel):
    level: Literal["market", "sector", "stock"]
    market: str
    sector_id: str | None = None
    stock_code: str | None = None


class NewsItem(BaseModel):
    id: str
    item_type: Literal["news", "disclosure", "report"]
    title: str
    source: str
    published_at: str
    url: str | None = None
    summary: str | None = None
    related_market: str
    related_sector_ids: list[str]
    related_stock_codes: list[str]
    tags: list[str]
    priority: int
    is_direct_match: bool


class NewsEmptyState(BaseModel):
    message: str
    reason: str


class NewsResponse(BaseModel):
    selection: NewsSelection
    as_of: str
    items: list[NewsItem]
    empty_state: NewsEmptyState | None = None
