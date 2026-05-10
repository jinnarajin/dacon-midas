# Data Rules

이 문서는 Market Cloud 대시보드에서 사용하는 데이터 수집, 표준화, 결측 처리 기준을 정의한다.
MVP에서는 한국투자증권 OpenAPI를 기본 데이터 소스로 사용하되, 한투 OpenAPI만으로 부족한 데이터는 보조 소스로 확장할 수 있다.

## 데이터 소스 우선순위

1. 한국투자증권 OpenAPI
   - 현재가, 전일 대비, 거래량, 거래대금, 일자별 시세를 우선 수집한다.
   - 국내 주식 실시간 또는 준실시간 가격 데이터의 기본 소스로 사용한다.
2. KRX 또는 별도 마스터 데이터
   - 종목명, 종목코드, 시장 구분, 업종, 섹터, 산업 분류 매핑에 사용한다.
   - 섹터 분류는 MVP에서 고정 마스터 테이블을 사용할 수 있다.
3. KIND 또는 DART
   - 공시 제목, 공시 유형, 공시 발생 시각, 종목 연결 정보가 필요할 때 사용한다.
4. 외부 뉴스 API 또는 별도 수집 방식
   - 한투 OpenAPI에서 제공 가능한 시황/뉴스 데이터가 부족할 때 사용한다.
   - 뉴스는 시장, 섹터, 종목 이슈 보강 용도로 사용하며 투자 판단 근거로 단독 확정하지 않는다.

## MVP 필수 데이터

MVP 화면은 다음 데이터가 있으면 동작해야 한다.

- stock_code
- stock_name
- market
- sector
- industry
- current_price
- previous_close
- change_rate
- volume
- trading_value
- timestamp

## 시각화 필수 데이터

깔끔한 히트맵과 Overview를 만들기 위해 다음 필드는 시각화 필수 필드로 취급한다.

- market_cap
- trading_value
- change_rate
- volume_growth_rate
- volatility
- has_disclosure

## 확장 데이터

다음 데이터는 있으면 인사이트 품질을 높이지만 MVP 필수 조건은 아니다.

- investor_foreign_flow
- investor_institution_flow
- investor_individual_flow
- news_items
- disclosure_items
- sector_keywords
- average_volume
- daily_ohlcv

## 계층 데이터 규칙

- 화면 데이터는 `market > sector > industry > stock` 계층으로 준비한다.
- MVP에서 industry 데이터가 부족하면 sector와 같은 값으로 대체할 수 있다.
- mock 데이터도 실제 시장처럼 섹터별 종목 수 차이를 둔다.
- 모든 종목은 하나의 sector에만 속하게 하되, 키워드는 여러 개 가질 수 있다.

## 데이터 포맷

- 종목코드는 6자리 문자열로 통일한다. 예: `005930`
- 날짜/시각은 `YYYY-MM-DD HH:mm:ss` 형식으로 저장한다.
- 가격, 거래량, 거래대금은 숫자 타입으로 저장한다.
- 등락률과 증가율은 퍼센트 단위 숫자로 저장한다. 예: `2.35`
- 시장 구분은 `KOSPI`, `KOSDAQ`, `KONEX`, `OTHER` 중 하나로 정규화한다.
- 선택 상태는 `market`, `sector`, `stock` 중 하나로 표현한다.

## 표준화 규칙

- `trading_value`가 원천 데이터에 없으면 `current_price * volume`으로 계산한다.
- `change_rate`가 원천 데이터에 없으면 `previous_close`를 사용해 계산한다.
- 섹터가 없는 종목은 `미분류`로 분류하되, 히트맵에서는 별도 그룹으로 표시한다.
- 같은 종목에 여러 데이터 소스가 있을 경우 가격 데이터는 한투 OpenAPI를 우선한다.
- 뉴스/공시 데이터는 제목, 시간, 관련 대상, 원문 URL 또는 식별자를 보존한다.

## 시각화 값 정제

- 히트맵 크기 계산용 raw 값은 그대로 쓰지 않고 정규화 값을 별도로 만든다.
- `market_cap` 또는 `trading_value` extreme value는 clamp하여 한 종목이 화면을 과도하게 차지하지 않게 한다.
- 크기 정규화는 최소값과 최대값을 보존하되, 상위 극단값은 95 percentile 기준으로 제한할 수 있다.
- 색상 계산용 등락률도 extreme value를 제한해 전체 맵이 한두 종목 색에 끌려가지 않게 한다.
- raw 값, display 값, normalized 값은 서로 분리해 저장한다.

## 결측치 처리

- `current_price`가 없으면 해당 종목은 시장 맵에서 제외한다.
- `previous_close`가 없거나 0이면 등락률을 계산하지 않고 `null`로 둔다.
- `volume`이 없으면 거래량 기반 강조, 거래량 증가율, 거래대금 계산을 생략한다.
- 섹터 평균 계산 시 결측 등락률 종목은 분모에서 제외한다.
- 뉴스가 없으면 "현재 선택 대상과 직접 연결된 뉴스가 없습니다."라는 fallback 상태를 사용한다.

## 캐싱 기준

- 현재가와 거래량은 장중 데이터이므로 짧은 주기로 갱신 가능한 캐시를 사용한다.
- 일자별 시세와 종목 마스터 데이터는 하루 단위 캐시를 사용할 수 있다.
- 뉴스와 공시는 발생 시각 기준으로 정렬하고 중복 제목은 하나로 병합한다.
- 캐시된 데이터에는 `fetched_at`을 반드시 포함해 데이터 신선도를 표시한다.

## 데이터 사용 원칙

- 인사이트는 데이터 기반 참고 정보로만 사용한다.
- 뉴스나 공시가 있어도 상승/하락 원인을 확정하지 않는다.
- 데이터 출처가 섞일 경우 화면 또는 로그에서 source를 추적할 수 있어야 한다.
