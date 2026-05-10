# Architecture Notes

<!--
Market Cloud 아키텍처 메모입니다.

데이터 흐름:
외부 API -> repository -> domain service -> rules -> schema -> API -> frontend feature

화면 흐름:
MarketMap 선택 -> SelectionState 변경 -> InsightPanel/NewsDock/StockOverview 갱신
-->
