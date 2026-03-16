# 생성형 AI 연수용 강의자료 사이트 PRD

## 제품 목적
- 교사 대상 생성형 AI 연수에서 강사가 보여 주고, 수강생이 따라 하며, 프롬프트를 복사하고, 예시와 자료를 내려받는 정적 콘텐츠 사이트를 만든다.
- 상호작용, 제출, 공유는 사이트 밖의 Padlet로 분리한다.

## 실제 세션 반영 정보
- 연수 제목: 생성형 AI를 활용한 칼퇴하기
- 일시: 2026-03-18
- 장소: 의랑초등학교
- 강사: 반곡초 황도연

## 핵심 원칙
- 정적 사이트 우선
- 로그인, 회원가입, DB, 백엔드, 관리자 기능 없음
- 모바일과 프로젝터 모두 고려
- 프롬프트 복사와 외부 도구 이동을 최소 클릭으로 제공
- 다른 학교 연수에서도 세션 데이터만 교체해 재사용 가능

## 라우팅 구조
- `/`
- `/today`
- `/course/generative-ai`
- `/modules/[slug]`
- `/prompts`
- `/prompts/[slug]`
- `/examples`
- `/resources`
- `/guide`

## 데이터 구조
### session/current
- `trainingTitle`
- `schoolName`
- `date`
- `instructor`
- `notices[]`
- `padletUrl`
- `featuredModules[]`

### modules
- `title`
- `slug`
- `summary`
- `tool`
- `order`
- `difficulty`
- `estimatedTime`
- `goal`
- `externalLinks[]`
- `prompts[]`
- `examples[]`
- `resources[]`
- `padletCtaText`
- `preparations[]`
- `steps[]`
- `blockers[]`

### prompts
- `title`
- `slug`
- `category`
- `tags[]`
- `body`
- `variables[]`
- `exampleUse`
- `relatedTool`

## 구현 메모
- 현재 워크스페이스가 Vite + React 기반이라 프로토타입은 정적 React SPA로 구현한다.
- 깊은 경로 직접 접속을 안정적으로 지원하려면 정적 호스팅 환경에 SPA fallback 설정이 필요하다.
- 접근 가능한 Padlet PDF는 자료실 샘플 다운로드로 포함했다.
