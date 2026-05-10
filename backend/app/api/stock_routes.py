from fastapi import APIRouter

from backend.app.domains.stock.service import StockService
from backend.app.schemas.stock import StockOverviewResponse

router = APIRouter(prefix="/api/stocks", tags=["stocks"])


@router.get("/{stock_code}/overview", response_model=StockOverviewResponse)
def get_stock_overview(stock_code: str) -> StockOverviewResponse:
    return StockService().get_overview(stock_code)
