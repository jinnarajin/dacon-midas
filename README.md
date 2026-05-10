# Market Cloud

Market Cloud는 국내 주식 시장 흐름을 시장 > 섹터 > 종목 Overview 순서로 탐색하는 투자 정보 대시보드입니다.

프론트엔드는 React + TypeScript + Vite로 마이그레이션되었습니다. 기존 정적 프로토타입은 `legacy/static-prototype/`에 참고용으로만 보존합니다.

## 현재 구성

- 프론트엔드: React, TypeScript, Vite
- 백엔드: FastAPI
- 데이터: `data/samples/`의 계약 기반 샘플 JSON
- 화면 흐름: 시장맵 -> 섹터맵 -> 종목 Overview
- 테마: 라이트/다크 모드 지원

## 로컬 실행

백엔드 실행:

```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8001
```

프론트엔드 실행:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5174
```

브라우저에서 열기:

```text
http://127.0.0.1:5174
```

## 검증

백엔드 테스트:

```powershell
python -m unittest discover backend/tests
```

프론트엔드 빌드:

```powershell
cd frontend
npm.cmd run build
```

## 주요 경로

- `frontend/`: 공식 React 프론트엔드
- `backend/`: FastAPI 백엔드와 규칙 로직
- `shared/contracts/`: API 계약 문서
- `data/samples/`: 샘플 응답 데이터
- `legacy/static-prototype/`: 기존 정적 프로토타입, 참고용
- `Todo.md`: 구현 체크리스트
