import type { CurrentSession, ExampleItem, ModuleItem, PromptItem, ResourceItem } from './types'

export const toolLinkMap = {
  gemini: {
    title: 'Gemini',
    description: '이미지 생성과 글쓰기 실습에 사용합니다.',
    url: 'https://gemini.google.com',
  },
  grok: {
    title: 'Grok',
    description: '짧은 영상 생성 실습에 사용합니다.',
    url: 'https://grok.com',
  },
  padlet: {
    title: 'Padlet',
    description: '결과 공유와 체크인만 여기서 진행합니다.',
    url: 'https://padlet.com',
  },
} as const

export const currentSession: CurrentSession = {
  trainingTitle: '생성형 AI로 이미지, 영상, 글쓰기까지 따라해 보기',
  schoolName: '의랑초등학교',
  date: '2026-03-18',
  instructor: '반곡초 황도연',
  notices: [
    '이 사이트는 설명과 프롬프트 복사 전용입니다.',
    '결과 공유는 Padlet에서만 진행합니다.',
    'Grok 영상 생성은 기다리는 시간이 있어 다음 활동과 번갈아 진행합니다.',
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
    'Gemini와 Grok 로그인 상태를 확인합니다.',
    '1단계부터 순서대로 시작합니다.',
    '프롬프트는 복사해서 바로 붙여 넣습니다.',
  ],
  mustOpenTools: ['Gemini', 'Grok', 'Padlet'],
  supportNotes: [
    '복사가 안 되면 프롬프트 본문을 직접 선택해 붙여 넣어도 됩니다.',
    '결과가 길면 항목 수를 줄여 달라고 다시 요청하세요.',
    '영상이 오래 걸리면 글쓰기 단계로 먼저 넘어가도 됩니다.',
  ],
  agendaTitle: '오늘 연수에서 할 일',
  primaryAction: '1단계 시작하기',
  secondaryAction: '프롬프트 모음 보기',
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
- 초보자도 바로 따라 할 수 있게 짧게 쓰기
- 마지막에 "왜 좋아졌는지" 3줄 설명 추가`,
    variables: [
      { key: 'request', label: '원래 요청', placeholder: '예: 수업 아이디어 줘', defaultValue: '수업 아이디어 줘' },
    ],
    exampleUse: '막연한 요청을 더 좋은 프롬프트로 바꾸는 첫 연습입니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 입력창에 붙여 넣습니다.',
    expectedOutput: '역할, 목표, 출력 형식이 들어간 더 좋은 프롬프트 초안을 받습니다.',
    difficulty: '입문',
    useCase: '프롬프트 바꾸기',
    outputFormat: '번호 목록',
    clickPath: 'Gemini를 연 뒤 일반 입력창에 그대로 붙여 넣습니다.',
    afterPasteHint: '결과가 나오면 원래 요청과 나란히 비교해 보세요.',
    fixTip: '학년, 과목, 상황을 한 줄 더 넣으면 훨씬 구체적이 됩니다.',
  },
  {
    title: 'Gemini 이미지 생성 프롬프트',
    slug: 'gemini-image-prompt',
    category: 'Gemini 이미지',
    tags: ['Gemini', '이미지', '수업자료'],
    body: `너는 초등학교 수업용 이미지를 만드는 도우미야.
주제는 "{{topic}}"이고 대상은 {{grade}} 학생이야.

다음 조건을 포함한 이미지 생성 프롬프트를 작성해 줘.
1. 장면 설명
2. 구도와 시점
3. 색감과 분위기
4. 이미지 안에 글자를 넣지 말기
5. 교실에서 활용하는 방법 2가지

스타일은 "{{tone}}"으로 맞춰 줘.`,
    variables: [
      { key: 'topic', label: '주제', placeholder: '예: 물의 순환', defaultValue: '물의 순환' },
      { key: 'grade', label: '학년', placeholder: '예: 4학년', defaultValue: '4학년' },
      { key: 'tone', label: '분위기', placeholder: '예: 밝고 선명하게', defaultValue: '밝고 선명하게' },
    ],
    exampleUse: 'Gemini에서 수업용 이미지를 만들기 전에 사용하는 프롬프트입니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 이미지 생성 입력창에 붙여 넣습니다.',
    expectedOutput: '장면, 구도, 분위기, 금지 요소가 정리된 이미지 프롬프트를 받습니다.',
    difficulty: '기초',
    useCase: '이미지 생성',
    outputFormat: '이미지 생성 프롬프트',
    clickPath: 'Gemini를 연 뒤 이미지 생성 탭 또는 이미지 입력 영역으로 이동합니다.',
    afterPasteHint: '이미지 결과가 나오면 너무 복잡하지 않은지 먼저 확인하세요.',
    fixTip: '장면이 복잡하면 인물 수와 배경 요소를 줄여 달라고 다시 요청하세요.',
  },
  {
    title: 'Grok 영상 장면 설계 프롬프트',
    slug: 'grok-video-scene-builder',
    category: 'Grok 영상',
    tags: ['Grok', '영상', '장면설계'],
    body: `다음 주제로 짧은 영상을 만들고 싶어.
주제: "{{topic}}"

아래 형식으로 작성해 줘.
1. 영상 한 줄 콘셉트
2. 시작 장면
3. 중간 움직임
4. 마지막 장면
5. 카메라 느낌
6. 피해야 할 요소

조건:
- 8초 안팎의 짧은 영상
- 장면은 단순하고 선명하게
- 교실에서 보여 주기 좋은 분위기`,
    variables: [
      { key: 'topic', label: '영상 주제', placeholder: '예: 우주 여행 출발', defaultValue: '우주 여행 출발' },
    ],
    exampleUse: 'Grok 영상 생성 전에 장면 흐름을 먼저 정리할 때 씁니다.',
    relatedTool: 'Grok',
    whereToUse: 'Grok 영상 생성 입력창에 붙여 넣습니다.',
    expectedOutput: '짧은 영상에 맞는 장면 흐름과 카메라 설명을 받습니다.',
    difficulty: '응용',
    useCase: '영상 생성',
    outputFormat: '장면 목록',
    clickPath: 'Grok을 연 뒤 영상 생성 입력 영역으로 이동합니다.',
    afterPasteHint: '생성을 먼저 시작한 뒤 기다리는 동안 다음 활동으로 넘어가면 됩니다.',
    fixTip: '장면이 산만하면 시작, 중간, 끝 중 하나를 줄이세요.',
  },
  {
    title: 'AI 글쓰기 초안 만들기',
    slug: 'ai-writing-draft',
    category: 'AI 글쓰기',
    tags: ['글쓰기', '초안', '공지문'],
    body: `너는 초등학교 교사 글쓰기 도우미야.
주제는 "{{topic}}"이고 독자는 "{{audience}}"이야.

다음 형식으로 글 초안을 써 줘.
1. 제목
2. 핵심 내용 3문단
3. 마지막 정리 문장

조건:
- 문장은 짧게
- 바로 읽히는 표현 사용
- 톤은 "{{tone}}"으로 유지`,
    variables: [
      { key: 'topic', label: '글 주제', placeholder: '예: 프로젝트 안내', defaultValue: '프로젝트 안내' },
      { key: 'audience', label: '독자', placeholder: '예: 학부모', defaultValue: '학부모' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 분명하게', defaultValue: '친절하고 분명하게' },
    ],
    exampleUse: '공지문, 설명글, 가정통신문 초안을 빨리 만들 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 일반 입력창에 붙여 넣습니다.',
    expectedOutput: '바로 수정할 수 있는 짧은 글 초안을 받습니다.',
    difficulty: '입문',
    useCase: '글 초안 만들기',
    outputFormat: '제목 + 3문단',
    clickPath: 'Gemini를 연 뒤 글 입력창에 붙여 넣습니다.',
    afterPasteHint: '제목과 첫 문장이 마음에 드는지 먼저 확인하세요.',
    fixTip: '너무 길면 2문단으로 줄여 달라고 다시 요청하세요.',
  },
  {
    title: '공지문과 가정통신문 다듬기',
    slug: 'communication-polisher',
    category: 'AI 글쓰기',
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
      { key: 'topic', label: '안내 주제', placeholder: '예: 체험학습 안내', defaultValue: '체험학습 안내' },
      { key: 'grade', label: '학년', placeholder: '예: 3학년', defaultValue: '3학년' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 분명하게', defaultValue: '친절하고 분명하게' },
    ],
    exampleUse: '이미 있는 공지문을 더 읽기 쉽게 다듬고 싶을 때 씁니다.',
    relatedTool: 'Gemini',
    whereToUse: 'Gemini 입력창에 기존 안내문과 함께 붙여 넣습니다.',
    expectedOutput: '소제목이 있는 읽기 쉬운 공지문과 문자 요약을 받습니다.',
    difficulty: '기초',
    useCase: '문장 다듬기',
    outputFormat: '소제목 구조',
    clickPath: 'Gemini 일반 입력창에 기존 안내문과 함께 붙여 넣습니다.',
    afterPasteHint: '준비물과 일정이 맨 위에 잘 보이는지 확인하세요.',
    fixTip: '독자와 톤을 꼭 넣으면 글 분위기가 더 자연스러워집니다.',
  },
]

export const examples: ExampleItem[] = [
  {
    title: 'Gemini 수업 이미지 예시',
    slug: 'gemini-class-image',
    tool: 'Gemini',
    image: '/examples/gemini-class-image.svg',
    description: '장면과 분위기를 분명히 적었을 때 나오는 수업용 이미지 예시입니다.',
    relatedPrompt: 'gemini-image-prompt',
    useCase: '이미지 결과',
  },
  {
    title: 'Grok 영상 장면 예시',
    slug: 'grok-video-storyboard',
    tool: 'Grok',
    image: '/examples/grok-video-storyboard.svg',
    description: '영상 생성 전에 장면 흐름을 먼저 정리한 스토리보드형 예시입니다.',
    relatedPrompt: 'grok-video-scene-builder',
    useCase: '영상 장면',
  },
  {
    title: 'AI 글쓰기 결과 예시',
    slug: 'ai-writing-sample',
    tool: 'Gemini',
    image: '/examples/ai-writing-sample.svg',
    description: '공지문 초안을 짧은 문단 구조로 만든 결과 예시입니다.',
    relatedPrompt: 'ai-writing-draft',
    useCase: '글 결과',
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
    title: 'Gemini 공식 사이트',
    type: '링크',
    url: 'https://gemini.google.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'Grok 공식 사이트',
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
    title: '도움말 보기',
    type: '문서',
    url: '/guide',
    downloadable: false,
    category: '도움말',
  },
]

export const courseModules: ModuleItem[] = [
  {
    title: '접속 준비',
    slug: 'orientation-and-tool-setup',
    summary: 'Gemini, Grok, Padlet을 열고 오늘 흐름을 이해하는 첫 단계입니다.',
    tool: 'Gemini / Grok / Padlet',
    order: 1,
    stepNumber: 1,
    difficulty: '입문',
    estimatedTime: '10분',
    goal: '실습 시작 전에 계정과 탭을 안정적으로 준비한다.',
    externalLinks: [
      { label: 'Gemini', url: 'https://gemini.google.com', description: '이미지와 글쓰기 실습' },
      { label: 'Grok', url: 'https://grok.com', description: '영상 생성 실습' },
      { label: 'Padlet', url: 'https://padlet.com', description: '결과 공유' },
    ],
    prompts: ['prompt-refiner-basic'],
    examples: [],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Gemini 공식 사이트', 'Grok 공식 사이트', 'Padlet', '도움말 보기'],
    padletCtaText: '체크인 결과를 Padlet에 남기기',
    preparations: ['Gemini 로그인 확인', 'Grok 로그인 확인', 'Padlet 링크 열기'],
    steps: [
      { title: 'Gemini 열기', description: '새 탭에서 Gemini를 열고 입력창이 보이는지 확인합니다.' },
      { title: 'Grok 열기', description: '다른 탭에서 Grok을 열고 영상 생성 화면까지 들어갑니다.' },
      { title: 'Padlet 열기', description: '결과 공유는 Padlet에서만 하므로 미리 열어 둡니다.' },
      { title: '사이트 역할 이해하기', description: '이 사이트는 설명과 복사 전용, Padlet은 공유 전용이라고 먼저 이해합니다.' },
    ],
    blockers: [
      { question: '도구가 안 열립니다.', answer: '로그인부터 확인하고, 막히면 먼저 Gemini 실습부터 진행합니다.' },
    ],
    expectedOutcome: '실습에 필요한 탭이 모두 열리고 시작 준비가 끝납니다.',
    quickWin: '첫 단계만 안정화하면 뒤 실습이 훨씬 편해집니다.',
    commonMistake: '이 사이트 안에서 업로드 기능을 찾다가 시간을 씁니다.',
    fallbackAction: 'Grok이 막히면 Gemini 실습부터 먼저 진행합니다.',
    primaryToolUrl: 'https://gemini.google.com',
    ctaLabel: 'Gemini 먼저 열기',
    toolInstruction: 'Gemini와 Grok을 둘 다 열어 두세요. 지금은 Gemini부터 먼저 확인하면 됩니다.',
    entryHint: 'Gemini는 일반 입력창, Grok은 영상 생성 입력창이 보이면 준비 완료입니다.',
    padletInstruction: '세 단계가 끝나면 체크인이나 결과를 Padlet에 올립니다.',
    screenshotHint: '탭 3개를 나란히 열어 두는 모습이나 입력창 위치를 보여 주세요.',
  },
  {
    title: '프롬프트 만들기',
    slug: 'prompt-basics',
    summary: '막연한 요청을 실습에 바로 쓸 수 있는 프롬프트로 바꾸는 단계입니다.',
    tool: 'Gemini',
    order: 2,
    stepNumber: 2,
    difficulty: '입문',
    estimatedTime: '15분',
    goal: '짧은 요청을 구조화된 프롬프트로 바꾸는 기본을 익힌다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '프롬프트 개선 실습' }],
    prompts: ['prompt-refiner-basic'],
    examples: [],
    resources: ['Gemini 공식 사이트', '도움말 보기'],
    padletCtaText: '내가 바꾼 프롬프트를 Padlet에 공유하기',
    preparations: ['막연한 요청 한 문장 준비', 'Gemini 입력창 열기'],
    steps: [
      { title: '원래 요청 적기', description: '예: “좋은 수업 아이디어 줘”처럼 넓은 요청을 적습니다.' },
      { title: '프롬프트 복사하기', description: '아래 프롬프트를 복사해 Gemini에 붙여 넣습니다.' },
      { title: '결과 비교하기', description: '원래 요청과 바뀐 프롬프트를 비교해 봅니다.' },
      { title: '내 상황에 맞게 고치기', description: '학년, 과목, 주제를 넣어 한 번 더 다듬습니다.' },
    ],
    blockers: [
      { question: '결과가 너무 뜬금없습니다.', answer: '학년과 상황을 한 줄 더 넣어 주세요.' },
    ],
    expectedOutcome: '바로 복사해 쓸 수 있는 프롬프트 한 개를 완성합니다.',
    quickWin: '역할과 출력 형식만 넣어도 결과가 달라집니다.',
    commonMistake: '질문은 바꾸고 형식 조건은 빼먹습니다.',
    fallbackAction: '예시 프롬프트를 그대로 쓰고 요청 문장만 바꿔도 됩니다.',
    primaryToolUrl: 'https://gemini.google.com',
    ctaLabel: 'Gemini에서 프롬프트 바꾸기',
    toolInstruction: 'Gemini 일반 입력창에 프롬프트를 붙여 넣으세요.',
    entryHint: '별도 탭이 아니라 기본 입력창에 그대로 붙여 넣으면 됩니다.',
    padletInstruction: '완성한 프롬프트 문장을 Padlet에 그대로 올려도 됩니다.',
    screenshotHint: 'Gemini 입력창에 프롬프트를 붙여 넣는 위치를 보여 주세요.',
  },
  {
    title: 'Gemini 이미지 생성',
    slug: 'gemini-image-lab',
    summary: '수업용 이미지 한 장을 만들기 위해 Gemini에서 이미지 생성 흐름을 따라 합니다.',
    tool: 'Gemini',
    order: 3,
    stepNumber: 3,
    difficulty: '기초',
    estimatedTime: '20분',
    goal: '교실에서 바로 보여 줄 수 있는 이미지 결과를 만든다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '이미지 생성 실습' }],
    prompts: ['gemini-image-prompt'],
    examples: ['gemini-class-image'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Gemini 공식 사이트'],
    padletCtaText: '완성한 이미지를 Padlet에 공유하기',
    preparations: ['Gemini 열기', '수업 주제 하나 정하기'],
    steps: [
      { title: 'Gemini 열기', description: 'Gemini를 열고 이미지 생성 영역이나 이미지 탭으로 들어갑니다.' },
      { title: '프롬프트 복사하기', description: '아래 이미지 생성 프롬프트를 복사해 붙여 넣습니다.' },
      { title: '이미지 생성하기', description: '주제와 분위기를 넣어 이미지를 생성합니다.' },
      { title: '결과 다시 다듬기', description: '복잡하면 요소를 줄여 달라고 다시 요청합니다.' },
      { title: 'Padlet에 올리기', description: '마음에 드는 결과 한 장을 Padlet에 공유합니다.' },
    ],
    blockers: [
      { question: '텍스트가 이미지에 들어갑니다.', answer: '이미지 안에 글자를 넣지 말라고 다시 적어 주세요.' },
    ],
    expectedOutcome: '수업용 이미지 한 장이 완성됩니다.',
    quickWin: '장면 하나만 분명히 적으면 결과가 더 좋아집니다.',
    commonMistake: '주제와 설명을 너무 많이 넣습니다.',
    fallbackAction: '장면 설명만 남기고 다시 생성해 보세요.',
    primaryToolUrl: 'https://gemini.google.com',
    ctaLabel: 'Gemini 이미지 탭 열기',
    toolInstruction: 'Gemini에서 이미지 생성 탭이나 이미지 입력 영역으로 이동하세요.',
    entryHint: '일반 입력창이 아니라 이미지 생성이 가능한 영역을 찾아야 합니다.',
    padletInstruction: '완성한 이미지 한 장만 골라 Padlet에 올리면 됩니다.',
    screenshotHint: 'Gemini에서 이미지 생성 입력 영역을 눌러 들어가는 모습을 보여 주세요.',
  },
  {
    title: 'Grok 영상 생성',
    slug: 'grok-video-lab',
    summary: '짧은 영상 생성을 위해 장면을 먼저 정리하고 Grok에서 생성해 보는 단계입니다.',
    tool: 'Grok',
    order: 4,
    stepNumber: 4,
    difficulty: '응용',
    estimatedTime: '20분',
    goal: '짧은 영상 생성 프롬프트 흐름을 한 번 경험한다.',
    externalLinks: [{ label: 'Grok', url: 'https://grok.com', description: '영상 생성 실습' }],
    prompts: ['grok-video-scene-builder'],
    examples: ['grok-video-storyboard'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Grok 공식 사이트'],
    padletCtaText: '영상 결과나 장면 설계를 Padlet에 남기기',
    preparations: ['Grok 열기', '짧은 영상 주제 하나 정하기'],
    steps: [
      { title: 'Grok 열기', description: '영상 생성 입력 영역이 보이는지 먼저 확인합니다.' },
      { title: '장면 프롬프트 복사하기', description: '장면 설계 프롬프트를 복사해 붙여 넣습니다.' },
      { title: '생성 시작하기', description: '생성 버튼을 먼저 눌러 두고 기다립니다.' },
      { title: '기다리는 동안 다른 활동 하기', description: '영상이 만들어지는 동안 글쓰기 단계나 Padlet 정리를 먼저 합니다.' },
      { title: '결과 확인하기', description: '장면이 복잡하면 움직임과 장면 수를 줄여 다시 시도합니다.' },
    ],
    blockers: [
      { question: '생성이 오래 걸립니다.', answer: '기다리는 동안 다음 활동으로 넘어가도 됩니다.' },
    ],
    expectedOutcome: '짧은 영상 생성 프롬프트와 수정 흐름을 이해합니다.',
    quickWin: '3장면 구조로 나누면 훨씬 쉬워집니다.',
    commonMistake: '한 번에 너무 긴 이야기를 넣습니다.',
    fallbackAction: '영상 결과가 없어도 장면 설계 프롬프트를 완성하면 충분합니다.',
    primaryToolUrl: 'https://grok.com',
    ctaLabel: 'Grok 영상 입력 열기',
    toolInstruction: 'Grok에서 영상 생성 입력 영역을 먼저 찾으세요.',
    entryHint: '일반 채팅이 아니라 영상 생성 입력 위치에 붙여 넣어야 합니다.',
    padletInstruction: '완성 영상이 없으면 장면 설계 문장만 Padlet에 올려도 됩니다.',
    screenshotHint: 'Grok에서 영상 생성 입력 위치를 눌러 들어가는 모습을 보여 주세요.',
    waitNote: '영상 생성은 시간이 걸릴 수 있으니 시작만 해 두고 다음 활동으로 넘어가도 됩니다.',
  },
  {
    title: 'AI 글쓰기',
    slug: 'ai-writing-lab',
    summary: '공지문이나 안내문 초안을 만들고 읽기 쉽게 다듬는 마지막 단계입니다.',
    tool: 'Gemini',
    order: 5,
    stepNumber: 5,
    difficulty: '입문',
    estimatedTime: '15분',
    goal: '바로 수정 가능한 글 초안과 다듬기 결과를 만든다.',
    externalLinks: [{ label: 'Gemini', url: 'https://gemini.google.com', description: '글쓰기와 다듬기 실습' }],
    prompts: ['ai-writing-draft', 'communication-polisher'],
    examples: ['ai-writing-sample'],
    resources: ['의랑초등학교 생성형 AI 연수 교안', 'Gemini 공식 사이트', '도움말 보기'],
    padletCtaText: '완성한 글 초안을 Padlet에 공유하기',
    preparations: ['공지 주제 하나 정하기', '기존 안내문이 있으면 함께 준비하기'],
    steps: [
      { title: '초안 먼저 만들기', description: '글쓰기 초안 프롬프트를 Gemini에 붙여 넣습니다.' },
      { title: '문장 다듬기', description: '기존 안내문이 있으면 다듬기 프롬프트도 함께 사용합니다.' },
      { title: '문자 요약 만들기', description: '마지막에 2문장 문자 요약도 추가합니다.' },
      { title: 'Padlet에 올리기', description: '완성한 제목이나 첫 문단만 올려도 충분합니다.' },
    ],
    blockers: [
      { question: '문장이 너무 딱딱합니다.', answer: '친절하고 쉬운 말로 써 달라고 다시 요청하세요.' },
    ],
    expectedOutcome: '공지문이나 안내문 초안 한 개를 완성합니다.',
    quickWin: '제목과 첫 문장만 좋아져도 전체 글이 읽기 쉬워집니다.',
    commonMistake: '독자를 빼고 글만 먼저 써 달라고 요청합니다.',
    fallbackAction: '새로 쓰기보다 기존 문장을 다듬기부터 해도 됩니다.',
    primaryToolUrl: 'https://gemini.google.com',
    ctaLabel: 'Gemini에서 글쓰기 시작',
    toolInstruction: 'Gemini 일반 입력창에 글쓰기 프롬프트를 붙여 넣으세요.',
    entryHint: '긴 설명보다 제목과 첫 문장을 먼저 확인하는 것이 좋습니다.',
    padletInstruction: '완성 글 전체가 아니어도 제목과 첫 문단만 공유해도 됩니다.',
    screenshotHint: 'Gemini에서 글쓰기 결과를 확인하는 위치를 보여 주세요.',
  },
].sort((left, right) => left.order - right.order)

export const promptMap = new Map(prompts.map((item) => [item.slug, item]))
export const exampleMap = new Map(examples.map((item) => [item.slug, item]))
export const resourceMap = new Map(resources.map((item) => [item.title, item]))
