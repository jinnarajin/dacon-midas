from typing import Literal

from fastapi import APIRouter, Query

from backend.app.domains.news.service import NewsService
from backend.app.schemas.news import NewsResponse

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=NewsResponse)
def get_news(
    selection_level: Literal["market", "sector", "stock"] = Query(...),
    sector_id: str | None = None,
    stock_code: str | None = None,
) -> NewsResponse:
    return NewsService().get_news(selection_level, sector_id, stock_code)
