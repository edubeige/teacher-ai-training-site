# Teacher AI Training Site

교사 대상 생성형 AI 연수용 정적 사이트 프로젝트입니다.

## 실행
```bash
npm install
npm run dev
```

## 테스트와 빌드
```bash
npm run test:run
npm run build
```

## GitHub Pages 배포
이 프로젝트는 `github.io` 환경을 기준으로 맞춰 두었습니다.

1. 이 폴더 내용만 새 GitHub 저장소에 올립니다.
2. 기본 브랜치를 `main`으로 둡니다.
3. GitHub 저장소의 `Settings > Pages`에서 `Source`를 `GitHub Actions`로 설정합니다.
4. `main` 브랜치에 푸시하면 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)로 자동 배포됩니다.

## 링크 형식
- 홈: `https://계정명.github.io/저장소명/`
- 오늘 연수: `https://계정명.github.io/저장소명/#/today`
- 프롬프트 허브: `https://계정명.github.io/저장소명/#/prompts`

GitHub Pages는 SPA 새로고침이 약해서, 이 프로젝트는 `github.io`에서 해시 라우팅을 사용합니다.  
실수로 `.../today`처럼 직접 들어가도 [public/404.html](./public/404.html)이 `#/today` 형태로 돌려보내도록 넣어 두었습니다.
