from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api import market_routes, news_routes, sector_routes, stock_routes


def create_app() -> FastAPI:
    app = FastAPI(title="Market Cloud API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(market_routes.router)
    app.include_router(sector_routes.router)
    app.include_router(stock_routes.router)
    app.include_router(news_routes.router)
    return app


app = create_app()
