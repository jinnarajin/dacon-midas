def calculate_change(current_price: float, previous_close: float) -> float | None:
    if previous_close == 0:
        return None
    return current_price - previous_close


def calculate_change_rate(current_price: float, previous_close: float) -> float | None:
    if previous_close == 0:
        return None
    return (current_price - previous_close) / previous_close * 100


def calculate_trading_value(current_price: float, volume: float) -> float:
    return current_price * volume


def calculate_volume_growth_rate(today_volume: float, average_volume: float) -> float | None:
    if average_volume == 0:
        return None
    return (today_volume - average_volume) / average_volume * 100


def calculate_average_change_rate(change_rates: list[float | None]) -> float | None:
    valid_rates = [rate for rate in change_rates if rate is not None]
    if not valid_rates:
        return None
    return sum(valid_rates) / len(valid_rates)


def calculate_rising_stock_ratio(change_rates: list[float | None]) -> float | None:
    valid_rates = [rate for rate in change_rates if rate is not None]
    if not valid_rates:
        return None
    rising_count = sum(1 for rate in valid_rates if rate > 0)
    return rising_count / len(valid_rates) * 100


def calculate_excess_return(change_rate: float, comparison_average: float) -> float:
    return change_rate - comparison_average
