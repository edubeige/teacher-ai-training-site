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
  EmptyState,
  ExampleGallery,
  GuideShotsGallery,
  InstructionList,
  MetaLine,
  NoteBlock,
  PadletSubmitBlock,
  PageHeader,
  PrimaryTask,
  PromptDetailBlock,
  PromptInline,
  PromptListItem,
  ResourceList,
  SearchField,
  SessionMeta,
  StartSummary,
  StepNav,
  StepOutlineList,
  ToolActionBlock,
  WorkbookPage,
  WorkbookSection,
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
    <WorkbookPage>
      <PageHeader
        eyebrow="연수 시작"
        title={currentSession.trainingTitle}
        description="이 사이트는 초보 교사가 위에서 아래로 따라 하며 실습하는 워크북입니다. 먼저 1단계를 열고, 필요한 도구와 프롬프트를 같은 화면에서 이어서 사용하세요."
        action={{
          label: currentSession.primaryAction ?? '1단계 시작하기',
          href: `/modules/${firstModule.slug}`,
          kind: 'solid',
        }}
      />

      <WorkbookSection title="오늘 연수에서 할 일" description="아래 순서대로만 진행하면 됩니다. 중간에 길을 잃지 않도록 단계는 5개로만 나누었습니다.">
        <StartSummary title="오늘은 이 다섯 단계만 따라 합니다." items={featuredModules.map((module) => `${module.stepNumber}. ${module.title}`)} />
      </WorkbookSection>

      <WorkbookSection title="지금 먼저 해야 할 일" description="설명을 오래 읽기보다 바로 첫 행동부터 시작하세요." tone="blue">
        <PrimaryTask
          label="첫 행동"
          title={firstModule.toolInstruction ?? 'Gemini와 Padlet을 먼저 열어 주세요.'}
          description={firstModule.entryHint ?? firstModule.summary}
          action={{
            label: currentSession.primaryAction ?? '1단계 시작하기',
            href: `/modules/${firstModule.slug}`,
          }}
        />
      </WorkbookSection>

      <WorkbookSection title="필수 도구 바로 열기" description="실습 중 자주 이동하는 도구만 남겼습니다. 필요한 탭만 먼저 열어 두세요.">
        <ToolActionBlock items={quickTools} />
      </WorkbookSection>

      <WorkbookSection title="연수 정보와 시작 전 확인" description="학교명, 날짜, 강사 정보와 오늘 꼭 기억할 안내만 남겼습니다.">
        <SessionMeta
          schoolName={currentSession.schoolName}
          date={currentSession.date}
          instructor={currentSession.instructor}
          notices={currentSession.notices}
        />
      </WorkbookSection>

      <WorkbookSection title="전체 순서 미리 보기" description="단계를 미리 훑어보고 바로 원하는 단계로 들어갈 수도 있습니다.">
        <StepOutlineList modules={featuredModules} onNavigate={onNavigate} />
      </WorkbookSection>
    </WorkbookPage>
  )
}

export function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <WorkbookPage>
      <PageHeader
        eyebrow="전체 단계"
        title="오늘 연수 전체 순서"
        description="메인 경험은 단계별 페이지입니다. 이 페이지는 전체 순서를 미리 훑어보는 용도로만 사용하세요."
        action={{ label: '시작 페이지로', href: '/today', kind: 'outline' }}
      />

      <WorkbookSection title="위에서 아래로만 진행하세요" description="모든 단계는 앞 단계를 마친 뒤 다음 단계로 넘어가도록 설계했습니다.">
        <StepOutlineList modules={courseModules} onNavigate={onNavigate} />
      </WorkbookSection>
    </WorkbookPage>
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
    <WorkbookPage>
      <PageHeader
        eyebrow={`Step ${module.stepNumber}`}
        title={`${module.stepNumber}. ${module.title}`}
        description={module.summary}
        action={
          module.primaryToolUrl
            ? {
                label: module.ctaLabel ?? '지금 하기',
                href: module.primaryToolUrl,
                kind: 'solid',
                external: true,
              }
            : undefined
        }
      />

      <MetaLine
        items={[
          `예상 시간 ${module.estimatedTime}`,
          module.difficulty,
          module.expectedOutcome ?? module.goal,
        ]}
      />

      <WorkbookSection title="지금 할 일" description="이 페이지에서 가장 먼저 해야 하는 행동입니다." tone="blue">
        <PrimaryTask
          label="이번 단계의 첫 행동"
          title={module.toolInstruction ?? `${module.tool}를 열고 시작하세요.`}
          description={module.entryHint ?? module.summary}
          action={
            module.primaryToolUrl
              ? {
                  label: module.ctaLabel ?? '도구 열기',
                  href: module.primaryToolUrl,
                  external: true,
                }
              : undefined
          }
        />
      </WorkbookSection>

      <WorkbookSection title="어디를 눌러야 하나요" description="실제 입력 위치나 탭 위치를 먼저 보고 따라 하세요.">
        <p className="section-note">{module.screenshotHint ?? '실제 화면에서 입력 위치를 먼저 확인한 뒤 아래 순서대로 진행합니다.'}</p>
        <GuideShotsGallery
          shots={module.guideShots ?? []}
          fallbackTitle={module.entryHint}
          fallbackText={module.screenshotHint}
        />
      </WorkbookSection>

      <WorkbookSection title="따라 하기 순서" description="위에서 아래 번호대로만 진행하면 됩니다.">
        <InstructionList steps={module.steps} />
      </WorkbookSection>

      {relatedPrompts.length > 0 ? (
        <WorkbookSection title="이 단계에서 필요한 프롬프트" description="지금 필요한 것만 바로 복사해 쓰도록 1~2개만 보여 줍니다.">
          <div className="prompt-inline-stack">
            {relatedPrompts.map((prompt) => (
              <PromptInline key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </WorkbookSection>
      ) : null}

      {relatedExamples.length > 0 ? (
        <WorkbookSection title="결과 예시" description="어떤 결과가 나오면 되는지 먼저 감을 잡고 진행하세요.">
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </WorkbookSection>
      ) : null}

      <WorkbookSection title="막히면 이렇게 하세요" description="실패해도 괜찮습니다. 아래 문장부터 하나씩 따라 해 보세요." tone="apricot">
        <NoteBlock
          title="짧게 다시 요청하는 것이 가장 안전합니다."
          items={[
            module.commonMistake ?? '한 번에 너무 많은 조건을 넣지 마세요.',
            module.fallbackAction ?? '조건을 줄이고 더 구체적인 문장으로 다시 요청하세요.',
            ...(module.waitNote ? [module.waitNote] : []),
            ...module.blockers.map((blocker) => `${blocker.question} ${blocker.answer}`),
          ]}
        />
      </WorkbookSection>

      {relatedResources.length > 0 ? (
        <WorkbookSection title="이 단계에서 참고할 자료" description="공식 도구 링크와 오늘 교안을 같은 자리에서 확인할 수 있습니다.">
          <ResourceList items={relatedResources} onNavigate={onNavigate} />
        </WorkbookSection>
      ) : null}

      <WorkbookSection title="결과 올리기" description="실습 결과는 이 사이트가 아니라 Padlet에 올립니다.">
        <PadletSubmitBlock text={module.padletCtaText} url={currentSession.padletUrl} description={module.padletInstruction} />
      </WorkbookSection>

      <StepNav
        previousHref={previous ? `/modules/${previous.slug}` : '/today'}
        previousLabel={previous ? previous.title : '시작하기'}
        nextHref={next ? `/modules/${next.slug}` : '/resources'}
        nextLabel={next ? next.title : '자료/도움'}
      />
    </WorkbookPage>
  )
}

export function PromptsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)

  const toolOrder = useMemo(() => ['전체', 'Gemini', 'Grok', '글쓰기'], [])

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return prompts.filter((item) => {
      const text = [item.title, item.exampleUse, item.whereToUse ?? '', item.relatedTool, ...(item.tags ?? [])]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery)
      const matchesTool =
        toolFilter === '전체' ||
        item.relatedTool === toolFilter ||
        (toolFilter === '글쓰기' && item.category.includes('글쓰기'))

      return matchesQuery && matchesTool
    })
  }, [deferredQuery, toolFilter])

  const groupedPrompts = useMemo(() => {
    const groups = ['Gemini', 'Grok', 'ChatGPT']
    return groups
      .map((tool) => ({
        tool,
        items: filteredPrompts.filter((prompt) => prompt.relatedTool === tool),
      }))
      .filter((group) => group.items.length > 0)
  }, [filteredPrompts])

  return (
    <WorkbookPage>
      <PageHeader
        eyebrow="보조 자료"
        title="프롬프트 참고 모음"
        description="메인 실습 페이지를 먼저 보고, 추가로 필요할 때만 여기서 도구별 프롬프트를 찾아 쓰세요."
        action={{ label: '시작 페이지로', href: '/today', kind: 'outline' }}
      />

      <WorkbookSection title="필요한 프롬프트만 찾기" description="도구별로 좁혀 보고, 제목이나 용도로 검색할 수 있습니다.">
        <div className="prompt-filter-panel">
          <SearchField label="프롬프트 검색" value={query} onChange={setQuery} placeholder="예: Grok, 이미지, 글쓰기" />
          <div className="filter-chip-row">
            {toolOrder.map((tool) => (
              <button
                key={tool}
                type="button"
                className={`filter-chip ${toolFilter === tool ? 'active' : ''}`}
                onClick={() => setToolFilter(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
      </WorkbookSection>

      {groupedPrompts.map((group) => (
        <WorkbookSection key={group.tool} title={`${group.tool} 프롬프트`} description="어디에 붙여 넣는지 확인한 뒤 바로 복사하세요.">
          <div className="prompt-list">
            {group.items.map((prompt) => (
              <PromptListItem key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </WorkbookSection>
      ))}
    </WorkbookPage>
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
    <WorkbookPage>
      <PageHeader
        eyebrow="프롬프트 상세"
        title={prompt.title}
        description="실행 위치와 수정 방법까지 확인한 뒤 복사해서 사용하세요."
        action={{ label: '프롬프트 목록', href: '/prompts', kind: 'outline' }}
      />

      <WorkbookSection title="프롬프트 본문과 사용법" description="값을 바꿔 넣고 그대로 복사할 수 있습니다.">
        <PromptDetailBlock prompt={prompt} onNavigate={onNavigate} />
      </WorkbookSection>

      {relatedModules.length > 0 ? (
        <WorkbookSection title="이 프롬프트를 쓰는 단계" description="아래 단계 안에서 바로 이 프롬프트를 사용할 수 있습니다.">
          <StepOutlineList modules={relatedModules} onNavigate={onNavigate} />
        </WorkbookSection>
      ) : null}

      {relatedExamples.length > 0 ? (
        <WorkbookSection title="관련 예시" description="어떤 결과를 기대하면 되는지 함께 확인하세요.">
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </WorkbookSection>
      ) : null}
    </WorkbookPage>
  )
}

export function ExamplesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <WorkbookPage>
      <PageHeader
        eyebrow="예시"
        title="실습 결과 예시"
        description="독립 메뉴에서는 제거했지만, 직접 경로로 들어왔을 때는 예시를 확인할 수 있습니다."
        action={{ label: '시작 페이지로', href: '/today', kind: 'outline' }}
      />

      <WorkbookSection title="강사 예시 결과" description="결과 예시는 단계 페이지 안에서도 함께 볼 수 있습니다.">
        <ExampleGallery items={examples} onNavigate={onNavigate} />
      </WorkbookSection>
    </WorkbookPage>
  )
}

export function ResourcesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <WorkbookPage>
      <PageHeader
        eyebrow="자료/도움"
        title="자료와 도움말"
        description="교안 PDF, 공식 도구 링크, 현장에서 자주 막히는 상황을 한곳에 모아 두었습니다."
      />

      <WorkbookSection title="자료와 공식 링크" description="배포 자료와 공식 도구 링크를 여기서 바로 열 수 있습니다.">
        <ResourceList items={resources} onNavigate={onNavigate} />
      </WorkbookSection>

      <WorkbookSection title="자주 막히는 상황" description="실습 중 질문이 자주 나오는 부분만 짧게 정리했습니다." tone="apricot">
        <NoteBlock
          title="복사, 대기 시간, 결과 수정"
          items={[
            '복사 버튼이 안 되면 프롬프트 본문을 길게 눌러 직접 복사하세요.',
            'Grok 영상 생성이 오래 걸리면 글쓰기 단계부터 먼저 진행해도 됩니다.',
            '결과가 복잡하면 요소 수를 3개로 줄여 달라고 다시 요청하세요.',
          ]}
        />
      </WorkbookSection>

      <WorkbookSection title="Padlet 바로 열기" description="실습 결과 공유는 Padlet에서만 진행합니다.">
        <PadletSubmitBlock text="Padlet 바로 열기" url={currentSession.padletUrl} />
      </WorkbookSection>
    </WorkbookPage>
  )
}

export function GuidePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return <ResourcesPage onNavigate={onNavigate} />
}

export function NotFoundPage() {
  return (
    <WorkbookPage width="wide">
      <EmptyState
        title="페이지를 찾지 못했습니다."
        description="주소가 잘못되었거나 아직 연결되지 않은 페이지입니다."
        action={{ label: '시작 페이지로 이동', href: '/today' }}
      />
    </WorkbookPage>
  )
}
