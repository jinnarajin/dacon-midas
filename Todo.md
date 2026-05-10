# Market Cloud Todo

<!--
목표:
Market Cloud를 정적 프로토타입에서 유지보수 가능한 React + FastAPI 구조로 재구축한다.
작업 순서는 데이터 계약을 먼저 고정하고, mock 기반 동작을 만든 뒤, 실제 외부 API를 연결하는 흐름을 따른다.
-->

## 0. 프로젝트 정리

- [x] 기존 정적 프로토타입을 `legacy/static-prototype/`로 격리한다.
- [x] 개발 산출물과 로그를 `dev-artifacts/`로 분리한다.
- [x] 신규 구조 기준 `PROJECT_STRUCTURE.md`를 정리한다.
- [x] 정크 코드 감사 내용을 `docs/junk-audit.md`에 기록한다.
- [ ] 깨진 인코딩 문서의 원본 또는 정상 텍스트를 확보한다.
- [ ] `skills/*.md` 문서의 깨진 한글을 복구하여 작성한다.

## 1. 계약 우선 설계

- [x] `shared/contracts/market.md`에 시장 요약 응답 필드를 확정한다.
- [x] `shared/contracts/sector.md`에 섹터 상세 응답 필드를 확정한다.
- [x] `shared/contracts/stock.md`에 종목 Overview 응답 필드를 확정한다.
- [x] `shared/contracts/news.md`에 뉴스/공시 공통 필드를 확정한다.
- [x] `shared/contracts/api-contract.md`에 MVP 엔드포인트와 예시 JSON을 추가한다.
- [x] 프론트와 백엔드가 공유할 용어를 `shared/contracts/terms.md`에 정리한다.

## 2. 데이터 모델 설계

- [x] `backend/app/schemas/market.py`에 시장 응답 스키마를 작성한다.
- [x] `backend/app/schemas/sector.py`에 섹터 응답 스키마를 작성한다.
- [x] `backend/app/schemas/stock.py`에 종목 응답 스키마를 작성한다.
- [x] `backend/app/schemas/news.py`에 뉴스/공시 응답 스키마를 작성한다.
- [x] `frontend/src/entities/*/model.ts`에 프론트 타입을 작성한다.
- [x] 백엔드 스키마와 프론트 타입의 필드명이 일치하는지 점검한다.

## 3. Mock 기반 백엔드

- [ ] `data/samples/`에 시장, 섹터, 종목, 뉴스 샘플 JSON을 만든다.
- [ ] `backend/app/repositories/cache_repository.py` 또는 sample repository 역할을 정한다.
- [ ] `GET /api/market/summary` mock 응답을 만든다.
- [ ] `GET /api/sectors/{sectorId}` mock 응답을 만든다.
- [ ] `GET /api/stocks/{stockCode}/overview` mock 응답을 만든다.
- [ ] `GET /api/news` mock 응답을 만든다.
- [ ] FastAPI 실행 진입점과 라우터 등록을 완료한다.

## 4. 규칙 엔진 1차 연결

- [ ] `skills/data_rules.md` 기준으로 필수 데이터와 결측 처리 규칙을 정리한다.
- [ ] `backend/app/domains/rules/indicator_rules.py`에 핵심 지표 계산을 구현한다.
- [ ] 등락률, 거래대금, 거래량 증가율, 섹터 평균 등락률 계산 테스트를 작성한다.
- [ ] `backend/app/domains/rules/insight_rules.py`에 레벨별 인사이트 선택 규칙을 구현한다.
- [ ] 투자 추천 표현을 막는 문구 정책을 인사이트 생성 단계에 반영한다.

## 5. 프론트엔드 화면 이식

- [ ] React/Vite/TypeScript 프로젝트 설정을 `frontend/`에 추가한다.
- [ ] API 클라이언트 구조를 `frontend/src/services/marketApi.ts`에 만든다.
- [ ] 선택 상태 모델을 `frontend/src/shared/state/selectionStore.ts`에 구현한다.
- [ ] `MarketMap`에서 시장 > 섹터 > 종목 클릭 흐름을 만든다.
- [ ] `InsightPanel`을 선택 레벨에 따라 갱신되게 만든다.
- [ ] `NewsDock`을 선택 상태별 뉴스/공시로 갱신되게 만든다.
- [ ] `StockOverview`에 KPI, 차트, 관련 뉴스/공시 영역을 만든다.
- [ ] 기존 `legacy/static-prototype/`에서 필요한 시각적 방향만 선별 반영한다.

## 6. 시각화 구현

- [ ] 시장맵 크기 기준을 시가총액/거래대금으로 전환할 수 있게 만든다.
- [ ] 시장맵 색상 기준을 등락률/변동성으로 전환할 수 있게 만든다.
- [ ] 섹터 클릭 시 섹터 내부 종목맵으로 전환한다.
- [ ] 종목 클릭 시 Overview로 진입한다.
- [ ] 차트 기간 선택 `1D / 1W / 1M / 3M / 1Y`를 만든다.
- [ ] 데이터 결측, 뉴스 없음, 차트 없음 상태를 UI에서 처리한다.

## 7. 실제 데이터 어댑터

- [ ] 한국투자증권 OpenAPI 인증 설정 방식을 정한다.
- [ ] `backend/app/repositories/kis_client.py`에 현재가/거래량 조회 어댑터를 만든다.
- [ ] KRX 또는 수동 마스터 데이터로 종목-섹터 매핑을 만든다.
- [ ] KIND/DART 공시 어댑터 후보를 정한다.
- [ ] 뉴스 데이터 소스 후보를 정한다.
- [ ] 외부 API 실패 시 mock 또는 cache fallback 정책을 정한다.

## 8. 검증과 품질

- [ ] 백엔드 지표 계산 테스트를 작성한다.
- [ ] API 응답 계약 테스트를 작성한다.
- [ ] 프론트 컴포넌트 렌더링 테스트를 작성한다.
- [ ] Playwright로 시장 > 섹터 > 종목 Overview 흐름을 점검한다.
- [ ] 모바일/데스크톱 레이아웃에서 텍스트 겹침을 확인한다.
- [ ] 화면에 `mock`, `test`, 내부 규칙명 같은 구현 문구가 노출되지 않는지 확인한다.

## 9. 배포 준비

- [ ] `frontend/.env.example`을 만든다.
- [ ] `backend/.env.example`을 만든다.
- [ ] 개발 실행 명령을 루트 README에 정리한다.
- [ ] 프론트 배포 후보를 정한다.
- [ ] 백엔드 배포 후보를 정한다.
- [ ] API 키와 민감정보 관리 방식을 문서화한다.

## 당장 다음 작업

- [x] `shared/contracts/api-contract.md`에 MVP 응답 예시 JSON을 먼저 작성한다.
- [ ] `data/samples/`에 계약에 맞는 샘플 데이터를 만든다.
- [ ] mock FastAPI 라우터를 붙여 프론트가 의존할 API 표면을 고정한다.
