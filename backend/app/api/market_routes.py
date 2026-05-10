from fastapi import APIRouter

from backend.app.domains.market.service import MarketService
from backend.app.schemas.market import MarketSummaryResponse

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/summary", response_model=MarketSummaryResponse)
def get_market_summary() -> MarketSummaryResponse:
    return MarketService().get_summary()
