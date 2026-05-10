# React 마이그레이션

프론트엔드는 기존 정적 프로토타입에서 React + TypeScript + Vite 앱으로 마이그레이션되었습니다.

## 기준 소스

- 공식 프론트엔드: `frontend/`
- 참고용 프로토타입: `legacy/static-prototype/`

`legacy/static-prototype/`는 시각 방향과 인터랙션 참고용으로만 보존합니다. 새 앱에서 import하거나 직접 복사하지 않습니다.

## 마이그레이션된 기능

- 시장 대시보드 기본 레이아웃
- 전체 시장맵
- 섹터 클릭 후 섹터 내부 종목맵 전환
- 종목 클릭 후 종목 Overview 진입
- 선택 상태에 따라 바뀌는 인사이트 패널
- 선택 상태에 따라 바뀌는 뉴스/공시 바
- KPI 카드
- 가격/거래량 차트
- 데이터 없음, 뉴스 없음, 차트 없음 상태 처리
- 라이트/다크 모드 전환

## 실행 구조

React 앱은 Vite proxy를 통해 FastAPI 백엔드를 호출합니다.

```text
frontend :5174 -> /api -> backend :8001
```

사용 중인 백엔드 엔드포인트:

- `GET /api/market/summary`
- `GET /api/sectors/{sector_id}`
- `GET /api/stocks/{stock_code}/overview`
- `GET /api/news`

## 마이그레이션 규칙

- API 필드명은 `shared/contracts/` 문서와 맞춥니다.
- 지표 계산은 프론트에서 하지 않고 `backend/app/domains/rules/`에 둡니다.
- React 컴포넌트는 화면 렌더링과 사용자 상호작용에 집중합니다.
- 레거시 정적 파일은 새 React 앱에서 import하지 않습니다.
- 사용자 화면에는 `mock`, `test`, `prompt`, `rule engine` 같은 내부 구현 용어를 노출하지 않습니다.

## 검증 명령

```powershell
python -m unittest discover backend/tests
cd frontend
npm.cmd run build
```
