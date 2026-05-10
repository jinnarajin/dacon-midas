from fastapi import FastAPI

from backend.app.api import market_routes, news_routes, sector_routes, stock_routes


def create_app() -> FastAPI:
    app = FastAPI(title="Market Cloud API")
    app.include_router(market_routes.router)
    app.include_router(sector_routes.router)
    app.include_router(stock_routes.router)
    app.include_router(news_routes.router)
    return app


app = create_app()
