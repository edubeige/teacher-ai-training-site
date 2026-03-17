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
  ExampleGallery,
  InfoListCard,
  ModuleRail,
  ModuleStepCard,
  ModuleSummaryCard,
  PadletCard,
  PageToolbar,
  PromptCard,
  PromptListCard,
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

function getFeaturedModules() {
  return currentSession.featuredModules
    .map((slug) => moduleMap.get(slug))
    .filter((item): item is ModuleItem => Boolean(item))
}

export function HomePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <TodayPage onNavigate={onNavigate} />
}

export function TodayPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const featuredModules = getFeaturedModules()
  const quickTools = Object.values(toolLinkMap).filter((item) => (currentSession.mustOpenTools ?? []).includes(item.title))

  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="오늘 연수"
        title={currentSession.trainingTitle}
        description="내일 연수는 Gemini 이미지 생성, Grok 영상 생성, 프롬프트 설계, AI 글쓰기 순서로 진행합니다."
        actions={[
          { label: currentSession.primaryAction ?? '첫 모듈 시작', href: `/modules/${featuredModules[0]?.slug ?? courseModules[0].slug}`, kind: 'solid' },
          { label: currentSession.secondaryAction ?? '프롬프트 허브 열기', href: '/prompts', kind: 'outline' },
        ]}
      />

      <section className="today-top-grid">
        <InfoListCard
          label={currentSession.agendaTitle ?? '오늘 핵심 흐름'}
          title="무엇을 먼저 하고, 무엇을 나중에 하는지 먼저 봅니다."
          items={[
            'Gemini와 Grok을 먼저 엽니다.',
            '프롬프트를 짧게 바꾸는 법을 익힙니다.',
            '이미지와 영상을 만들고, 마지막에 글을 다듬습니다.',
          ]}
        />
        <InfoListCard
          label="바로 시작"
          title="처음 접속했다면 이 순서만 따라오세요."
          items={currentSession.quickStartSteps ?? []}
        />
        <ToolStackCard title="필수 도구" items={quickTools} />
      </section>

      <section className="today-main-grid">
        <ScheduleBoard modules={featuredModules} onNavigate={onNavigate} />
        <div className="side-stack">
          <SessionInfoCard schoolName={currentSession.schoolName} date={currentSession.date} instructor={currentSession.instructor} />
          <SupportCard title="오늘 공지" description="실습 중 자주 막히는 지점을 먼저 줄이기 위한 안내입니다." items={currentSession.notices} />
          <PadletCard text="오늘 결과 공유는 Padlet에서 진행합니다." url={currentSession.padletUrl} />
        </div>
      </section>
    </div>
  )
}

export function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="실습 모듈"
        title="내일 연수의 전체 실습 흐름"
        description="순서대로 진행해도 되고, 필요한 모듈만 골라 열어도 이해되도록 구성했습니다."
      />

      <div className="card-grid dual">
        {courseModules.map((module) => (
          <ModuleSummaryCard key={module.slug} module={module} onNavigate={onNavigate} />
        ))}
      </div>
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
  const toolItems = module.externalLinks.map((item) => ({ title: item.label, description: item.description, url: item.url }))

  return (
    <div className="module-layout">
      <ModuleRail module={module} />

      <div className="page-stack module-page-limit">
        <section className="module-summary-hero" id="overview">
          <div className="meta-row">
            <span>{module.tool}</span>
            <span>{module.difficulty}</span>
          </div>
          <h1>{module.title}</h1>
          <p>{module.summary}</p>

          <div className="module-overview-grid">
            <article className="detail-card">
              <span>기대 결과</span>
              <strong>{module.expectedOutcome ?? module.goal}</strong>
            </article>
            <article className="detail-card">
              <span>예상 시간</span>
              <strong>{module.estimatedTime}</strong>
            </article>
            <article className="detail-card">
              <span>실수 방지</span>
              <strong>{module.commonMistake ?? '한 번에 너무 많은 조건을 넣지 마세요.'}</strong>
            </article>
            <article className="detail-card">
              <span>막히면 이렇게</span>
              <strong>{module.fallbackAction ?? '더 짧고 단순하게 다시 요청하세요.'}</strong>
            </article>
          </div>
        </section>

        <section className="module-top-grid" id="prepare">
          <ToolStackCard title="이 모듈에서 여는 도구" items={toolItems} />
          <InfoListCard label="준비물" title="시작 전에 이것만 확인하세요." items={module.preparations} />
        </section>

        {module.waitNote ? (
          <SupportCard title="대기 시간 안내" description="영상 생성처럼 시간이 걸리는 실습은 흐름을 끊지 않게 다룹니다." items={[module.waitNote]} />
        ) : null}

        <section id="steps">
          <SectionTitle title="실습 순서" description="긴 설명 대신, 따라 하기 쉬운 행동 문장만 단계별로 배치했습니다." />
          <div className="card-grid">
            {module.steps.map((step, index) => (
              <ModuleStepCard key={`${module.slug}-${step.title}`} step={step} index={index} />
            ))}
          </div>
        </section>

        <section id="prompts">
          <SectionTitle title="바로 복사할 프롬프트" description="이 모듈에서 바로 쓰는 프롬프트만 남겼습니다." />
          <div className="card-grid dual">
            {relatedPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} compact />
            ))}
          </div>
        </section>

        {relatedExamples.length > 0 ? (
          <section id="examples">
            <SectionTitle title="예시 결과" description="강사가 먼저 보여 줄 수 있는 예시만 붙였습니다." />
            <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
          </section>
        ) : null}

        <section className="module-bottom-grid" id="resources">
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
  const [categoryFilter, setCategoryFilter] = useState('전체')
  const [difficultyFilter, setDifficultyFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)
  const tools = useMemo(() => Array.from(new Set(prompts.map((item) => item.relatedTool))), [])
  const categories = useMemo(() => Array.from(new Set(prompts.map((item) => item.category))), [])
  const difficulties = useMemo(() => Array.from(new Set(prompts.map((item) => item.difficulty ?? '기초'))), [])

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return prompts.filter((item) => {
      const difficulty = item.difficulty ?? '기초'
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.exampleUse.toLowerCase().includes(normalizedQuery) ||
        (item.useCase ?? '').toLowerCase().includes(normalizedQuery)
      const matchesTool = toolFilter === '전체' || item.relatedTool === toolFilter
      const matchesCategory = categoryFilter === '전체' || item.category === categoryFilter
      const matchesDifficulty = difficultyFilter === '전체' || difficulty === difficultyFilter
      return matchesQuery && matchesTool && matchesCategory && matchesDifficulty
    })
  }, [categoryFilter, deferredQuery, difficultyFilter, toolFilter])

  return (
    <div className="page-stack prompt-page-shell">
      <PageToolbar
        eyebrow="프롬프트"
        title="도구, 용도, 난이도로 빠르게 좁히는 프롬프트 보드"
        description="카드에는 요점만 보이게 하고, 전체 본문과 변수 입력은 상세 보기에서 확인하도록 정리했습니다."
      />

      <section className="prompt-hub-layout">
        <aside className="filters-shell filter-rail">
          <SearchField label="프롬프트 검색" value={query} onChange={setQuery} placeholder="예: 이미지, 영상, 글쓰기" />
          <TagFilter label="도구별" options={tools} selected={toolFilter} onSelect={setToolFilter} />
          <TagFilter label="용도별" options={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
          <TagFilter label="난이도별" options={difficulties} selected={difficultyFilter} onSelect={setDifficultyFilter} />
        </aside>

        <div className="prompt-list-shell">
          {filteredPrompts.map((prompt) => (
            <PromptListCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
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
    <div className="page-stack page-limit">
      <PageToolbar eyebrow="프롬프트 상세" title={prompt.title} description={prompt.exampleUse} actions={[{ label: '프롬프트 목록', href: '/prompts', kind: 'ghost' }]} />

      <section className="prompt-detail-grid">
        <PromptCard prompt={prompt} onNavigate={onNavigate} />
        <SupportCard
          title="이 프롬프트를 더 잘 쓰는 법"
          description="실행 위치와 예상 결과를 먼저 읽고 쓰면 초보자도 덜 막힙니다."
          items={[
            prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`,
            prompt.expectedOutput ?? '수정 가능한 초안을 받습니다.',
            prompt.outputFormat ?? '출력 형식은 필요한 만큼 더 짧게 줄여 다시 요청할 수 있습니다.',
          ]}
        />
      </section>

      <section className="board-grid">
        <div>
          <SectionTitle title="관련 모듈" description="이 프롬프트가 실제 연수 흐름의 어디에서 쓰이는지 바로 연결합니다." />
          <div className="card-grid">
            {relatedModules.map((module) => (
              <ModuleSummaryCard key={module.slug} module={module} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {relatedExamples.length > 0 ? (
          <div>
            <SectionTitle title="관련 예시" description="이 프롬프트로 만들 수 있는 결과 예시입니다." />
            <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
          </div>
        ) : null}
      </section>
    </div>
  )
}

export function ExamplesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar eyebrow="예시" title="모듈과 프롬프트 안에서 함께 보는 예시" description="상위 메뉴에서는 숨겼지만, 직접 링크로 들어오면 전체 예시를 한 번에 볼 수 있습니다." />
      <ExampleGallery items={examples} onNavigate={onNavigate} />
    </div>
  )
}

export function ResourcesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const helpItems = [
    '로그인이 안 되면 Gemini와 Grok 중 먼저 되는 도구부터 시작하세요.',
    '복사 버튼이 안 되면 프롬프트 본문을 직접 선택해 붙여 넣으세요.',
    '결과가 길면 항목 수를 줄여 달라고 다시 요청하세요.',
  ]

  return (
    <div className="page-stack page-limit">
      <PageToolbar eyebrow="자료/도움" title="내일 바로 쓰는 자료와 문제 해결 안내" description="배포 자료, 공식 도구 링크, 현장 대응 문구를 한 페이지에 묶었습니다." />

      <section className="board-grid">
        <div>
          <SectionTitle title="배포 자료와 공식 도구" />
          <ResourceList items={resources} onNavigate={onNavigate} />
        </div>
        <div className="side-stack">
          <SupportCard title="막히는 경우 바로 보기" description="문제 해결 카드를 따로 찾지 않게 여기로 모았습니다." items={helpItems} />
          <PadletCard text="Padlet 바로 열기" url={currentSession.padletUrl} />
        </div>
      </section>
    </div>
  )
}

export function GuidePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <ResourcesPage onNavigate={onNavigate} />
}

export function NotFoundPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <section className="empty-state">
        <h1>페이지를 찾지 못했습니다.</h1>
        <p>주소가 잘못되었거나 아직 이 경로는 사용하지 않는 상태입니다.</p>
        <button type="button" className="button solid" onClick={() => onNavigate('/today')}>
          오늘 연수로 이동
        </button>
      </section>
    </div>
  )
}
