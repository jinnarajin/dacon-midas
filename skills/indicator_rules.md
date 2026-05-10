# Indicator Rules

이 문서는 시장, 섹터, 종목 인사이트에 사용하는 지표 계산 기준을 정의한다.
모든 계산은 결측치와 0 나누기 예외를 먼저 처리한 뒤 수행한다.

## 기본 계산식

### 등락률

```text
change_rate = (current_price - previous_close) / previous_close * 100
```

- `previous_close`가 없거나 0이면 `change_rate = null`로 둔다.
- 한투 OpenAPI가 전일 대비 등락률을 제공하면 원천값을 우선 사용할 수 있다.

### 거래대금

```text
trading_value = current_price * volume
```

- 원천 데이터의 거래대금이 있으면 원천값을 우선한다.
- `current_price` 또는 `volume`이 없으면 계산하지 않는다.

### 거래량 증가율

```text
volume_growth_rate = (today_volume - average_volume) / average_volume * 100
```

- `average_volume`은 기본적으로 최근 20거래일 평균 거래량을 사용한다.
- 20거래일 데이터가 부족하면 사용 가능한 최근 거래일 평균을 사용하되, 5거래일 미만이면 계산하지 않는다.
- `average_volume`이 0이면 계산하지 않는다.

### 섹터 평균 등락률

```text
sector_avg_change_rate = sum(valid_stock_change_rate) / valid_stock_count
```

- 등락률이 없는 종목은 제외한다.
- 유효 종목 수가 3개 미만이면 섹터 평균 신뢰도를 낮게 본다.

### 시장 평균 등락률

```text
market_avg_change_rate = sum(valid_stock_change_rate) / valid_stock_count
```

- KOSPI/KOSDAQ을 함께 보여줄 경우 전체 평균과 시장별 평균을 별도로 계산할 수 있다.

### 초과 상승률

```text
excess_return = stock_change_rate - sector_avg_change_rate
```

- 종목이 같은 섹터 평균보다 얼마나 강한지 판단할 때 사용한다.

### 상승 종목 비율

```text
advance_ratio = rising_stock_count / valid_stock_count * 100
```

- `change_rate > 0`이면 상승 종목으로 본다.
- `change_rate < 0`이면 하락 종목으로 본다.
- `change_rate = 0`은 보합으로 분리한다.

### 변동성

```text
volatility = standard_deviation(daily_return, period)
```

- 기본 기간은 최근 20거래일이다.
- 데이터가 5거래일 미만이면 계산하지 않는다.

### 시장 기여도

```text
market_contribution = market_cap * change_rate
```

- `market_cap`이 없으면 거래대금을 대체 기준으로 사용할 수 있다.
- 시장 전체 상승/하락에 영향을 준 대표 종목을 찾는 데 사용한다.

### 거래대금 집중도

```text
trading_value_concentration = target_trading_value / total_trading_value * 100
```

- 시장에서는 섹터별 거래대금 집중도를 계산한다.
- 섹터에서는 종목별 거래대금 집중도를 계산한다.
- 25% 이상이면 주도 섹터 또는 주도 종목 후보로 본다.

## 시각화 정규화 지표

### 색상 강도

```text
normalized_change_rate = clamp(change_rate, -limit, limit) / limit
```

- 기본 `limit`은 5%로 둔다.
- 5%를 초과한 상승/하락은 같은 최대 색상 강도로 표현한다.
- raw 등락률은 별도로 보존하고, 색상에는 normalized 값을 사용한다.

### 크기 점수

```text
normalized_size_score = sqrt(clamp(size_metric, min_size, p95_size) / p95_size)
```

- `size_metric`은 `market_cap` 또는 `trading_value`이다.
- `sqrt` 스케일을 사용해 대형주 쏠림을 완화한다.
- 최소 타일 크기를 보장하기 위해 `min_size`를 둔다.

### 위험 점수

```text
risk_score = weighted_sum(volatility_signal, volume_signal, disclosure_signal)
```

- `volatility_signal`: 변동성이 최근 평균 대비 1.5배 이상이면 1.
- `volume_signal`: 거래량 증가율 100% 이상이면 1.
- `disclosure_signal`: 관련 공시가 있으면 1.
- `risk_score >= 2`이면 위험 또는 확인 필요 강조를 표시한다.

## 값 표현 분리

- raw 값은 계산과 비교에 사용한다.
- display 값은 화면에 표시하기 좋은 단위로 변환한다.
- normalized 값은 색상, 크기, 강조 같은 시각화에만 사용한다.
- display 값이나 normalized 값으로 다시 지표를 계산하지 않는다.

## 기본 임계값

| 지표 | 기준 | 의미 |
| --- | --- | --- |
| 상승 종목 비율 | 60% 이상 | 시장 또는 섹터 전반 강세 |
| 하락 종목 비율 | 60% 이상 | 시장 또는 섹터 전반 약세 |
| 거래량 증가율 | 100% 이상 | 시장 관심도 증가 |
| 초과 상승률 | +2%p 이상 | 섹터 대비 강세 |
| 초과 상승률 | -2%p 이하 | 섹터 대비 약세 |
| 거래대금 순위 | 상위 10% | 수급 집중 후보 |
| 변동성 | 최근 평균 대비 1.5배 이상 | 단기 변동성 확대 |

## 예외 처리

- 계산에 필요한 값이 없으면 임의로 0을 넣지 않는다.
- `null` 지표는 인사이트 문구 생성에서 제외한다.
- 섹터 평균과 시장 평균은 같은 거래 시점의 데이터끼리만 비교한다.
- 장중 데이터와 일봉 데이터를 섞어 비교할 때는 기준 시각을 함께 기록한다.

## 사용 원칙

- 지표는 인사이트의 근거로 함께 제시한다.
- 지표 하나만으로 상승/하락 원인을 확정하지 않는다.
- 뉴스, 공시, 수급 데이터는 원인 후보를 보강하는 보조 정보로 사용한다.
