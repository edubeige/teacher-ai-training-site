import { useDeferredValue, useMemo, useState } from 'react'
import {
  courseModules,
  currentSession,
  exampleMap,
  examples,
  promptMap,
  prompts,
  resourceMap,
  resources,
  toolLinkMap,
} from './site/content'
import type { ExampleItem, ModuleItem, PromptItem, ResourceItem } from './site/types'
import {
  ActionCard,
  ExampleGallery,
  InfoListCard,
  ModuleRail,
  ModuleStepCard,
  ModuleSummaryCard,
  PadletCard,
  PageToolbar,
  PromptCard,
  QuickStartCard,
  ResourceList,
  ScheduleBoard,
  SearchField,
  SectionTitle,
  SessionInfoCard,
  SupportCard,
  TagFilter,
  ToolStackCard,
} from './components/ui'

const moduleMap = new Map(courseModules.map((module) => [module.slug, module]))

export function HomePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const featuredModules = currentSession.featuredModules
    .map((slug) => moduleMap.get(slug))
    .filter((item): item is ModuleItem => Boolean(item))
  const quickTools = Object.values(toolLinkMap)
  const featuredPrompts = prompts.slice(0, 3)

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="연수 컨트롤 센터"
        title="오늘 보여 줄 자료와 실습을 한 화면에서 정리합니다."
        description="설명형 랜딩 대신, 지금 열어야 할 도구와 첫 실습 진입점을 바로 보여 주는 연수용 대시보드입니다."
        actions={[
          { label: '오늘 연수', href: '/today', kind: 'solid' },
          { label: '프롬프트 허브', href: '/prompts', kind: 'outline' },
        ]}
      />

      <section className="card-grid five-up">
        <ActionCard
          label="오늘 연수"
          title={currentSession.trainingTitle}
          description="오늘 해야 할 일과 순서를 먼저 봅니다."
          href="/today"
          onNavigate={onNavigate}
          tone="accent"
        />
        <ActionCard
          label="첫 모듈"
          title={featuredModules[0]?.title ?? courseModules[0].title}
          description="처음 접속한 수강생이 가장 먼저 열면 되는 모듈입니다."
          href={`/modules/${featuredModules[0]?.slug ?? courseModules[0].slug}`}
          onNavigate={onNavigate}
        />
        <ActionCard
          label="프롬프트 허브"
          title="바로 복사해서 쓰는 카드"
          description="도구와 용도별로 찾고 바로 복사합니다."
          href="/prompts"
          onNavigate={onNavigate}
        />
        <ActionCard
          label="자료실"
          title="PDF와 공식 도구 링크"
          description="배포 자료와 실습 링크를 한곳에서 엽니다."
          href="/resources"
          onNavigate={onNavigate}
          tone="soft"
        />
        <ActionCard
          label="Padlet"
          title="결과 공유는 여기서"
          description="현장 결과물과 체크인은 Padlet에서만 진행합니다."
          href={currentSession.padletUrl}
          onNavigate={onNavigate}
          external
        />
      </section>

      <section className="home-grid">
        <QuickStartCard steps={currentSession.quickStartSteps ?? []} />
        <SessionInfoCard schoolName={currentSession.schoolName} date={currentSession.date} instructor={currentSession.instructor} />
        <ToolStackCard title="자주 여는 도구" items={quickTools} />
        <SupportCard
          title="처음 접하는 선생님을 위한 바로 도움말"
          description="지금 막히는 지점을 줄이는 문장만 남겼습니다."
          items={currentSession.supportNotes ?? []}
        />
      </section>

      <section className="board-grid">
        <div>
          <SectionTitle title="오늘 보여 줄 모듈" description="강의 순서대로 열면 흐름이 끊기지 않습니다." />
          <ScheduleBoard modules={featuredModules} onNavigate={onNavigate} />
        </div>
        <div>
          <SectionTitle title="첫 실습용 프롬프트" description="AI가 처음인 수강생도 바로 복사해 볼 수 있는 카드만 추렸습니다." />
          <div className="card-grid">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} compact />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function TodayPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const featuredModules = currentSession.featuredModules
    .map((slug) => moduleMap.get(slug))
    .filter((item): item is ModuleItem => Boolean(item))
  const quickTools = Object.values(toolLinkMap).filter((item) => (currentSession.mustOpenTools ?? []).includes(item.title))

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="오늘 연수 허브"
        title={currentSession.trainingTitle}
        description={`${currentSession.schoolName} 연수용 시작 화면입니다. 처음 접속한 수강생도 이 페이지에서 바로 도구를 열고 첫 실습으로 이동할 수 있습니다.`}
        actions={[
          { label: '첫 모듈 시작', href: `/modules/${featuredModules[0]?.slug ?? courseModules[0].slug}`, kind: 'solid' },
          { label: '자료실 바로가기', href: '/resources', kind: 'outline' },
        ]}
      />

      <section className="today-grid">
        <QuickStartCard steps={currentSession.quickStartSteps ?? []} />
        <InfoListCard label="오늘 해야 할 일" title="여기서부터 시작하면 됩니다." items={currentSession.quickStartSteps ?? []} />
        <ToolStackCard title="지금 열어 둘 도구" items={quickTools} />
        <SupportCard title="오늘 공지와 유의점" description="실습 흐름이 끊기지 않도록 먼저 읽어 주세요." items={currentSession.notices} />
      </section>

      <section className="board-grid">
        <SessionInfoCard schoolName={currentSession.schoolName} date={currentSession.date} instructor={currentSession.instructor} />
        <ScheduleBoard modules={featuredModules} onNavigate={onNavigate} />
      </section>

      <PadletCard text="오늘 사용할 Padlet 열기" url={currentSession.padletUrl} />
    </div>
  )
}

export function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="코스 개요"
        title="오늘 연수를 이루는 모듈과 실습 흐름"
        description="도구 적응, 프롬프트 설계, 시각 자료 제작, 자료 재구성까지 한 흐름으로 이어집니다."
      />

      <section className="board-grid">
        <InfoListCard
          label="흐름 이해"
          title="강의와 실습의 기본 순서"
          items={[
            '도구와 계정 상태를 먼저 점검합니다.',
            '막연한 질문을 구조화 프롬프트로 바꿉니다.',
            '텍스트 결과를 슬라이드와 시각 자료로 연결합니다.',
            '공유가 필요할 때만 Padlet로 이동합니다.',
          ]}
        />
        <SupportCard
          title="이 사이트가 하는 일"
          description="상호작용 플랫폼이 아니라, 강사가 보여 주고 수강생이 따라 하는 정적 허브입니다."
          items={[
            '로그인이나 제출 기능 없이 바로 사용합니다.',
            '프롬프트 복사와 도구 열기를 빠르게 돕습니다.',
            '다른 학교 연수에도 세션 데이터만 바꿔 재사용할 수 있습니다.',
          ]}
        />
      </section>

      <section>
        <SectionTitle title="전체 모듈" description="모든 모듈은 같은 형식으로 구성되어 있어 수강생이 길을 잃지 않게 설계합니다." />
        <div className="card-grid dual">
          {courseModules.map((module) => (
            <ModuleSummaryCard key={module.slug} module={module} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  )
}

export function ModulePage({
  module,
  onNavigate,
}: {
  module: ModuleItem
  onNavigate: (href: string) => void
}) {
  const relatedPrompts = module.prompts.map((slug) => promptMap.get(slug)).filter((item): item is PromptItem => Boolean(item))
  const relatedExamples = module.examples.map((slug) => exampleMap.get(slug)).filter((item): item is ExampleItem => Boolean(item))
  const relatedResources = module.resources.map((title) => resourceMap.get(title)).filter((item): item is ResourceItem => Boolean(item))

  return (
    <div className="module-layout">
      <ModuleRail module={module} />

      <div className="page-stack">
        <section className="glass-panel module-hero-panel" id="overview">
          <div className="meta-row">
            <span>{module.tool}</span>
            <span>{module.difficulty}</span>
          </div>
          <h1>{module.title}</h1>
          <p>{module.summary}</p>

          <div className="detail-grid four-up">
            <article className="detail-card">
              <span>끝나면 얻는 것</span>
              <strong>{module.expectedOutcome ?? module.goal}</strong>
            </article>
            <article className="detail-card">
              <span>예상 시간</span>
              <strong>{module.estimatedTime}</strong>
            </article>
            <article className="detail-card">
              <span>자주 막히는 지점</span>
              <strong>{module.commonMistake ?? '도구와 출력 형식을 동시에 바꾸려다 흐름이 끊기기 쉽습니다.'}</strong>
            </article>
            <article className="detail-card">
              <span>막히면 이렇게</span>
              <strong>{module.fallbackAction ?? '첫 단계로 돌아가 결과를 한 번 더 단순하게 요청해 보세요.'}</strong>
            </article>
          </div>
        </section>

        <section className="board-grid" id="prepare">
          <InfoListCard label="준비 체크" title="실습 전에 이것만 확인하세요." items={module.preparations} />
          <ToolStackCard title="이 모듈에서 여는 도구" items={module.externalLinks.map((item) => ({ title: item.label, description: item.description, url: item.url }))} />
        </section>

        <section id="steps">
          <SectionTitle title="실습 순서" description="문단형 설명 대신, 지금 해야 할 행동만 단계별로 보여 줍니다." />
          <div className="card-grid">
            {module.steps.map((step, index) => (
              <ModuleStepCard key={`${module.slug}-${step.title}`} step={step} index={index} />
            ))}
          </div>
        </section>

        <section id="prompts">
          <SectionTitle title="복사해서 바로 쓰는 프롬프트" description="어디에 붙여 넣는지와 어떤 결과가 나오는지 먼저 읽고 복사하면 됩니다." />
          <div className="card-grid dual">
            {relatedPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        <section id="examples">
          <SectionTitle title="예시 결과" description="강사가 먼저 보여 줄 수 있는 결과 예시만 선별했습니다." />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </section>

        <section className="board-grid" id="resources">
          <ResourceList items={relatedResources} onNavigate={onNavigate} />
          <PadletCard text={module.padletCtaText} url={currentSession.padletUrl} />
        </section>
      </div>
    </div>
  )
}

export function PromptsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('전체')
  const [tagFilter, setTagFilter] = useState('전체')
  const [difficultyFilter, setDifficultyFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)
  const tools = useMemo(() => Array.from(new Set(prompts.map((item) => item.relatedTool))), [])
  const tags = useMemo(() => Array.from(new Set(prompts.flatMap((item) => item.tags))), [])
  const difficulties = useMemo(
    () => Array.from(new Set(prompts.map((item) => item.difficulty ?? '기초'))),
    [],
  )

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return prompts.filter((item) => {
      const difficulty = item.difficulty ?? '기초'
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.body.toLowerCase().includes(normalizedQuery) ||
        item.exampleUse.toLowerCase().includes(normalizedQuery)
      const matchesTool = toolFilter === '전체' || item.relatedTool === toolFilter
      const matchesTag = tagFilter === '전체' || item.tags.includes(tagFilter)
      const matchesDifficulty = difficultyFilter === '전체' || difficulty === difficultyFilter

      return matchesQuery && matchesTool && matchesTag && matchesDifficulty
    })
  }, [deferredQuery, difficultyFilter, tagFilter, toolFilter])

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="프롬프트 허브"
        title="찾기보다 바로 쓰기에 맞춘 프롬프트 보드"
        description="도구, 태그, 난이도로 빠르게 좁힌 뒤 복사 버튼을 바로 누를 수 있게 구성했습니다."
      />

      <section className="filters-shell">
        <SearchField label="프롬프트 검색" value={query} onChange={setQuery} placeholder="예: Canva 앱, 수업 설계, 가정통신문" />
        <TagFilter label="도구별" options={tools} selected={toolFilter} onSelect={setToolFilter} />
        <TagFilter label="태그별" options={tags} selected={tagFilter} onSelect={setTagFilter} />
        <TagFilter label="난이도별" options={difficulties} selected={difficultyFilter} onSelect={setDifficultyFilter} />
      </section>

      <div className="card-grid dual">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  )
}

export function PromptDetailPage({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const relatedModules = courseModules.filter((module) => module.prompts.includes(prompt.slug))
  const relatedExamples = examples.filter((example) => example.relatedPrompt === prompt.slug)

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="프롬프트 상세"
        title={prompt.title}
        description={prompt.exampleUse}
        actions={[{ label: '프롬프트 허브', href: '/prompts', kind: 'ghost' }]}
      />

      <section className="board-grid">
        <PromptCard prompt={prompt} onNavigate={onNavigate} />
        <SupportCard
          title="이 프롬프트를 쓸 때 기억할 점"
          description="결과 품질은 입력 정보의 구체성에 크게 좌우됩니다."
          items={[
            prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`,
            prompt.expectedOutput ?? '초안을 받은 뒤 필요한 부분만 다시 수정 요청하면 됩니다.',
            '학년, 과목, 시간, 출력 형식을 넣으면 현장 적합성이 더 올라갑니다.',
          ]}
        />
      </section>

      <section className="board-grid">
        <div>
          <SectionTitle title="관련 모듈" description="이 프롬프트를 실제 연수 흐름에서 어디에 쓰는지 바로 연결합니다." />
          <div className="card-grid">
            {relatedModules.map((module) => (
              <ModuleSummaryCard key={module.slug} module={module} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="관련 예시" description="이 프롬프트로 만들 수 있는 결과 예시입니다." />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </div>
      </section>
    </div>
  )
}

export function ExamplesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)
  const tools = useMemo(() => Array.from(new Set(examples.map((item) => item.tool))), [])

  const filteredExamples = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return examples.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.useCase.toLowerCase().includes(normalizedQuery)
      const matchesTool = toolFilter === '전체' || item.tool === toolFilter
      return matchesQuery && matchesTool
    })
  }, [deferredQuery, toolFilter])

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="예시 갤러리"
        title="강사가 먼저 보여 줄 결과 예시"
        description="과장된 포트폴리오가 아니라, 교실 맥락에서 바로 쓸 수 있는 결과물만 모았습니다."
      />

      <section className="filters-shell">
        <SearchField label="예시 검색" value={query} onChange={setQuery} placeholder="예: 학습지, 슬라이드, 차시안" />
        <TagFilter label="도구별" options={tools} selected={toolFilter} onSelect={setToolFilter} />
      </section>

      <ExampleGallery items={filteredExamples} onNavigate={onNavigate} />
    </div>
  )
}

export function ResourcesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('전체')
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)
  const types = useMemo(() => Array.from(new Set(resources.map((item) => item.type))), [])
  const categories = useMemo(() => Array.from(new Set(resources.map((item) => item.category))), [])

  const filteredResources = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return resources.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      const matchesType = typeFilter === '전체' || item.type === typeFilter
      const matchesCategory = categoryFilter === '전체' || item.category === categoryFilter
      return matchesQuery && matchesType && matchesCategory
    })
  }, [categoryFilter, deferredQuery, typeFilter])

  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="자료실"
        title="배포 자료와 공식 도구 링크 모음"
        description="수강생에게 바로 전달할 파일과 공식 링크만 남겨 두었습니다."
      />

      <section className="filters-shell">
        <SearchField label="자료 검색" value={query} onChange={setQuery} placeholder="예: PDF, Padlet, Canva" />
        <TagFilter label="형식별" options={types} selected={typeFilter} onSelect={setTypeFilter} />
        <TagFilter label="카테고리별" options={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
      </section>

      <ResourceList items={filteredResources} onNavigate={onNavigate} />
    </div>
  )
}

export function GuidePage() {
  return (
    <div className="page-stack">
      <PageToolbar
        eyebrow="가이드"
        title="막히는 순간 바로 해결하는 지원 카드"
        description="긴 FAQ 대신, 초보 교사가 가장 자주 겪는 문제 3가지만 빠르게 해결할 수 있게 정리했습니다."
      />

      <section className="card-grid triple">
        <SupportCard
          title="로그인이 안 될 때"
          description="실습 전에 계정 상태를 먼저 안정화하면 흐름이 훨씬 부드럽습니다."
          items={[
            '구글 계정이 브라우저에 로그인되어 있는지 먼저 확인합니다.',
            '학교망에서 차단되면 모바일 핫스팟을 예비안으로 둡니다.',
            '모든 도구가 안 열리면 텍스트 프롬프트 실습부터 먼저 진행합니다.',
          ]}
        />
        <SupportCard
          title="복사 버튼이 잘 안 될 때"
          description="브라우저 권한 이슈가 있어도 실습을 멈추지 않게 준비합니다."
          items={[
            '복사 버튼을 먼저 눌러 보고, 안 되면 본문을 길게 눌러 수동 복사를 시도합니다.',
            '모바일에서는 입력창보다 본문 블록을 직접 선택하는 편이 더 잘 됩니다.',
            '반드시 복사까지 기다리지 말고, 첫 줄만 붙여 넣고 이어서 진행해도 괜찮습니다.',
          ]}
        />
        <SupportCard
          title="결과가 이상하거나 너무 길 때"
          description="대부분은 입력이 넓어서 생기는 문제입니다."
          items={[
            '학년, 과목, 시간, 출력 형식을 추가합니다.',
            '항목 수를 제한해 달라고 요청합니다.',
            '한 번에 다 바꾸지 말고, 먼저 더 짧게 다시 써 달라고 요청합니다.',
          ]}
        />
      </section>
    </div>
  )
}

export function NotFoundPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack">
      <section className="glass-panel empty-state">
        <h1>페이지를 찾지 못했습니다.</h1>
        <p>정적 배포 경로가 아직 준비되지 않았거나 주소가 잘못 들어온 상태입니다.</p>
        <button type="button" className="button solid" onClick={() => onNavigate('/')}>
          홈으로 이동
        </button>
      </section>
    </div>
  )
}
