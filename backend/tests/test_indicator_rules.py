import unittest

from backend.app.domains.rules.indicator_rules import (
    calculate_average_change_rate,
    calculate_change_rate,
    calculate_excess_return,
    calculate_rising_stock_ratio,
    calculate_trading_value,
    calculate_volume_growth_rate,
)
from backend.app.domains.rules.insight_rules import (
    ensure_informational_text,
    market_headline,
    sector_headline,
    stock_headline,
)


class IndicatorRuleTests(unittest.TestCase):
    def test_calculates_core_indicators(self) -> None:
        self.assertAlmostEqual(calculate_change_rate(110, 100), 10.0)
        self.assertEqual(calculate_trading_value(1000, 20), 20000)
        self.assertAlmostEqual(calculate_volume_growth_rate(200, 100), 100.0)
        self.assertAlmostEqual(calculate_average_change_rate([1.0, None, 3.0]), 2.0)
        self.assertAlmostEqual(calculate_rising_stock_ratio([1.0, -1.0, 0.5]), 66.6666666667)
        self.assertAlmostEqual(calculate_excess_return(4.2, 2.0), 2.2)

    def test_handles_missing_denominators(self) -> None:
        self.assertIsNone(calculate_change_rate(100, 0))
        self.assertIsNone(calculate_volume_growth_rate(100, 0))


class InsightRuleTests(unittest.TestCase):
    def test_generates_informational_headlines(self) -> None:
        self.assertIn("positive", market_headline(70, "Semiconductor"))
        self.assertIn("outperforming", sector_headline("Semiconductor", 1.5))
        self.assertIn("underperforming", stock_headline("Example", -1.5))

    def test_blocks_advice_terms(self) -> None:
        with self.assertRaises(ValueError):
            ensure_informational_text("This is a buy recommendation.")


if __name__ == "__main__":
    unittest.main()
