from fastapi import APIRouter

from backend.app.domains.sector.service import SectorService
from backend.app.schemas.sector import SectorResponse

router = APIRouter(prefix="/api/sectors", tags=["sectors"])


@router.get("/{sector_id}", response_model=SectorResponse)
def get_sector(sector_id: str) -> SectorResponse:
    return SectorService().get_sector(sector_id)
