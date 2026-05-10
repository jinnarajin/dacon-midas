import unittest

from backend.app.repositories.cache_repository import SampleRepository


class SampleRepositoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = SampleRepository()

    def test_loads_contract_shaped_samples(self) -> None:
        self.assertEqual(self.repository.get_market_summary().selection.level, "market")
        self.assertEqual(self.repository.get_sector("semiconductor").selection.sector_id, "semiconductor")
        self.assertEqual(self.repository.get_stock_overview("000660").identity.stock_code, "000660")
        self.assertGreaterEqual(len(self.repository.get_news("stock", "semiconductor", "000660").items), 1)


if __name__ == "__main__":
    unittest.main()
