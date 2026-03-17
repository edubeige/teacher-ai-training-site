import type { CurrentSession, ExampleItem, ModuleItem, PromptItem, ResourceItem } from './types'

export const toolLinkMap = {
  gemini: {
    title: 'Gemini',
    description: '이미지 생성, 글쓰기, 프롬프트 실습에 가장 먼저 엽니다.',
    url: 'https://gemini.google.com',
  },
  grok: {
    title: 'Grok',
    description: '짧은 영상 생성 흐름을 실습할 때 엽니다.',
    url: 'https://grok.com',
  },
  padlet: {
    title: 'Padlet',
    description: '현장 결과물 공유와 체크인만 여기서 진행합니다.',
    url: 'https://padlet.com',
  },
} as const

export const currentSession: CurrentSession = {
  trainingTitle: '생성형 AI로 이미지, 영상, 글쓰기까지 빠르게 만들기',
  schoolName: '의랑초등학교',
  date: '2026-03-18',
  instructor: '반곡초 황도연',
  notices: [
    '이 사이트는 설명과 프롬프트 복사 전용입니다.',
    '결과 공유와 업로드는 Padlet에서만 진행합니다.',
    'Grok 영상 생성은 대기 시간이 있어 글쓰기 실습과 번갈아 진행합니다.',
  ],
  padletUrl: 'https://padlet.com',
  featuredModules: [
    'orientation-and-tool-setup',
    'prompt-basics',
    'gemini-image-lab',
    'grok-video-lab',
    'ai-writing-lab',
  ],
  quickStartSteps: [
    'Gemini와 Grok 로그인 상태를 먼저 확인하세요.',
    '오늘 핵심 흐름을 읽고 첫 모듈부터 순서대로 여세요.',
    '프롬프트는 복사 후 바로 도구 입력창에 붙여 넣으세요.',
  ],
  mustOpenTools: ['Gemini', 'Grok', 'Padlet'],
  supportNotes: [
    '복사가 안 되면 본문을 직접 선택해 붙여 넣어도 됩니다.',
    '결과가 길면 항목 수를 줄여 달라고 다시 요청하세요.',
    '영상 생성이 오래 걸리면 글쓰기 모듈을 먼저 진행하세요.',
  ],
  agendaTitle: '오늘 핵심 흐름',
  primaryAction: '첫 모듈 시작',
  secondaryAction: '프롬프트 허브 열기',
}

export const prompts: PromptItem[] = [
  {
    title: '막연한 요청을 실습용 프롬프트로 바꾸기',
    slug: 'prompt-refiner-basic',
    category: '프롬프트 개선',
    tags: ['기초', '프롬프트', '업그레이드'],
    body: `다음 요청을 초등학교 교사 연수 실습용 프롬프트로 바꿔 줘.
요청: "{{request}}"

조건:
- 역할을 먼저 적기
- 목표를 한 문장으로 적기
- 출력 형식을 번호 목록으로 고정하기
- 초보 교사도 바로 복사해 쓸 수 있게 짧게 쓰기
- 마지막에 "이 프롬프트가 좋아진 이유"를 3줄로 설명하기`,
    variables: [
      { key: 'request', label: '원래 요청', placeholder: '예: 수업 아이디어 줘', defaultValue: '수업 아이디어 줘' },
    ],
    exampleUse: '막연한 질문을 바로 실습 가능한 프롬프트로 바꾸고 싶을 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 입력창에 바로 붙여 넣습니다.',
    expectedOutput: '역할, 목표, 출력 형식이 분명한 프롬프트 초안과 수정 이유를 받습니다.',
    difficulty: '입문',
    useCase: '프롬프트 설계 시작',
    outputFormat: '번호 목록 + 짧은 설명',
  },
  {
    title: 'Gemini 이미지 생성 프롬프트',
    slug: 'gemini-image-prompt',
    category: 'Gemini 이미지 생성',
    tags: ['Gemini', '이미지', '포스터'],
    body: `너는 초등학교 수업용 이미지를 설계하는 도우미야.
주제는 "{{topic}}"이고 대상은 {{grade}} 학생이야.

다음 조건을 포함한 이미지 생성 프롬프트를 작성해 줘.
1. 장면 설명
2. 구도와 시점
3. 색감과 분위기
4. 텍스트를 넣지 말아야 한다는 조건
5. 교실에서 활용하는 방법 2가지

스타일은 "{{tone}}"으로 맞춰 줘.`,
    variables: [
      { key: 'topic', label: '주제', placeholder: '예: 봄 식물의 한살이', defaultValue: '봄 식물의 한살이' },
      { key: 'grade', label: '학년', placeholder: '예: 3학년', defaultValue: '3학년' },
      { key: 'tone', label: '분위기', placeholder: '예: 밝고 선명하게', defaultValue: '밝고 선명하게' },
    ],
    exampleUse: 'Gemini에서 수업용 시각 자료 이미지를 만들기 전에 프롬프트를 정리할 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 이미지 생성 입력창에 붙여 넣습니다.',
    expectedOutput: '장면, 구도, 분위기, 금지 요소가 정리된 이미지 프롬프트를 받습니다.',
    difficulty: '기초',
    useCase: '수업용 이미지 제작',
    outputFormat: '이미지 생성 프롬프트',
  },
  {
    title: 'Grok 영상 생성용 장면 설계 프롬프트',
    slug: 'grok-video-scene-builder',
    category: 'Grok 영상 생성',
    tags: ['Grok', '영상', '스토리보드'],
    body: `다음 주제로 8초 안팎의 짧은 영상을 만들고 싶어.
주제: "{{topic}}"

아래 형식으로 작성해 줘.
1. 영상 한 줄 콘셉트
2. 시작 장면
3. 중간 움직임
4. 마지막 장면
5. 카메라 느낌
6. 피해야 할 요소

조건:
- 장면은 단순하고 선명하게
- 인물 수는 너무 많지 않게
- 교실에서 보여 주기 좋은 분위기로 작성`,
    variables: [
      { key: 'topic', label: '영상 주제', placeholder: '예: 우주 탐험 출발 장면', defaultValue: '우주 탐험 출발 장면' },
    ],
    exampleUse: 'Grok에서 바로 영상 생성을 시도하기 전에 장면 흐름을 정리할 때 사용합니다.',
    relatedTool: 'Grok',
    whereToUse: 'Grok 영상 생성 프롬프트 입력창에 붙여 넣습니다.',
    expectedOutput: '짧은 영상에 맞는 장면 구성과 카메라 설명이 포함된 프롬프트를 받습니다.',
    difficulty: '응용',
    useCase: '짧은 영상 생성',
    outputFormat: '장면 목록 + 촬영 느낌',
  },
  {
    title: 'AI 글쓰기 초안 만들기',
    slug: 'ai-writing-draft',
    category: 'AI 글쓰기',
    tags: ['글쓰기', '초안', '문장'],
    body: `너는 초등학교 교사 글쓰기 도우미야.
주제는 "{{topic}}"이고 독자는 "{{audience}}"이야.

다음 형식으로 글 초안을 써 줘.
1. 제목
2. 핵심 내용 3문단
3. 마지막 정리 문장

조건:
- 문장은 짧게
- 바로 읽히는 표현 사용
- 너무 딱딱하지 않게 "{{tone}}" 톤 유지`,
    variables: [
      { key: 'topic', label: '글 주제', placeholder: '예: 학급 프로젝트 안내', defaultValue: '학급 프로젝트 안내' },
      { key: 'audience', label: '독자', placeholder: '예: 학부모', defaultValue: '학부모' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 분명하게', defaultValue: '친절하고 분명하게' },
    ],
    exampleUse: '가정통신문, 안내문, 설명글 초안을 빠르게 만들 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 글쓰기 입력창에 붙여 넣습니다.',
    expectedOutput: '바로 수정 가능한 짧은 초안과 제목을 받습니다.',
    difficulty: '입문',
    useCase: '공지와 안내문 초안',
    outputFormat: '제목 + 3문단',
  },
  {
    title: '가정통신문과 공지 문장 다듬기',
    slug: 'communication-polisher',
    category: '문장 다듬기',
    tags: ['안내문', '가정통신문', '다듬기'],
    body: `다음 안내문을 더 읽기 쉽게 다듬어 줘.
주제: "{{topic}}"
대상: {{grade}} 학부모

조건:
- 핵심 정보가 먼저 보이게
- 문장을 짧게
- 준비물, 일정, 주의사항을 소제목으로 정리
- 마지막에 문자 메시지용 2문장 요약 추가
- 톤은 "{{tone}}"으로 유지`,
    variables: [
      { key: 'topic', label: '안내 주제', placeholder: '예: 현장체험학습', defaultValue: '현장체험학습' },
      { key: 'grade', label: '학년', placeholder: '예: 4학년', defaultValue: '4학년' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 분명하게', defaultValue: '친절하고 분명하게' },
    ],
    exampleUse: '기존 공지문을 더 짧고 읽기 쉽게 다듬고 싶을 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 입력창에 붙여 넣고 기존 안내문과 함께 사용합니다.',
    expectedOutput: '소제목이 살아 있는 읽기 쉬운 공지문과 문자 요약을 받습니다.',
    difficulty: '기초',
    useCase: '안내문 다듬기',
    outputFormat: '소제목 구조 + 문자 요약',
  },
]

export const examples: ExampleItem[] = [
  {
    title: 'Gemini 수업용 이미지 예시',
    slug: 'gemini-class-image',
    tool: 'Gemini',
    image: '/examples/projector-lesson-slide.svg',
    description: '주제, 구도, 분위기를 분명히 적었을 때 나오는 수업용 이미지 결과 예시입니다.',
    relatedPrompt: 'gemini-image-prompt',
    useCase: '이미지 결과',
  },
  {
    title: 'Grok 영상 장면 설계 예시',
    slug: 'grok-video-storyboard',
    tool: 'Grok',
    image: '/examples/canva-prd-card.svg',
    description: '영상 생성 전에 장면 흐름을 먼저 정리한 스토리보드형 예시입니다.',
    relatedPrompt: 'grok-video-scene-builder',
    useCase: '영상 기획',
  },
  {
    title: 'AI 글쓰기 초안 예시',
    slug: 'ai-writing-sample',
    tool: 'Gemini',
    image: '/examples/lesson-plan-draft.svg',
    description: '짧은 제목과 3문단 구조로 정리한 공지문 초안 예시입니다.',
    relatedPrompt: 'ai-writing-draft',
    useCase: '글쓰기 결과',
  },
]

export const resources: ResourceItem[] = [
  {
    title: '의랑초등학교 생성형 AI 연수 교안',
    type: 'PDF',
    url: '/downloads/uirang-ai-training-20260318.pdf',
    downloadable: true,
    category: '오늘자료',
  },
  {
    title: '이미지 생성 Padlet 아카이브',
    type: 'PDF',
    url: '/downloads/padlet-image-generation-20260207.pdf',
    downloadable: true,
    category: '참고자료',
  },
  {
    title: 'Gemini 공식 사이트',
    type: '링크',
    url: 'https://gemini.google.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'Grok',
    type: '링크',
    url: 'https://grok.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'Padlet',
    type: '링크',
    url: 'https://padlet.com',
    downloadable: false,
    category: '공유공간',
  },
  {
    title: '문제 해결 안내',
    type: '문서',
    url: '/guide',
    downloadable: false,
    category: '도움말',
  },
]

export const courseModules: ModuleItem[] = [
  {
    title: '도구 열기와 연수 흐름 잡기',
    slug: 'orientation-and-tool-setup',
    summary: '오늘 쓸 도구를 열고, 연수 흐름과 사이트 역할을 가장 먼저 이해하는 시작 모듈입니다.',
    tool: 'Gemini / Grok / Padlet',
    order: 1,
    difficulty: '입문',
    estimatedTime: '15분',
    goal: '로그인과 도구 준비를 빠르게 끝내고 실습 흐름을 잡는다.',
    externalLinks: [
      { label: 'Gemini', url: 'https://gemini.google.com', description: '이미지와 글쓰기 실습에 사용' },
      { label: 'Grok', url: 'https://grok.com', description: '영상 생성 실습에 사용' },
      { label: 'Padlet', url: 'https://padlet.com', description: '결과 공유용 외부 링크' },
    ],
    prompts: ['prompt-refiner-basic'],
    examples: ['ai-writing-sample'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Gemini 공식 사이트', 'Grok', 'Padlet', '문제 해결 안내'],
    padletCtaText: '출석과 체크인을 Padlet에 남기기',
    preparations: ['Gemini와 Grok 로그인 상태 확인', '브라우저 새 탭 준비', 'Padlet 링크 열어 두기'],
    steps: [
      { title: '사이트와 Padlet 역할 나누기', description: '이 사이트는 설명과 복사 전용, Padlet은 공유 전용이라고 먼저 안내합니다.' },
      { title: 'Gemini 열기', description: 'Gemini 탭을 열고 이미지 생성과 글쓰기 입력이 가능한 상태인지 확인합니다.' },
      { title: 'Grok 열기', description: 'Grok 탭을 열고 영상 생성 화면까지 들어갈 수 있는지 확인합니다.' },
      { title: '오늘 순서 보여 주기', description: '오늘 연수 페이지에서 실습 순서를 먼저 보여 주고 첫 모듈로 이동합니다.' },
    ],
    blockers: [
      { question: '도구가 안 열립니다.', answer: '로그인 상태를 먼저 보고, 학교망이 막히면 모바일 데이터나 대체 기기를 준비합니다.' },
      { question: '공유 위치를 헷갈립니다.', answer: '결과물 공유는 이 사이트가 아니라 Padlet에서만 한다고 다시 안내합니다.' },
    ],
    expectedOutcome: '모든 수강생이 Gemini와 Grok을 열고 오늘 흐름을 이해합니다.',
    quickWin: '첫 10분 안에 탭과 계정을 안정화하면 이후 질문이 크게 줄어듭니다.',
    commonMistake: '이 사이트 안에서 업로드나 제출을 찾다가 시간이 지체됩니다.',
    fallbackAction: 'Grok이 막히면 Gemini 프롬프트와 글쓰기 실습부터 먼저 진행합니다.',
    primaryToolUrl: 'https://gemini.google.com',
  },
  {
    title: '프롬프트 바꾸기 기초',
    slug: 'prompt-basics',
    summary: '막연한 요청을 역할, 목표, 출력 형식이 있는 프롬프트로 바꾸는 연습을 합니다.',
    tool: 'Gemini',
    order: 2,
    difficulty: '입문',
    estimatedTime: '20분',
    goal: '복사해 바로 쓸 수 있는 기본 프롬프트 구조를 익힌다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '프롬프트 개선 실습용 기본 도구' }],
    prompts: ['prompt-refiner-basic'],
    examples: ['ai-writing-sample'],
    resources: ['Gemini 공식 사이트', '문제 해결 안내'],
    padletCtaText: '내가 바꾼 프롬프트를 Padlet에 올리기',
    preparations: ['막연한 요청 한 문장 준비', 'Gemini 입력창 열기'],
    steps: [
      { title: '원래 요청 적기', description: '“수업 아이디어 줘”처럼 넓은 질문을 하나 씁니다.' },
      { title: '프롬프트 업그레이드 돌리기', description: '기본 프롬프트 개선 카드를 Gemini에 붙여 넣습니다.' },
      { title: '좋아진 점 비교하기', description: '역할, 목표, 출력 형식이 들어간 결과를 원래 요청과 비교합니다.' },
      { title: '내 주제에 맞게 한 번 더 수정하기', description: '학년, 과목, 주제를 넣어 더 현장형으로 바꿉니다.' },
    ],
    blockers: [
      { question: '답이 너무 깁니다.', answer: '항목 수를 3개로 줄여 달라고 다시 요청하세요.' },
      { question: '너무 일반적입니다.', answer: '학년, 과목, 상황을 한 줄 더 넣으면 훨씬 구체적으로 바뀝니다.' },
    ],
    expectedOutcome: '막연한 질문이 구조화된 실습용 프롬프트로 바뀝니다.',
    quickWin: '역할과 출력 형식만 넣어도 결과가 바로 달라집니다.',
    commonMistake: '질문만 바꾸고 출력 형식 조건은 빼먹는 경우가 많습니다.',
    fallbackAction: '예시 프롬프트를 그대로 복사한 뒤 주제만 바꾸어 먼저 사용합니다.',
    primaryToolUrl: 'https://gemini.google.com',
  },
  {
    title: 'Gemini 이미지 생성 실습',
    slug: 'gemini-image-lab',
    summary: '수업용 이미지와 안내 자료용 장면을 Gemini로 만들어 보는 실습입니다.',
    tool: 'Gemini',
    order: 3,
    difficulty: '기초',
    estimatedTime: '25분',
    goal: '교실에서 바로 보여 줄 수 있는 이미지 한 장을 만든다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '이미지 생성 실습' }],
    prompts: ['gemini-image-prompt'],
    examples: ['gemini-class-image'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', '이미지 생성 Padlet 아카이브', 'Gemini 공식 사이트'],
    padletCtaText: '완성한 이미지를 Padlet에 공유하기',
    preparations: ['주제 하나 정하기', 'Gemini 이미지 생성 화면 열기'],
    steps: [
      { title: '주제 정하기', description: '수업 장면, 학교 행사, 교실 규칙 중 하나를 정합니다.' },
      { title: '이미지 프롬프트 만들기', description: '장면, 구도, 분위기, 피해야 할 요소가 들어간 프롬프트를 만듭니다.' },
      { title: 'Gemini에 붙여 넣기', description: '이미지 생성용 프롬프트를 입력하고 결과를 확인합니다.' },
      { title: '교실용으로 다시 다듬기', description: '텍스트가 많으면 제거하고, 장면을 더 단순하게 다시 요청합니다.' },
    ],
    blockers: [
      { question: '결과가 너무 복잡합니다.', answer: '인물 수를 줄이고 장면을 한 가지로 좁혀 달라고 요청하세요.' },
      { question: '텍스트가 섞여 나옵니다.', answer: '이미지 안에 글자를 넣지 말라고 분명히 적으세요.' },
    ],
    expectedOutcome: '프로젝터에서 보여 줄 수 있는 수업용 이미지 한 장을 완성합니다.',
    quickWin: '장면 하나, 느낌 하나만 남기면 결과가 빠르게 정돈됩니다.',
    commonMistake: '설명하고 싶은 내용을 한 번에 너무 많이 넣습니다.',
    fallbackAction: '이미지가 마음에 들지 않으면 장면 설명만 더 짧게 줄여 다시 생성합니다.',
    primaryToolUrl: 'https://gemini.google.com',
  },
  {
    title: 'Grok 영상 생성 실습',
    slug: 'grok-video-lab',
    summary: '짧은 영상 생성을 위해 장면 흐름을 먼저 설계하고 Grok으로 결과를 만들어 보는 모듈입니다.',
    tool: 'Grok',
    order: 4,
    difficulty: '응용',
    estimatedTime: '25분',
    goal: '8초 안팎의 짧은 영상 프롬프트 흐름을 익힌다.',
    externalLinks: [{ label: 'Grok', url: 'https://grok.com', description: '영상 생성 실습' }],
    prompts: ['grok-video-scene-builder'],
    examples: ['grok-video-storyboard'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Grok'],
    padletCtaText: '영상 결과나 장면 설계를 Padlet에 남기기',
    preparations: ['Grok 영상 생성 화면 열기', '짧은 영상 주제 하나 정하기'],
    steps: [
      { title: '주제 한 줄 정하기', description: '영상으로 보여 주고 싶은 장면을 한 줄로 적습니다.' },
      { title: '장면 흐름 만들기', description: '시작, 중간, 마지막 장면이 있는 프롬프트를 만듭니다.' },
      { title: 'Grok에 넣고 생성 시작하기', description: '프롬프트를 붙여 넣고 먼저 생성 버튼을 눌러 둡니다.' },
      { title: '기다리는 동안 글쓰기 모듈 보기', description: '영상 대기 시간에는 다음 글쓰기 실습을 먼저 진행합니다.' },
      { title: '결과 다시 확인하고 수정하기', description: '장면이 복잡하면 카메라 느낌과 인물 수를 더 단순하게 조정합니다.' },
    ],
    blockers: [
      { question: '생성이 오래 걸립니다.', answer: '영상은 먼저 생성 시작만 하고, 대기 시간에는 다른 실습을 병행하세요.' },
      { question: '장면이 너무 산만합니다.', answer: '시작-중간-끝 중 한 장면을 줄이고 움직임을 한 가지로 좁히세요.' },
    ],
    expectedOutcome: '짧은 영상에 맞는 장면 설계와 수정 흐름을 익힙니다.',
    quickWin: '영상을 바로 길게 설명하지 말고 3장면 구조로 나누면 훨씬 쉬워집니다.',
    commonMistake: '너무 긴 이야기와 너무 많은 장면을 한 번에 넣습니다.',
    fallbackAction: '영상 생성이 어렵다면 장면 설계 프롬프트만 완성해도 오늘 목표는 충분합니다.',
    primaryToolUrl: 'https://grok.com',
    waitNote: '영상 생성은 대기 시간이 있어 시작 후 다른 실습을 먼저 진행해도 됩니다.',
  },
  {
    title: 'AI 글쓰기와 문장 다듬기',
    slug: 'ai-writing-lab',
    summary: '공지문, 안내문, 가정통신문 같은 글을 더 빨리 쓰고 읽기 쉽게 다듬는 실습입니다.',
    tool: 'Gemini',
    order: 5,
    difficulty: '입문',
    estimatedTime: '20분',
    goal: '바로 수정 가능한 글 초안과 다듬기 흐름을 익힌다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '글쓰기와 문장 다듬기 실습' }],
    prompts: ['ai-writing-draft', 'communication-polisher'],
    examples: ['ai-writing-sample'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Gemini 공식 사이트', '문제 해결 안내'],
    padletCtaText: '내가 고친 글 초안을 Padlet에 공유하기',
    preparations: ['공지 주제 하나 정하기', '기존 안내문이 있으면 같이 준비하기'],
    steps: [
      { title: '초안 먼저 만들기', description: '주제와 독자를 넣고 짧은 초안을 먼저 받습니다.' },
      { title: '읽기 쉽게 다듬기', description: '소제목, 일정, 준비물, 주의사항이 보이도록 다시 요청합니다.' },
      { title: '문자 메시지 요약 만들기', description: '마지막에 2문장 요약을 추가해 실전 활용도를 높입니다.' },
      { title: '내 문체로 한 번 더 수정하기', description: '너무 딱딱하면 톤을 부드럽게, 너무 길면 더 짧게 바꿉니다.' },
    ],
    blockers: [
      { question: '문장이 너무 딱딱합니다.', answer: '친절하고 분명하게, 쉬운 말 중심으로 써 달라고 다시 요청하세요.' },
      { question: '핵심이 뒤에 갑니다.', answer: '가장 중요한 일정과 준비물을 먼저 보여 달라고 적으세요.' },
    ],
    expectedOutcome: '짧고 읽기 쉬운 공지문이나 안내문 초안을 완성합니다.',
    quickWin: '제목과 첫 문장만 좋아져도 전체 글이 훨씬 읽기 쉬워집니다.',
    commonMistake: '설명은 길게 적고 독자 정보는 빼먹습니다.',
    fallbackAction: '기존 글이 있으면 새로 쓰기보다 다듬기 프롬프트부터 먼저 사용합니다.',
    primaryToolUrl: 'https://gemini.google.com',
  },
].sort((left, right) => left.order - right.order)

export const promptMap = new Map(prompts.map((item) => [item.slug, item]))
export const exampleMap = new Map(examples.map((item) => [item.slug, item]))
export const resourceMap = new Map(resources.map((item) => [item.title, item]))
