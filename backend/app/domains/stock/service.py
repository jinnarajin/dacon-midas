from backend.app.repositories.cache_repository import SampleRepository
from backend.app.schemas.stock import StockOverviewResponse


class StockService:
    def __init__(self, repository: SampleRepository | None = None) -> None:
        self.repository = repository or SampleRepository()

    def get_overview(self, stock_code: str) -> StockOverviewResponse:
        return self.repository.get_stock_overview(stock_code)
