# Market Cloud Frontend

Market Cloud의 공식 React 프론트엔드입니다.

## 기술 스택

- React
- TypeScript
- Vite
- 전역 스타일: `src/styles/app.css`

## 개발 실행

프론트엔드는 FastAPI 백엔드가 `8001` 포트에서 실행 중이라고 가정합니다.

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

Vite는 `/api` 요청을 다음 백엔드로 프록시합니다.

```text
http://127.0.0.1:8001
```

## 빌드

```powershell
npm.cmd run build
```

## 소스 구조

- `src/app/`: 앱 shell과 최상위 상태 연결
- `src/entities/`: TypeScript API 모델
- `src/features/market-map/`: 시장맵과 섹터맵
- `src/features/insights/`: 인사이트 패널
- `src/features/news-feed/`: 뉴스/공시 바
- `src/features/stock-overview/`: 종목 Overview, KPI, 차트
- `src/services/`: API 클라이언트
- `src/shared/`: 포맷터와 선택 상태 유틸
- `src/styles/`: 전역 앱 스타일과 라이트/다크 테마

## 마이그레이션 메모

`legacy/static-prototype/`는 참고용입니다. 새 React 앱에서 import하지 않습니다.
