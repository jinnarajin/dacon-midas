import unittest

from backend.app.repositories.cache_repository import SampleRepository


class SampleRepositoryTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repository = SampleRepository()

    def test_loads_contract_shaped_samples(self) -> None:
        self.assertEqual(self.repository.get_market_summary().selection.level, "market")
        self.assertEqual(
            self.repository.get_sector("information-technology").selection.sector_id,
            "information-technology",
        )
        self.assertEqual(len(self.repository.get_market_summary().sector_tiles), 11)
        self.assertEqual(len(self.repository.get_sector("information-technology").stock_tiles), 20)
        self.assertEqual(self.repository.get_stock_overview("000660").identity.stock_code, "000660")
        self.assertIsNotNone(self.repository.get_stock_overview("000660").chart.period_series)
        self.assertNotEqual(
            self.repository.get_stock_overview("000660").chart.period_series["1D"],
            self.repository.get_stock_overview("000660").chart.period_series["1Y"],
        )
        self.assertGreaterEqual(
            len(self.repository.get_news("stock", "information-technology", "000660").items),
            1,
        )

    def test_uses_dummy_fallback_for_missing_samples(self) -> None:
        self.assertEqual(self.repository.get_sector("materials").selection.sector_id, "materials")
        self.assertEqual(len(self.repository.get_sector("materials").stock_tiles), 20)
        self.assertEqual(self.repository.get_stock_overview("005930").identity.stock_code, "005930")
        self.assertEqual(
            self.repository.get_news("stock", "information-technology", "005930").selection.stock_code,
            "005930",
        )


if __name__ == "__main__":
    unittest.main()
