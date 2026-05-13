import unittest

from fastapi.testclient import TestClient

from backend.app.main import app


class ApiRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_market_summary_route(self) -> None:
        response = self.client.get("/api/market/summary")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["selection"]["level"], "market")

    def test_sector_route(self) -> None:
        response = self.client.get("/api/sectors/information-technology")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["selection"]["sector_id"], "information-technology")

    def test_stock_overview_route(self) -> None:
        response = self.client.get("/api/stocks/000660/overview")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["identity"]["stock_code"], "000660")
        chart = response.json()["chart"]
        self.assertIn("period_series", chart)
        self.assertNotEqual(chart["period_series"]["1D"], chart["period_series"]["1Y"])

    def test_news_route(self) -> None:
        response = self.client.get(
            "/api/news",
            params={
                "selection_level": "stock",
                "sector_id": "information-technology",
                "stock_code": "000660",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()["items"]), 1)

    def test_missing_sample_routes_return_fallback_payloads(self) -> None:
        sector = self.client.get("/api/sectors/materials")
        self.assertEqual(sector.status_code, 200)
        self.assertEqual(sector.json()["selection"]["sector_id"], "materials")
        self.assertEqual(len(sector.json()["stock_tiles"]), 20)

        stock = self.client.get("/api/stocks/005930/overview")
        self.assertEqual(stock.status_code, 200)
        self.assertEqual(stock.json()["identity"]["stock_code"], "005930")


if __name__ == "__main__":
    unittest.main()
