import os
from dataclasses import dataclass


@dataclass(frozen=True)
class KISSettings:
    app_key: str | None
    app_secret: str | None
    base_url: str
    market_division_code: str = "J"
    token: str | None = None

    @property
    def is_configured(self) -> bool:
        return bool((self.app_key and self.app_secret) or self.token)


def get_kis_settings() -> KISSettings:
    """Load Korea Investment OpenAPI settings from environment variables."""
    return KISSettings(
        app_key=os.getenv("KIS_APP_KEY"),
        app_secret=os.getenv("KIS_APP_SECRET"),
        token=os.getenv("KIS_ACCESS_TOKEN"),
        base_url=os.getenv("KIS_BASE_URL", "https://openapi.koreainvestment.com:9443").rstrip("/"),
        market_division_code=os.getenv("KIS_MARKET_DIVISION_CODE", "J"),
    )
