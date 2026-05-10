from backend.app.repositories.cache_repository import SampleRepository
from backend.app.schemas.market import MarketSummaryResponse


class MarketService:
    def __init__(self, repository: SampleRepository | None = None) -> None:
        self.repository = repository or SampleRepository()

    def get_summary(self) -> MarketSummaryResponse:
        return self.repository.get_market_summary()
