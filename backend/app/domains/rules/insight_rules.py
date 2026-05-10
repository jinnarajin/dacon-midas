FORBIDDEN_ADVICE_TERMS = ("buy", "sell", "hold", "recommend", "target price")


def ensure_informational_text(text: str) -> str:
    lowered = text.lower()
    if any(term in lowered for term in FORBIDDEN_ADVICE_TERMS):
        raise ValueError("Insight text must not contain investment advice wording.")
    return text


def market_headline(rising_stock_ratio: float, dominant_sector_name: str | None) -> str:
    if rising_stock_ratio >= 60 and dominant_sector_name:
        return ensure_informational_text(
            f"Market breadth is positive, led by {dominant_sector_name}."
        )
    if rising_stock_ratio <= 40:
        return ensure_informational_text("Market breadth is weak across tracked stocks.")
    return ensure_informational_text("Market breadth is mixed across tracked stocks.")


def sector_headline(sector_name: str, excess_return: float) -> str:
    if excess_return > 0:
        return ensure_informational_text(
            f"{sector_name} is outperforming the broader market."
        )
    if excess_return < 0:
        return ensure_informational_text(
            f"{sector_name} is underperforming the broader market."
        )
    return ensure_informational_text(
        f"{sector_name} is moving in line with the broader market."
    )


def stock_headline(stock_name: str, excess_return: float) -> str:
    if excess_return > 0:
        return ensure_informational_text(
            f"{stock_name} is outperforming its sector."
        )
    if excess_return < 0:
        return ensure_informational_text(
            f"{stock_name} is underperforming its sector."
        )
    return ensure_informational_text(
        f"{stock_name} is moving in line with its sector."
    )
