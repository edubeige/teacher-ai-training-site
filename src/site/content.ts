import type { CurrentSession, ExampleItem, ModuleItem, PromptItem, ResourceItem } from './types'

export const toolLinkMap = {
  gemini: {
    title: 'Gemini',
    description: '질문, 문장 다듬기, 초안 생성 실습에 사용합니다.',
    url: 'https://gemini.google.com',
  },
  aiStudio: {
    title: 'Google AI Studio',
    description: '긴 프롬프트와 구조화된 출력 실험에 적합합니다.',
    url: 'https://aistudio.google.com',
  },
  notebooklm: {
    title: 'NotebookLM',
    description: '자료 요약, 질의응답, 학습지 재구성에 활용합니다.',
    url: 'https://notebooklm.google.com',
  },
  canva: {
    title: 'Canva',
    description: '이미지와 슬라이드, 카드형 결과물 제작에 사용합니다.',
    url: 'https://www.canva.com',
  },
} as const

export const currentSession: CurrentSession = {
  trainingTitle: '생성형 AI를 활용한 칼퇴하기',
  schoolName: '의랑초등학교',
  date: '2026-03-18',
  instructor: '반곡초 황도연',
  notices: [
    '이 사이트는 강의자료와 복사용 프롬프트 제공용입니다.',
    '참가자 업로드와 현장 결과물 공유는 Padlet에서만 진행합니다.',
    '계정 준비가 안 된 경우에는 가이드 페이지를 먼저 확인해 주세요.',
  ],
  padletUrl: 'https://padlet.com',
  featuredModules: ['orientation-and-tool-setup', 'prompt-design-studio', 'image-and-slide-lab'],
}

export const prompts: PromptItem[] = [
  {
    title: '수업 설계 가속 프롬프트',
    slug: 'lesson-design-accelerator',
    category: '수업 설계',
    tags: ['차시안', '수업활동', '평가'],
    body: `너는 {{grade}} {{subject}} 수업 설계 코치야.
주제는 "{{topic}}"이고 수업 시간은 {{duration}}이야.
다음 형식으로 제안해 줘.
1. 수업 목표 3개
2. 도입-전개-정리 활동안
3. 학생 참여를 높이는 질문 5개
4. 형성평가 문항 3개
5. 교사용 운영 팁
톤은 {{tone}}으로 유지해 줘.`,
    variables: [
      { key: 'grade', label: '학년', placeholder: '예: 3학년', defaultValue: '3학년' },
      { key: 'subject', label: '과목', placeholder: '예: 국어', defaultValue: '국어' },
      { key: 'topic', label: '주제', placeholder: '예: 설명하는 글 쓰기', defaultValue: '설명하는 글 쓰기' },
      { key: 'duration', label: '수업 시간', placeholder: '예: 40분', defaultValue: '40분' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 간결하게', defaultValue: '친절하고 간결하게' },
    ],
    exampleUse: '차시안 초안을 빠르게 만들고 수정 포인트를 잡을 때 사용합니다.',
    relatedTool: 'Gemini',
  },
  {
    title: '프롬프트 업그레이드 코치',
    slug: 'prompt-refiner',
    category: '프롬프트 설계',
    tags: ['메타프롬프트', '리라이팅', '정교화'],
    body: `다음 사용자 요청을 더 나은 프롬프트로 바꿔 줘.
요청: "{{topic}}"

조건:
- 초등 교사 연수 상황에 맞게 재작성
- 역할, 목표, 출력 형식, 제약 조건을 분명히 포함
- 초보 교사도 바로 복사해 쓸 수 있도록 작성
- 마지막에 "왜 이렇게 바꿨는지" 3줄 설명 추가`,
    variables: [
      { key: 'topic', label: '원래 요청', placeholder: '예: 발표 수업 아이디어 알려줘', defaultValue: '발표 수업 아이디어 알려줘' },
    ],
    exampleUse: '막연한 질문을 실습용 프롬프트 카드로 바꾸는 데 적합합니다.',
    relatedTool: 'AI Studio',
  },
  {
    title: '이미지 생성 브리프',
    slug: 'image-brief-for-class',
    category: '이미지 생성',
    tags: ['이미지', 'Canva', '시각자료'],
    body: `{{subject}} 수업에서 사용할 이미지를 만들고 싶어.
주제는 "{{topic}}"이고 학생 수준은 {{grade}}이야.

다음 항목을 포함한 이미지 생성 프롬프트를 작성해 줘.
- 장면 설명
- 화면 구도
- 색감과 분위기
- 피해야 할 요소
- 교실에서 활용하는 방법 2가지

스타일은 {{tone}}으로 맞춰 줘.`,
    variables: [
      { key: 'subject', label: '과목', placeholder: '예: 사회', defaultValue: '사회' },
      { key: 'topic', label: '주제', placeholder: '예: 지속 가능한 도시', defaultValue: '지속 가능한 도시' },
      { key: 'grade', label: '학년', placeholder: '예: 5학년', defaultValue: '5학년' },
      { key: 'tone', label: '분위기', placeholder: '예: 따뜻하고 선명하게', defaultValue: '따뜻하고 선명하게' },
    ],
    exampleUse: 'Canva 또는 Gemini에 붙여 넣을 시각자료용 브리프를 만들 때 유용합니다.',
    relatedTool: 'Canva',
  },
  {
    title: 'NotebookLM 학습지 변환 프롬프트',
    slug: 'notebooklm-study-guide',
    category: '자료 재구성',
    tags: ['요약', '학습지', 'NotebookLM'],
    body: `첨부한 자료를 {{grade}} 학생용 학습지로 바꿔 줘.
과목은 {{subject}}, 목표는 "{{topic}}"이야.

출력 형식:
1. 핵심 개념 4개
2. 학생용 쉬운 설명
3. 확인 질문 5개
4. 교사용 확장 질문 3개
5. 수업 마무리 문장

문장은 {{tone}}으로 써 줘.`,
    variables: [
      { key: 'grade', label: '학년', placeholder: '예: 4학년', defaultValue: '4학년' },
      { key: 'subject', label: '과목', placeholder: '예: 과학', defaultValue: '과학' },
      { key: 'topic', label: '학습 목표', placeholder: '예: 물의 순환 이해', defaultValue: '물의 순환 이해' },
      { key: 'tone', label: '문체', placeholder: '예: 쉬운 말 중심으로', defaultValue: '쉬운 말 중심으로' },
    ],
    exampleUse: '긴 읽기 자료를 학생 활동지나 교사용 요약본으로 바꿀 때 씁니다.',
    relatedTool: 'NotebookLM',
  },
  {
    title: 'Canva 앱 PRD 메이커',
    slug: 'canva-app-prd-maker',
    category: '기획',
    tags: ['PRD', 'Canva', '바이브코딩'],
    body: `너는 교사용 Canva 앱 기획 파트너야.
앱 이름은 "{{topic}}"이고 대상은 {{grade}} {{subject}} 수업이야.

아래 형식의 Markdown PRD를 작성해 줘.
1. Purpose & Target
2. Key Features
3. Design Requirements
4. Data & Storage
5. User Scenario

조건:
- Canva 안에서 모든 데이터 입력이 이루어져야 함
- 저장 데이터는 텍스트, 숫자, 날짜, 불린만 사용
- 교사가 바로 Gemini에 넣을 수 있도록 간결하고 명확하게 작성
- 톤은 {{tone}}으로 유지`,
    variables: [
      { key: 'topic', label: '앱 주제', placeholder: '예: 모둠 추첨 도구', defaultValue: '모둠 추첨 도구' },
      { key: 'grade', label: '학년', placeholder: '예: 6학년', defaultValue: '6학년' },
      { key: 'subject', label: '과목', placeholder: '예: 창체', defaultValue: '창체' },
      { key: 'tone', label: '문체', placeholder: '예: 실무형', defaultValue: '실무형' },
    ],
    exampleUse: '바이브코딩 실습에서 앱 아이디어를 바로 구현 가능한 PRD로 바꿀 때 사용합니다.',
    relatedTool: 'Gemini',
  },
  {
    title: '가정통신문 다듬기 프롬프트',
    slug: 'communication-polisher',
    category: '문서 작성',
    tags: ['가정통신문', '문장다듬기', '학부모소통'],
    body: `다음 안내문을 {{tone}} 톤으로 다듬어 줘.
대상은 {{grade}} 학부모이며 주제는 "{{topic}}"이야.

조건:
- 핵심 정보가 먼저 보이게 재구성
- 문장 길이는 짧게
- 필요한 준비물, 일정, 주의사항을 소제목으로 정리
- 마지막에 문자 메시지용 2문장 요약도 추가`,
    variables: [
      { key: 'grade', label: '대상 학년', placeholder: '예: 2학년', defaultValue: '2학년' },
      { key: 'topic', label: '안내 주제', placeholder: '예: 현장체험학습', defaultValue: '현장체험학습' },
      { key: 'tone', label: '문체', placeholder: '예: 친절하고 신뢰감 있게', defaultValue: '친절하고 신뢰감 있게' },
    ],
    exampleUse: '행사 안내문, 가정통신문, 학부모 공지를 빠르게 정리할 때 씁니다.',
    relatedTool: 'Gemini',
  },
]

export const examples: ExampleItem[] = [
  {
    title: '프로젝터용 수업 도입 슬라이드',
    slug: 'projector-lesson-slide',
    tool: 'Canva',
    image: '/examples/projector-lesson-slide.svg',
    description: '큰 제목과 시각 자료 중심으로 만든 도입 슬라이드 예시입니다.',
    relatedPrompt: 'image-brief-for-class',
    useCase: '도입 자료',
  },
  {
    title: 'AI 기반 차시안 초안',
    slug: 'lesson-plan-draft',
    tool: 'Gemini',
    image: '/examples/lesson-plan-draft.svg',
    description: '도입-전개-정리와 형성평가가 한 번에 정리된 차시안 예시입니다.',
    relatedPrompt: 'lesson-design-accelerator',
    useCase: '차시 설계',
  },
  {
    title: 'NotebookLM 학습지 요약본',
    slug: 'notebooklm-guide-sheet',
    tool: 'NotebookLM',
    image: '/examples/notebooklm-guide-sheet.svg',
    description: '긴 읽기 자료를 학생용 질문지와 교사용 포인트로 나눈 예시입니다.',
    relatedPrompt: 'notebooklm-study-guide',
    useCase: '학습지',
  },
  {
    title: 'Canva 앱 PRD 카드',
    slug: 'canva-prd-card',
    tool: 'Gemini',
    image: '/examples/canva-prd-card.svg',
    description: '앱 아이디어를 구조화된 PRD로 정리한 예시 카드입니다.',
    relatedPrompt: 'canva-app-prd-maker',
    useCase: '기획 문서',
  },
]

export const resources: ResourceItem[] = [
  {
    title: '쌤동네 바이브코딩 Padlet 아카이브',
    type: 'PDF',
    url: '/downloads/padlet-vibe-coding-20260128.pdf',
    downloadable: true,
    category: '배포자료',
  },
  {
    title: '이음학교 이미지 생성 Padlet 아카이브',
    type: 'PDF',
    url: '/downloads/padlet-image-generation-20260207.pdf',
    downloadable: true,
    category: '배포자료',
  },
  {
    title: 'Gemini 공식 사이트',
    type: '링크',
    url: 'https://gemini.google.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'Google AI Studio',
    type: '링크',
    url: 'https://aistudio.google.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'NotebookLM',
    type: '링크',
    url: 'https://notebooklm.google.com',
    downloadable: false,
    category: '공식도구',
  },
  {
    title: 'Canva',
    type: '링크',
    url: 'https://www.canva.com',
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
    title: '연수 진행 가이드',
    type: '문서',
    url: '/guide',
    downloadable: false,
    category: '실습지원',
  },
]

export const courseModules: ModuleItem[] = [
  {
    title: '도구 준비와 연수 흐름 잡기',
    slug: 'orientation-and-tool-setup',
    summary: '오늘 사용할 도구와 연수 흐름을 빠르게 익히고 로그인과 링크 점검을 끝내는 모듈입니다.',
    tool: 'Gemini / AI Studio / NotebookLM',
    order: 1,
    difficulty: '입문',
    estimatedTime: '20분',
    goal: '도구 접속과 연수 동선을 10분 안에 안정화한다.',
    externalLinks: [
      { label: 'Gemini', url: 'https://gemini.google.com', description: '텍스트 생성과 질문 실습' },
      { label: 'AI Studio', url: 'https://aistudio.google.com', description: '구조화 프롬프트 실험' },
      { label: 'NotebookLM', url: 'https://notebooklm.google.com', description: '자료 기반 요약과 질의응답' },
    ],
    prompts: ['prompt-refiner', 'communication-polisher'],
    examples: ['lesson-plan-draft'],
    resources: ['Gemini 공식 사이트', 'Google AI Studio', 'NotebookLM', '연수 진행 가이드'],
    padletCtaText: '오늘 연수 체크인 결과를 Padlet에 남기기',
    preparations: [
      '구글 계정 로그인 상태 확인',
      '브라우저 팝업 차단 해제',
      '오늘 사용할 Padlet 링크 새 탭으로 준비',
    ],
    steps: [
      {
        title: '연수의 역할 분리 이해하기',
        description: '이 사이트는 설명과 복사 전용, Padlet은 공유 전용이라는 구조를 먼저 안내합니다.',
        tip: '처음 3분에 이 원칙을 말해 주면 이후 질문이 크게 줄어듭니다.',
      },
      {
        title: '도구 접속 상태 확인하기',
        description: 'Gemini, AI Studio, NotebookLM 탭을 순서대로 열고 로그인 여부를 확인합니다.',
      },
      {
        title: '계정 이슈 대처 가이드 보여주기',
        description: '로그인이 막히는 경우에는 `guide` 페이지의 빠른 해결 항목을 보며 대응합니다.',
      },
      {
        title: '오늘 모듈 동선 공유하기',
        description: '오늘 페이지에서 어떤 모듈을 어떤 순서로 볼지 화면으로 먼저 보여 줍니다.',
      },
    ],
    blockers: [
      {
        question: '학교 네트워크에서 도구가 열리지 않으면 어떻게 하나요?',
        answer: '모바일 핫스팟을 예비안으로 두고, 텍스트 중심 실습부터 진행하면 흐름을 유지하기 쉽습니다.',
      },
      {
        question: '수강생이 사이트 안에서 결과 공유를 찾습니다.',
        answer: '이 사이트는 업로드 기능이 없고 모든 결과 공유는 Padlet에서 진행한다고 다시 안내합니다.',
      },
    ],
  },
  {
    title: '프롬프트 설계 스튜디오',
    slug: 'prompt-design-studio',
    summary: '막연한 질문을 역할, 목표, 출력 형식이 갖춰진 프롬프트로 업그레이드하는 실습입니다.',
    tool: 'Gemini / AI Studio',
    order: 2,
    difficulty: '기초',
    estimatedTime: '30분',
    goal: '초보 교사도 복사해 바로 쓸 수 있는 프롬프트 구조를 익힌다.',
    externalLinks: [
      { label: 'Gemini', url: 'https://gemini.google.com', description: '첫 실습용 권장 도구' },
      { label: 'AI Studio', url: 'https://aistudio.google.com', description: '프롬프트 구조 비교 실험용' },
    ],
    prompts: ['lesson-design-accelerator', 'prompt-refiner', 'canva-app-prd-maker'],
    examples: ['lesson-plan-draft', 'canva-prd-card'],
    resources: ['쌤동네 바이브코딩 Padlet 아카이브', 'Google AI Studio'],
    padletCtaText: '내가 다듬은 프롬프트를 Padlet에 공유하기',
    preparations: [
      '질문 한 줄짜리 초안 하나 준비',
      '프롬프트 비교를 위해 두 개 이상의 답변 결과를 저장할 화면 준비',
    ],
    steps: [
      {
        title: '막연한 질문 하나 고르기',
        description: '예: “좋은 수업 아이디어 줘”처럼 넓은 질문을 하나 선택합니다.',
      },
      {
        title: '역할과 목표 넣기',
        description: 'AI에게 교사 연수 코치, 수업 설계 조력자 같은 역할을 주고 목표를 분명히 씁니다.',
      },
      {
        title: '출력 형식과 제약 조건 넣기',
        description: '표, 항목 수, 어투, 학생 수준, 시간 제한 같은 제약을 추가합니다.',
        tip: '형식까지 적어야 결과 품질 차이가 눈에 띄게 납니다.',
      },
      {
        title: '개선 전후 결과 비교하기',
        description: '원래 질문과 업그레이드한 프롬프트의 답변을 나란히 비교합니다.',
      },
    ],
    blockers: [
      {
        question: '답변이 너무 길거나 산만합니다.',
        answer: '항목 수 제한, 출력 형식, “교사가 바로 사용할 수 있게” 같은 조건을 더해 결과 범위를 좁혀 주세요.',
      },
      {
        question: '수업 상황에 맞지 않는 답이 나옵니다.',
        answer: '학년, 과목, 주제, 수업 시간, 학생 수준을 명시하면 현장 적합성이 크게 올라갑니다.',
      },
    ],
  },
  {
    title: '이미지와 슬라이드 제작 실습',
    slug: 'image-and-slide-lab',
    summary: '텍스트 프롬프트를 시각 자료로 바꿔 프로젝터 친화형 슬라이드와 활동 자료를 만드는 모듈입니다.',
    tool: 'Canva / Gemini',
    order: 3,
    difficulty: '기초',
    estimatedTime: '25분',
    goal: '교실에서 바로 쓸 수 있는 시각 자료 한 장을 완성한다.',
    externalLinks: [
      { label: 'Canva', url: 'https://www.canva.com', description: '시각화와 슬라이드 제작' },
      { label: 'Gemini', url: 'https://gemini.google.com', description: '이미지 설명용 브리프 생성' },
    ],
    prompts: ['image-brief-for-class', 'communication-polisher'],
    examples: ['projector-lesson-slide'],
    resources: ['이음학교 이미지 생성 Padlet 아카이브', 'Canva'],
    padletCtaText: '완성한 시각 자료를 Padlet에 올리기',
    preparations: [
      'Canva 또는 이미지 생성 도구 접속',
      '오늘 수업 주제 또는 학교 행사 주제 하나 정하기',
    ],
    steps: [
      {
        title: '시각화할 주제 정하기',
        description: '학습 주제, 행사 안내, 학급 규칙 가운데 하나를 선택합니다.',
      },
      {
        title: '이미지 생성 브리프 만들기',
        description: '과목, 학년, 분위기, 피해야 할 요소를 포함한 프롬프트를 생성합니다.',
      },
      {
        title: 'Canva에서 카드형 결과물 만들기',
        description: '큰 제목, 핵심 문장, 한 장 이미지 중심으로 프로젝터 친화형 화면을 구성합니다.',
      },
      {
        title: '교실 활용 장면 연결하기',
        description: '도입, 설명, 정리 중 어디에 쓰일지 한 문장으로 정리합니다.',
      },
    ],
    blockers: [
      {
        question: '이미지가 너무 화려해서 수업용으로 부담스럽습니다.',
        answer: '브리프에 “텍스트 가독성 우선, 단순한 구도, 배경 여백 확보”를 추가하세요.',
      },
      {
        question: '슬라이드에 정보가 너무 많아집니다.',
        answer: '한 화면에는 메시지 하나만 남기고 긴 설명은 말로 보완하는 방식이 프로젝터에서 더 잘 보입니다.',
      },
    ],
  },
  {
    title: '자료 요약과 학습지 재구성',
    slug: 'notebooklm-classroom-kit',
    summary: '긴 자료를 NotebookLM으로 요약하고 학생용 질문과 교사용 포인트로 재구성합니다.',
    tool: 'NotebookLM',
    order: 4,
    difficulty: '중급',
    estimatedTime: '20분',
    goal: '긴 읽기 자료를 짧은 학습지 포맷으로 전환하는 흐름을 익힌다.',
    externalLinks: [
      { label: 'NotebookLM', url: 'https://notebooklm.google.com', description: '자료 기반 요약과 질의응답' },
    ],
    prompts: ['notebooklm-study-guide', 'lesson-design-accelerator'],
    examples: ['notebooklm-guide-sheet'],
    resources: ['NotebookLM', '연수 진행 가이드'],
    padletCtaText: '재구성한 학습지를 Padlet에 공유하기',
    preparations: [
      '읽기 자료 또는 안내문 1개 준비',
      '학생용과 교사용 산출물을 나눠 볼 기준 정하기',
    ],
    steps: [
      {
        title: '자료 업로드 또는 핵심 내용 붙여 넣기',
        description: '수업 자료나 안내문을 NotebookLM에 넣고 요약 대상 범위를 정합니다.',
      },
      {
        title: '학생용 언어로 다시 쓰기',
        description: '어려운 표현을 쉬운 말 중심으로 바꾸고 핵심 개념 수를 제한합니다.',
      },
      {
        title: '질문과 확장 활동 만들기',
        description: '확인 질문과 교사용 추가 질문을 분리해서 정리합니다.',
      },
      {
        title: '학습지 형태로 정리하기',
        description: '바로 배포 가능한 문단 구조와 제목 체계로 출력합니다.',
      },
    ],
    blockers: [
      {
        question: '요약이 너무 일반적입니다.',
        answer: '“학생용”, “4개 핵심 개념만”, “질문 포함”처럼 출력 형식을 더 구체적으로 지정해 주세요.',
      },
      {
        question: '학생 수준에 맞지 않는 표현이 섞입니다.',
        answer: '대상 학년과 쉬운 말 사용 조건을 프롬프트에 반드시 넣어 주세요.',
      },
    ],
  },
].sort((left, right) => left.order - right.order)

export const promptMap = new Map(prompts.map((item) => [item.slug, item]))
export const exampleMap = new Map(examples.map((item) => [item.slug, item]))
export const resourceMap = new Map(resources.map((item) => [item.title, item]))
