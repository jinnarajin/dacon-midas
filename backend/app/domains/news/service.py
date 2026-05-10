from backend.app.repositories.cache_repository import SampleRepository
from backend.app.schemas.news import NewsResponse


class NewsService:
    def __init__(self, repository: SampleRepository | None = None) -> None:
        self.repository = repository or SampleRepository()

    def get_news(
        self,
        selection_level: str,
        sector_id: str | None = None,
        stock_code: str | None = None,
    ) -> NewsResponse:
        return self.repository.get_news(selection_level, sector_id, stock_code)
