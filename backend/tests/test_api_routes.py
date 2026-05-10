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
        response = self.client.get("/api/sectors/semiconductor")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["selection"]["sector_id"], "semiconductor")

    def test_stock_overview_route(self) -> None:
        response = self.client.get("/api/stocks/000660/overview")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["identity"]["stock_code"], "000660")

    def test_news_route(self) -> None:
        response = self.client.get(
            "/api/news",
            params={
                "selection_level": "stock",
                "sector_id": "semiconductor",
                "stock_code": "000660",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()["items"]), 1)


if __name__ == "__main__":
    unittest.main()
