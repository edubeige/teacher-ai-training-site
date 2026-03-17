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
  MobileStepBar,
  NoteBlock,
  PadletSubmitBlock,
  PageToolbar,
  PrimaryTask,
  PromptDetailBlock,
  PromptInline,
  PromptListItem,
  ResourceList,
  ScreenGuide,
  SearchField,
  SessionMeta,
  StartSummary,
  StepHeader,
  StepList,
  StepNav,
  StepSection,
  ToolActionBlock,
  WorkbookSheet,
  InfoInline,
  InstructionList,
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
        eyebrow="연수 시작"
        title={currentSession.trainingTitle}
        description="이 사이트는 초보 교사가 순서대로 따라 하는 실습 워크북입니다. 카드 탐색보다 1단계부터 차례대로 진행하는 흐름에 맞춰 사용하세요."
        actions={[{ label: currentSession.primaryAction ?? '1단계 시작하기', href: `/modules/${firstModule.slug}`, kind: 'solid' }]}
      />

      <MobileStepBar currentStep={1} />

      <div className="start-layout">
        <StartSummary
          title="오늘 할 일은 딱 5단계입니다."
          items={featuredModules.map((module) => `${module.stepNumber}. ${module.title}`)}
        />
        <PrimaryTask
          label="지금 먼저 해야 할 일"
          title={firstModule.toolInstruction ?? 'Gemini부터 열고 1단계를 시작하세요.'}
          description={firstModule.entryHint ?? firstModule.summary}
          action={{
            label: currentSession.primaryAction ?? '1단계 시작하기',
            href: `/modules/${firstModule.slug}`,
          }}
        />
      </div>

      <ToolActionBlock items={quickTools} />
      <SessionMeta schoolName={currentSession.schoolName} date={currentSession.date} instructor={currentSession.instructor} />
      <StepList modules={featuredModules} onNavigate={onNavigate} />
      <NoteBlock title="시작 전에 이것만 기억하세요" description="흐름을 단순하게 유지하면 훨씬 덜 헷갈립니다." items={currentSession.notices} />
    </div>
  )
}

export function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="전체 단계"
        title="오늘 연수 전체 순서"
        description="모든 단계의 순서를 미리 보는 페이지입니다. 처음이라면 여기서 훑고 바로 1단계로 들어가면 됩니다."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />

      <MobileStepBar currentStep={0} />
      <StepList modules={courseModules} onNavigate={onNavigate} />
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
        description="아래 순서대로만 따라 하면 됩니다. 중간에 필요한 프롬프트와 Padlet 제출도 이 페이지 안에서 이어집니다."
        actions={
          module.primaryToolUrl
            ? [{ label: module.ctaLabel ?? '지금 하기', href: module.primaryToolUrl, kind: 'solid', external: true }]
            : []
        }
      />

      <MobileStepBar currentStep={module.stepNumber ?? 1} />

      <StepHeader module={module} />

      <StepSection title="지금 할 일" description="페이지에서 가장 먼저 보이는 행동만 따라 하세요.">
        <PrimaryTask
          label="이 단계의 첫 행동"
          title={module.toolInstruction ?? `${module.tool}을 열고 시작하세요.`}
          description={module.entryHint ?? module.summary}
          action={
            module.primaryToolUrl
              ? {
                  label: module.ctaLabel ?? '지금 열기',
                  href: module.primaryToolUrl,
                  external: true,
                }
              : undefined
          }
        />
        <InfoInline
          items={[
            `예상 시간 ${module.estimatedTime}`,
            module.difficulty,
            module.expectedOutcome ?? module.goal,
          ]}
        />
      </StepSection>

      <StepSection title="어디를 눌러야 하나요" description="탭이나 입력창 위치를 먼저 확인한 뒤 진행하세요.">
        <ScreenGuide module={module} />
      </StepSection>

      <StepSection title="따라 하기 순서" description="위에서 아래로 번호대로만 진행하면 됩니다.">
        <InstructionList steps={module.steps} />
      </StepSection>

      {relatedPrompts.length > 0 ? (
        <StepSection title="이 단계에서 필요한 프롬프트" description="지금 필요한 프롬프트만 여기서 바로 복사하세요.">
          <div className="inline-stack">
            {relatedPrompts.map((prompt) => (
              <PromptInline key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </StepSection>
      ) : null}

      {relatedExamples.length > 0 ? (
        <StepSection title="결과 예시" description="어떤 결과를 기대하면 되는지 먼저 확인해 보세요.">
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </StepSection>
      ) : null}

      <StepSection title="막히면 이렇게 하세요" description="실패해도 괜찮습니다. 아래 문장대로 다시 시도하면 됩니다." accent="apricot">
        <WorkbookSheet accent="apricot">
          <ul className="plain-notes">
            <li>{module.commonMistake ?? '한 번에 너무 많은 조건을 넣지 마세요.'}</li>
            <li>{module.fallbackAction ?? '문장을 더 짧게 줄여 다시 요청하세요.'}</li>
            {module.waitNote ? <li>{module.waitNote}</li> : null}
            {module.blockers.map((blocker) => (
              <li key={blocker.question}>{`${blocker.question} ${blocker.answer}`}</li>
            ))}
          </ul>
        </WorkbookSheet>
      </StepSection>

      <StepSection title="자료와 공식 도구" description="필요한 자료만 이 단계 끝에서 확인하면 됩니다.">
        <ResourceList items={relatedResources} onNavigate={onNavigate} />
      </StepSection>

      <PadletSubmitBlock text={module.padletCtaText} url={currentSession.padletUrl} description={module.padletInstruction} />

      <StepNav
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

  const groupedPrompts = useMemo(
    () =>
      toolOrder
        .map((tool) => ({
          tool,
          items: filteredPrompts.filter((prompt) => prompt.relatedTool === tool),
        }))
        .filter((group) => group.items.length > 0),
    [filteredPrompts, toolOrder],
  )

  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="보조 자료"
        title="도구별 프롬프트 참고 모음"
        description="메인 실습 바깥에서 참고할 때만 여는 보조 페이지입니다. 지금 쓰는 도구 기준으로 필요한 프롬프트만 확인하세요."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />

      <WorkbookSheet>
        <div className="prompt-filter-row">
          <SearchField label="프롬프트 검색" value={query} onChange={setQuery} placeholder="예: 이미지, 영상, 글쓰기" />
          <div className="chip-row">
            <button type="button" className={`filter-chip ${toolFilter === '전체' ? 'active' : ''}`} onClick={() => setToolFilter('전체')}>
              전체
            </button>
            {toolOrder.map((tool) => (
              <button key={tool} type="button" className={`filter-chip ${toolFilter === tool ? 'active' : ''}`} onClick={() => setToolFilter(tool)}>
                {tool}
              </button>
            ))}
          </div>
        </div>
      </WorkbookSheet>

      {groupedPrompts.map((group) => (
        <StepSection key={group.tool} title={`${group.tool} 프롬프트`} description="필요한 것만 골라 복사해서 쓰면 됩니다.">
          <div className="inline-stack">
            {group.items.map((prompt) => (
              <PromptListItem key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </StepSection>
      ))}
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
        description="실행 위치, 붙여 넣은 뒤 확인할 점, 수정 방법까지 함께 보는 참고 페이지입니다."
        actions={[{ label: '프롬프트 목록', href: '/prompts', kind: 'outline' }]}
      />

      <PromptDetailBlock prompt={prompt} onNavigate={onNavigate} />

      {relatedModules.length > 0 ? (
        <StepSection title="이 프롬프트를 쓰는 단계" description="아래 단계 안에서 이 프롬프트를 바로 사용할 수 있습니다.">
          <div className="link-list">
            {relatedModules.map((module) => (
              <button key={module.slug} type="button" className="link-row" onClick={() => onNavigate(`/modules/${module.slug}`)}>
                <span>{`${module.stepNumber}. ${module.title}`}</span>
                <small>{module.summary}</small>
              </button>
            ))}
          </div>
        </StepSection>
      ) : null}

      {relatedExamples.length > 0 ? (
        <StepSection title="관련 예시" description="결과가 어떤 모양으로 나오는지 먼저 볼 수 있습니다.">
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </StepSection>
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
        description="직접 경로로 들어왔을 때만 보는 보조 페이지입니다."
        actions={[{ label: '시작 페이지로', href: '/today', kind: 'outline' }]}
      />
      <StepSection title="예시 결과" description="강사가 먼저 보여 주거나 기대 결과를 설명할 때 씁니다.">
        <ExampleGallery items={examples} onNavigate={onNavigate} />
      </StepSection>
    </div>
  )
}

export function ResourcesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <PageToolbar
        eyebrow="자료/도움"
        title="자료와 도움말"
        description="연수 PDF, 공식 링크, 자주 막히는 상황을 한 번에 모아 둔 페이지입니다."
      />

      <StepSection title="자료와 공식 링크" description="파일과 공식 도구 링크를 여기서 바로 여세요.">
        <ResourceList items={resources} onNavigate={onNavigate} />
      </StepSection>

      <NoteBlock
        title="자주 막히는 상황"
        description="현장에서 질문이 많이 나오는 부분만 짧게 정리했습니다."
        items={[
          '복사 버튼이 안 되면 프롬프트 본문을 길게 눌러 직접 복사하세요.',
          'Grok 영상이 오래 걸리면 글쓰기 단계로 먼저 넘어가세요.',
          '결과가 길면 항목 수를 줄여 달라고 다시 요청하세요.',
        ]}
      />

      <PadletSubmitBlock text="Padlet 바로 열기" url={currentSession.padletUrl} />
    </div>
  )
}

export function GuidePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <ResourcesPage onNavigate={onNavigate} />
}

export function NotFoundPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <div className="page-stack page-limit">
      <WorkbookSheet>
        <div className="empty-state">
          <h1>페이지를 찾지 못했습니다.</h1>
          <p>주소가 잘못되었거나 아직 연결되지 않은 페이지입니다.</p>
          <button type="button" className="action-button solid" onClick={() => onNavigate('/today')}>
            시작 페이지로 이동
          </button>
        </div>
      </WorkbookSheet>
    </div>
  )
}
