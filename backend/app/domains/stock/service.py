from backend.app.repositories.cache_repository import SampleRepository
from backend.app.repositories.kis_client import KISClient, KISClientError
from backend.app.schemas.stock import StockOverviewResponse


class StockService:
    def __init__(
        self,
        repository: SampleRepository | None = None,
        kis_client: KISClient | None = None,
    ) -> None:
        self.repository = repository or SampleRepository()
        self.kis_client = kis_client or KISClient()

    def get_overview(self, stock_code: str) -> StockOverviewResponse:
        overview = self.repository.get_stock_overview(stock_code)
        if not self.kis_client.is_configured:
            return overview

        try:
            quote = self.kis_client.get_current_price(stock_code)
        except KISClientError:
            return overview

        overview.quote.current_price = quote.current_price
        overview.quote.previous_close = quote.previous_close
        overview.quote.change = quote.change
        overview.quote.change_rate = quote.change_rate
        overview.quote.volume = quote.volume
        overview.quote.trading_value = quote.trading_value
        overview.quote.market_cap = quote.market_cap
        overview.kpis[0].value = quote.change_rate
        overview.kpis[0].status = "positive" if quote.change_rate > 0 else "negative" if quote.change_rate < 0 else "neutral"
        overview.kpis[1].value = quote.trading_value
        overview.chart.price_series[-1].close = quote.current_price
        overview.chart.price_series[-1].volume = quote.volume
        overview.chart.volume_series[-1].volume = quote.volume
        return overview
