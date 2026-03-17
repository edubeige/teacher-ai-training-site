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
  HelpStrip,
  IntroCard,
  PadletCard,
  PageToolbar,
  PromptCard,
  PromptListCard,
  PromptRecipeCard,
  ResourceList,
  ScheduleBoard,
  ScreenshotGuideCard,
  SearchField,
  SectionTitle,
  SessionInfoCard,
  StepFooterNav,
  StepIndicator,
  StepTaskCard,
  SupportCard,
  ToolLinkCard,
  ModuleStepCard,
} from './components/ui'

const moduleMap = new Map(courseModules.map((module) => [module.slug, module]))

function getFeaturedModules() {
  return currentSession.featuredModules
    .map((slug) => moduleMap.get(slug))
    .filter((item): item is ModuleItem => Boolean(item))
}

function getStepNeighbors(slug: string) {
  const currentIndex = courseModules.findIndex((module) => module.slug === slug)
  return {
    previous: currentIndex > 0 ? courseModules[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < courseModules.length - 1 ? courseModules[currentIndex + 1] : null,
  }
}

function getRelatedPrompts(module: ModuleItem) {
  return module.prompts.map((slug) => promptMap.get(slug)).filter((item): item is PromptItem => Boolean(item))
}

function getRelatedExamples(module: ModuleItem) {
  return module.examples.map((slug) => exampleMap.get(slug)).filter((item): item is ExampleItem => Boolean(item))
}

function getRelatedResources(module: ModuleItem) {
  return module.resources.map((title) => resourceMap.get(title)).filter((item): item is ResourceItem => Boolean(item))
}

export function HomePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <TodayPage onNavigate={onNavigate} />
}

export function TodayPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const featuredModules = getFeaturedModules()
  const firstModule = featuredModules[0] ?? courseModules[0]
  const quickTools = Object.values(toolLinkMap).filter((item) => (currentSession.mustOpenTools ?? []).includes(item.title))

  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="시작하기"
        title={currentSession.trainingTitle}
        description="이 사이트는 초보 교사를 위한 따라하기 매뉴얼입니다. 1단계부터 순서대로 누르면서 Gemini, Grok, Padlet 실습을 진행하면 됩니다."
        actions={[{ label: currentSession.primaryAction ?? '1단계 시작하기', href: `/modules/${firstModule.slug}`, kind: 'solid' }]}
      />

      <StepIndicator currentStep={1} />

      <section className="starter-grid">
        <IntroCard
          label={currentSession.agendaTitle ?? '오늘 연수에서 할 일'}
          title="오늘은 순서대로 따라 하면 됩니다."
          tone="blue"
          items={featuredModules.map((module) => `${module.stepNumber}. ${module.title}`)}
        />
        <StepTaskCard module={firstModule} />
      </section>

      <section className="manual-grid">
        <section className="manual-panel">
          <div className="panel-heading">
            <span className="panel-label">지금 먼저 할 일</span>
            <strong>실습 전에 이 3개만 먼저 열어 두세요.</strong>
          </div>
          <div className="tool-grid">
            {quickTools.map((item) => (
              <ToolLinkCard key={item.title} title={item.title} description={item.description} url={item.url} />
            ))}
          </div>
        </section>
        <SessionInfoCard schoolName={currentSession.schoolName} date={currentSession.date} instructor={currentSession.instructor} />
      </section>

      <section className="manual-grid wide">
        <ScheduleBoard modules={featuredModules} onNavigate={onNavigate} />
        <SupportCard
          title="시작 전에 이것만 기억하세요"
          description="설명은 이 사이트에서 보고, 결과 공유는 Padlet에서만 진행하면 흐름이 덜 복잡합니다."
          items={currentSession.notices}
        />
      </section>

      <HelpStrip items={currentSession.supportNotes ?? []} />
    </div>
  )
}

export function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="전체 단계"
        title="오늘 연수 전체 순서"
        description="1단계부터 5단계까지 이어지는 실습 흐름을 한눈에 보고, 필요한 단계로 바로 이동할 수 있습니다."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />

      <StepIndicator currentStep={0} />
      <ScheduleBoard modules={courseModules} onNavigate={onNavigate} />

      <section className="manual-grid">
        <SupportCard
          title="처음인 경우에는"
          description="중간 단계부터 들어가기보다 1단계부터 시작하면 훨씬 덜 헷갈립니다."
          items={[
            '1단계에서 Gemini, Grok, Padlet을 먼저 열어 두세요.',
            '2단계에서 프롬프트 바꾸기 감각을 먼저 익히세요.',
            '그 뒤 이미지, 영상, 글쓰기 순서로 넘어가면 됩니다.',
          ]}
        />
        <ResourceList items={resources.slice(0, 3)} onNavigate={onNavigate} />
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
  const relatedPrompts = getRelatedPrompts(module)
  const relatedExamples = getRelatedExamples(module)
  const relatedResources = getRelatedResources(module)
  const { previous, next } = getStepNeighbors(module.slug)

  return (
    <div className="page-stack module-page-limit">
      <PageToolbar
        eyebrow={`Step ${module.stepNumber}`}
        title={`${module.stepNumber}. ${module.title}`}
        description={module.summary}
        actions={
          module.primaryToolUrl
            ? [{ label: module.ctaLabel ?? '지금 하기', href: module.primaryToolUrl, kind: 'solid', external: true }]
            : []
        }
      />

      <StepIndicator currentStep={module.stepNumber ?? 1} />

      <div className="manual-grid wide">
        <StepTaskCard module={module} />
        <ScreenshotGuideCard module={module} />
      </div>

      <HelpStrip
        items={[
          `목표: ${module.expectedOutcome ?? module.goal}`,
          `예상 시간: ${module.estimatedTime}`,
          `실수 방지: ${module.commonMistake ?? '한 번에 너무 많은 조건을 넣지 마세요.'}`,
        ]}
      />

      <section className="manual-grid wide">
        <section className="manual-panel">
          <div className="panel-heading">
            <span className="panel-label">열어야 할 도구</span>
            <strong>이 단계에서 누를 버튼</strong>
          </div>
          <div className="tool-grid">
            {module.externalLinks.map((item) => (
              <ToolLinkCard key={item.label} title={item.label} description={item.description} url={item.url} />
            ))}
          </div>
        </section>
        <SupportCard
          title="막히면 이렇게 하세요"
          description="실패해도 괜찮습니다. 아래 순서대로만 다시 시도하면 됩니다."
          items={[
            module.fallbackAction ?? '문장을 더 짧게 줄여 다시 요청하세요.',
            ...(module.waitNote ? [module.waitNote] : []),
            ...module.blockers.map((blocker) => `${blocker.question} ${blocker.answer}`),
          ]}
        />
      </section>

      <section>
        <SectionTitle title="이 단계에서 따라 할 순서" description="아래 순서대로 하나씩만 진행하세요." />
        <div className="process-list">
          {module.steps.map((step, index) => (
            <ModuleStepCard key={`${module.slug}-${step.title}`} step={step} index={index} />
          ))}
        </div>
      </section>

      {relatedPrompts.length > 0 ? (
        <section>
          <SectionTitle title="복사해서 바로 쓰는 프롬프트" description="열린 도구 입력창에 그대로 붙여 넣으면 됩니다." />
          <div className="recipe-list">
            {relatedPrompts.map((prompt) => (
              <PromptRecipeCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedExamples.length > 0 ? (
        <section>
          <SectionTitle title="예시 결과" description="강사가 먼저 보여 주거나, 어떤 결과를 기대하면 되는지 확인하는 용도입니다." />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </section>
      ) : null}

      <section className="manual-grid wide">
        <div>
          <SectionTitle title="자료와 공식 도구" description="필요하면 이 단계 자료와 공식 도구를 바로 열 수 있습니다." />
          <ResourceList items={relatedResources} onNavigate={onNavigate} />
        </div>
        <PadletCard text={module.padletCtaText} url={currentSession.padletUrl} description={module.padletInstruction} />
      </section>

      <StepFooterNav
        previousHref={previous ? `/modules/${previous.slug}` : '/today'}
        previousLabel={previous ? previous.title : '시작하기'}
        nextHref={next ? `/modules/${next.slug}` : '/resources'}
        nextLabel={next ? next.title : '자료/도움'}
      />
    </div>
  )
}

export function PromptsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)

  const toolOrder = useMemo(() => ['Gemini', 'Grok'], [])

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return prompts.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.exampleUse.toLowerCase().includes(normalizedQuery) ||
        (item.whereToUse ?? '').toLowerCase().includes(normalizedQuery)
      const matchesTool = toolFilter === '전체' || item.relatedTool === toolFilter
      return matchesQuery && matchesTool
    })
  }, [deferredQuery, toolFilter])

  const groupedPrompts = useMemo(() => {
    return toolOrder
      .map((tool) => ({
        tool,
        items: filteredPrompts.filter((prompt) => prompt.relatedTool === tool),
      }))
      .filter((group) => group.items.length > 0)
  }, [filteredPrompts, toolOrder])

  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="보조 도구"
        title="도구별 실습 프롬프트 모음"
        description="이 페이지는 메인 실습을 하다가 필요할 때 참고하는 보조 페이지입니다. 지금 쓰는 도구 기준으로 필요한 프롬프트만 골라 보세요."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />

      <section className="prompt-filter-bar">
        <SearchField label="프롬프트 검색" value={query} onChange={setQuery} placeholder="예: 이미지, 영상, 글쓰기" />
        <div className="filter-inline">
          <button type="button" className={`filter-chip ${toolFilter === '전체' ? 'active' : ''}`} onClick={() => setToolFilter('전체')}>
            전체
          </button>
          {toolOrder.map((tool) => (
            <button key={tool} type="button" className={`filter-chip ${toolFilter === tool ? 'active' : ''}`} onClick={() => setToolFilter(tool)}>
              {tool}
            </button>
          ))}
        </div>
      </section>

      <div className="prompt-group-stack">
        {groupedPrompts.map((group) => (
          <section key={group.tool} className="manual-panel">
            <div className="panel-heading">
              <span className="panel-label">{group.tool}</span>
              <strong>{group.tool === 'Gemini' ? 'Gemini에서 바로 쓰는 프롬프트' : 'Grok에서 바로 쓰는 프롬프트'}</strong>
            </div>
            <div className="prompt-list-stack">
              {group.items.map((prompt) => (
                <PromptListCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
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
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="프롬프트 상세"
        title={prompt.title}
        description="어디를 눌러 들어가고, 어디에 붙여 넣고, 결과가 다르면 어떻게 고칠지까지 함께 정리한 카드입니다."
        actions={[{ label: '프롬프트 목록', href: '/prompts', kind: 'outline' }]}
      />

      <PromptCard prompt={prompt} onNavigate={onNavigate} />

      <section className="manual-grid wide">
        <SupportCard
          title="이 프롬프트를 쓸 때 기억할 점"
          description="초보자일수록 실행 위치와 수정 방법을 같이 보면 덜 막힙니다."
          items={[
            `들어가는 곳: ${prompt.clickPath ?? prompt.whereToUse ?? `${prompt.relatedTool} 입력창`}`,
            `붙여 넣은 뒤 확인: ${prompt.afterPasteHint ?? '결과가 바로 읽히는지 확인하세요.'}`,
            `결과 수정 팁: ${prompt.fixTip ?? '조건을 줄이거나 더 구체적으로 다시 요청하세요.'}`,
          ]}
        />
        <PadletCard text="결과는 Padlet에 공유하기" url={currentSession.padletUrl} />
      </section>

      {relatedModules.length > 0 ? (
        <section>
          <SectionTitle title="어느 단계에서 쓰는 프롬프트인가요?" description="아래 단계에서 이 프롬프트를 바로 사용할 수 있습니다." />
          <div className="link-list">
            {relatedModules.map((module) => (
              <button key={module.slug} type="button" className="link-row" onClick={() => onNavigate(`/modules/${module.slug}`)}>
                <span>{module.stepNumber}. {module.title}</span>
                <small>{module.summary}</small>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {relatedExamples.length > 0 ? (
        <section>
          <SectionTitle title="관련 예시" description="실제로 어떤 결과를 기대하면 되는지 먼저 확인해 보세요." />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </section>
      ) : null}
    </div>
  )
}

export function ExamplesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="예시"
        title="참고용 결과 예시"
        description="상위 메뉴에는 보이지 않지만, 직접 경로로 들어오면 예시 결과만 따로 볼 수 있습니다."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />
      <ExampleGallery items={examples} onNavigate={onNavigate} />
    </div>
  )
}

export function ResourcesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="자료/도움"
        title="배포 자료와 도움말"
        description="연수 PDF, 공식 도구 링크, 현장에서 자주 막히는 지점을 한 번에 모아 둔 페이지입니다."
      />

      <section className="manual-grid wide">
        <div>
          <SectionTitle title="자료와 공식 링크" description="필요한 파일과 공식 도구를 여기서 바로 여세요." />
          <ResourceList items={resources} onNavigate={onNavigate} />
        </div>
        <div className="side-stack">
          <SupportCard
            title="자주 막히는 상황"
            description="실습 중 질문이 많았던 부분만 짧게 모았습니다."
            items={[
              '복사 버튼이 안 되면 프롬프트 본문을 길게 눌러 직접 복사하세요.',
              'Grok 영상이 오래 걸리면 글쓰기 단계로 먼저 넘어가세요.',
              '결과가 길면 항목 수를 줄여 달라고 다시 요청하세요.',
            ]}
          />
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
        <p>주소가 잘못되었거나 아직 연결되지 않은 페이지입니다.</p>
        <button type="button" className="button solid" onClick={() => onNavigate('/today')}>
          시작 페이지로 이동
        </button>
      </section>
    </div>
  )
}
