from backend.app.repositories.cache_repository import SampleRepository
from backend.app.schemas.sector import SectorResponse


class SectorService:
    def __init__(self, repository: SampleRepository | None = None) -> None:
        self.repository = repository or SampleRepository()

    def get_sector(self, sector_id: str) -> SectorResponse:
        return self.repository.get_sector(sector_id)
