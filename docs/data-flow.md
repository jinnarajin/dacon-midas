# Data Flow

<!--
1. 한국투자증권 OpenAPI에서 가격/거래량/시세를 가져온다.
2. KRX 또는 마스터 테이블로 종목-섹터 매핑을 보강한다.
3. KIND/DART/뉴스 소스로 이벤트 정보를 붙인다.
4. indicator_rules에 따라 지표를 계산한다.
5. insight_rules에 따라 참고 문장을 생성한다.
6. visualization_rules에 따라 화면 표시 값을 정규화한다.
-->
