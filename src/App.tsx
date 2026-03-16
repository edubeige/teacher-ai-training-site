import { startTransition, useDeferredValue, useEffect, useMemo, useState, type ReactNode } from 'react'
import './styles.css'
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

type RouteMatch =
  | { kind: 'home'; pathname: '/' }
  | { kind: 'today'; pathname: '/today' }
  | { kind: 'course'; pathname: '/course/generative-ai' }
  | { kind: 'prompts'; pathname: '/prompts' }
  | { kind: 'prompt'; pathname: string; slug: string }
  | { kind: 'examples'; pathname: '/examples' }
  | { kind: 'resources'; pathname: '/resources' }
  | { kind: 'guide'; pathname: '/guide' }
  | { kind: 'module'; pathname: string; slug: string }
  | { kind: 'not-found'; pathname: string }

const navigationItems = [
  { href: '/', label: '홈' },
  { href: '/today', label: '오늘 연수' },
  { href: '/course/generative-ai', label: '코스' },
  { href: '/prompts', label: '프롬프트 허브' },
  { href: '/examples', label: '예시 갤러리' },
  { href: '/resources', label: '자료실' },
  { href: '/guide', label: '가이드' },
] as const

const moduleMap = new Map(courseModules.map((module) => [module.slug, module]))
const baseUrl = import.meta.env.BASE_URL

function useHashRouting(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.hostname.endsWith('github.io')
}

function stripBasePath(pathname: string): string {
  const normalized = normalizePath(pathname)
  const normalizedBase = baseUrl === '/' ? '/' : `/${baseUrl.replace(/^\/|\/$/g, '')}`

  if (normalizedBase === '/' || !normalized.startsWith(normalizedBase)) {
    return normalized
  }

  const stripped = normalized.slice(normalizedBase.length)
  return normalizePath(stripped || '/')
}

function buildInternalHref(pathname: string): string {
  const normalized = normalizePath(pathname)
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  if (useHashRouting()) {
    return normalized === '/' ? normalizedBase : `${normalizedBase}#${normalized}`
  }

  if (normalized === '/') {
    return normalizedBase
  }

  return `${normalizedBase.replace(/\/$/, '')}${normalized}`
}

function normalizePath(pathname: string): string {
  const trimmed = pathname.trim()
  if (!trimmed) {
    return '/'
  }

  const withoutTrailingSlash = trimmed !== '/' ? trimmed.replace(/\/+$/, '') : trimmed
  return withoutTrailingSlash || '/'
}

function getCurrentPathname(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  if (useHashRouting()) {
    const hashPath = window.location.hash.replace(/^#/, '')
    return normalizePath(hashPath || '/')
  }

  return stripBasePath(window.location.pathname)
}

function matchRoute(pathname: string): RouteMatch {
  const normalized = normalizePath(pathname)

  if (normalized === '/') {
    return { kind: 'home', pathname: normalized }
  }

  if (normalized === '/today') {
    return { kind: 'today', pathname: normalized }
  }

  if (normalized === '/course/generative-ai') {
    return { kind: 'course', pathname: normalized }
  }

  if (normalized === '/prompts') {
    return { kind: 'prompts', pathname: normalized }
  }

  if (normalized === '/examples') {
    return { kind: 'examples', pathname: normalized }
  }

  if (normalized === '/resources') {
    return { kind: 'resources', pathname: normalized }
  }

  if (normalized === '/guide') {
    return { kind: 'guide', pathname: normalized }
  }

  const promptMatch = /^\/prompts\/([^/]+)$/.exec(normalized)
  if (promptMatch?.[1]) {
    return { kind: 'prompt', pathname: normalized, slug: promptMatch[1] }
  }

  const moduleMatch = /^\/modules\/([^/]+)$/.exec(normalized)
  if (moduleMatch?.[1]) {
    return { kind: 'module', pathname: normalized, slug: moduleMatch[1] }
  }

  return { kind: 'not-found', pathname: normalized }
}

function formatKoreanDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

function replacePromptVariables(prompt: PromptItem, values: Record<string, string>): string {
  return prompt.body.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => values[key] ?? `{{${key}}}`)
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.append(textarea)
  textarea.select()
  const successful = typeof document.execCommand === 'function' && document.execCommand('copy')
  textarea.remove()

  if (!successful) {
    throw new Error('COPY_FAILED')
  }
}

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function Header({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate: (href: string) => void
}) {
  return (
    <header className="site-header">
      <div className="site-brand">
        <button type="button" className="brand-mark" onClick={() => onNavigate('/')} aria-label="홈으로 이동">
          AI
        </button>
        <div>
          <p className="eyebrow">Teacher Training Content Site</p>
          <h1>생성형 AI 강의자료 허브</h1>
        </div>
      </div>

      <nav className="top-nav" aria-label="주요 메뉴">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            onNavigate={onNavigate}
            active={isCurrentPath(pathname, item.href)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function NavLink({
  href,
  onNavigate,
  active = false,
  children,
  className = '',
}: {
  href: string
  onNavigate: (href: string) => void
  active?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={buildInternalHref(href)}
      className={`nav-link ${active ? 'active' : ''} ${className}`.trim()}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(href)
      }}
    >
      {children}
    </a>
  )
}

function NavAction({
  href,
  kind,
  children,
}: {
  href: string
  kind: 'primary' | 'secondary'
  children: ReactNode
}) {
  return (
    <a className={`button ${kind}`} href={buildInternalHref(href)}>
      {children}
    </a>
  )
}

function Hero({
  title,
  description,
  kicker,
  actions,
}: {
  title: string
  description: string
  kicker: string
  actions: Array<{ label: string; href: string; kind?: 'primary' | 'secondary' }>
}) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">{kicker}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="hero-actions">
          {actions.map((action) => (
            <NavAction key={action.href} href={action.href} kind={action.kind ?? 'secondary'}>
              {action.label}
            </NavAction>
          ))}
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-badge">
          <strong>{courseModules.length}개 모듈</strong>
          <span>정적 배포형 구조</span>
        </div>
        <div className="hero-grid">
          <div>
            <span>복사 중심</span>
            <strong>1클릭 프롬프트</strong>
          </div>
          <div>
            <span>현장 진행</span>
            <strong>프로젝터 최적화</strong>
          </div>
          <div>
            <span>재사용</span>
            <strong>세션 데이터 분리</strong>
          </div>
          <div>
            <span>역할 분리</span>
            <strong>Padlet 외부 연결</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricStrip() {
  const items = [
    { label: '정적 사이트', value: 'No Login / No DB' },
    { label: '콘텐츠 타입', value: '모듈 + 프롬프트 + 예시 + 자료' },
    { label: '확장 방식', value: '세션 데이터만 교체' },
  ]

  return (
    <section className="metric-strip" aria-label="핵심 지표">
      {items.map((item) => (
        <article key={item.label} className="metric-card">
          <p>{item.label}</p>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}

function SectionHeader({
  title,
  description,
  align = 'left',
}: {
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <header className={`section-header ${align}`}>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </header>
  )
}

function ToolLinkCard({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}) {
  return (
    <a className="tool-link-card" href={url} target="_blank" rel="noreferrer">
      <strong>{title}</strong>
      <p>{description}</p>
      <span>공식 도구 열기</span>
    </a>
  )
}

function NoticeBox({ notices }: { notices: string[] }) {
  return (
    <section className="notice-box">
      <div className="notice-head">
        <span>공지</span>
        <strong>오늘 꼭 먼저 확인하세요</strong>
      </div>
      <ul>
        {notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
    </section>
  )
}

function PadletCTA({
  text,
  url,
}: {
  text: string
  url: string
}) {
  return (
    <a className="padlet-cta" href={url} target="_blank" rel="noreferrer">
      <div>
        <span>Padlet</span>
        <strong>{text}</strong>
      </div>
      <p>현장 산출물 공유는 사이트 안이 아니라 Padlet에서 진행합니다.</p>
    </a>
  )
}

function ModuleCard({
  module,
  onNavigate,
}: {
  module: ModuleItem
  onNavigate: (href: string) => void
}) {
  return (
    <article className="module-card">
      <div className="card-topline">
        <span>{module.tool}</span>
        <span>{module.difficulty}</span>
      </div>
      <h4>{module.title}</h4>
      <p>{module.summary}</p>
      <dl className="meta-inline">
        <div>
          <dt>예상 시간</dt>
          <dd>{module.estimatedTime}</dd>
        </div>
        <div>
          <dt>한 줄 목표</dt>
          <dd>{module.goal}</dd>
        </div>
      </dl>
      <button type="button" className="button primary block" onClick={() => onNavigate(`/modules/${module.slug}`)}>
        모듈 열기
      </button>
    </article>
  )
}

function ModuleStepCard({
  step,
  index,
}: {
  step: ModuleItem['steps'][number]
  index: number
}) {
  return (
    <article className="step-card" id={`step-${index + 1}`}>
      <div className="step-index">{String(index + 1).padStart(2, '0')}</div>
      <div className="step-body">
        <h4>{step.title}</h4>
        <p>{step.description}</p>
        {step.tip ? <small>{step.tip}</small> : null}
      </div>
    </article>
  )
}

function SearchBar({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="search-bar">
      <span>{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        placeholder={placeholder}
      />
    </label>
  )
}

function TagFilter({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <section className="filter-group" aria-label={label}>
      <span>{label}</span>
      <div className="chip-row">
        <button type="button" className={`chip ${selected === '전체' ? 'active' : ''}`} onClick={() => onSelect('전체')}>
          전체
        </button>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`chip ${selected === option ? 'active' : ''}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

function CopyButton({
  text,
  label = '프롬프트 복사',
}: {
  text: string
  label?: string
}) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')

  return (
    <button
      type="button"
      className="button primary"
      onClick={async () => {
        try {
          await copyToClipboard(text)
          setStatus('done')
          window.setTimeout(() => setStatus('idle'), 1800)
        } catch {
          setStatus('error')
          window.setTimeout(() => setStatus('idle'), 1800)
        }
      }}
    >
      {status === 'idle' && label}
      {status === 'done' && '복사 완료'}
      {status === 'error' && '복사 실패'}
    </button>
  )
}

function PromptCard({
  prompt,
  onNavigate,
  compact = false,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
  compact?: boolean
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue])),
  )
  const renderedPrompt = replacePromptVariables(prompt, values)

  return (
    <article className={`prompt-card ${compact ? 'compact' : ''}`}>
      <div className="card-topline">
        <span>{prompt.category}</span>
        <span>{prompt.relatedTool}</span>
      </div>
      <button type="button" className="text-link" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        {prompt.title}
      </button>
      <p>{prompt.exampleUse}</p>

      <div className="chip-row">
        {prompt.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            #{tag}
          </span>
        ))}
      </div>

      {prompt.variables.length > 0 && (
        <div className="variable-grid">
          {prompt.variables.map((variable) => (
            <label key={variable.key}>
              <span>{variable.label}</span>
              <input
                aria-label={variable.label}
                value={values[variable.key] ?? ''}
                placeholder={variable.placeholder}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [variable.key]: event.target.value,
                  }))
                }
              />
            </label>
          ))}
        </div>
      )}

      <pre>{renderedPrompt}</pre>
      <div className="prompt-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="button secondary" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          상세 보기
        </button>
      </div>
    </article>
  )
}

function ExampleGallery({
  items,
  onNavigate,
}: {
  items: ExampleItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <section className="example-grid" aria-label="예시 갤러리">
      {items.map((item) => (
        <article key={item.slug} className="example-card">
          <img src={item.image} alt="" />
          <div className="example-copy">
            <div className="card-topline">
              <span>{item.tool}</span>
              <span>{item.useCase}</span>
            </div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <button type="button" className="button secondary block" onClick={() => onNavigate(`/prompts/${item.relatedPrompt}`)}>
              연결 프롬프트 보기
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

function ResourceList({ items }: { items: ResourceItem[] }) {
  return (
    <section className="resource-list" aria-label="자료 목록">
      {items.map((item) => (
        <article key={`${item.category}-${item.title}`} className="resource-card">
          <div>
            <div className="card-topline">
              <span>{item.category}</span>
              <span>{item.type}</span>
            </div>
            <h4>{item.title}</h4>
          </div>
          <a
            className="button secondary"
            href={item.url}
            target={item.downloadable ? undefined : '_blank'}
            rel={item.downloadable ? undefined : 'noreferrer'}
            download={item.downloadable || undefined}
          >
            {item.downloadable ? '다운로드' : '열기'}
          </a>
        </article>
      ))}
    </section>
  )
}

function SidebarNav({ module }: { module: ModuleItem }) {
  const anchors = [
    { href: '#overview', label: '개요' },
    { href: '#prepare', label: '준비사항' },
    { href: '#steps', label: '따라하기' },
    { href: '#prompts', label: '프롬프트' },
    { href: '#examples', label: '예시 결과물' },
    { href: '#blockers', label: '막히는 부분' },
    { href: '#resources', label: '자료' },
  ]

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-card">
        <span className="eyebrow">Module</span>
        <h3>{module.title}</h3>
        <p>{module.goal}</p>
      </div>
      <nav className="anchor-nav" aria-label="모듈 목차">
        {anchors.map((anchor) => (
          <a key={anchor.href} href={anchor.href}>
            {anchor.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <strong>강의자료 + 예시자료 + 프롬프트 허브</strong>
      <p>정적 배포, 로그인 없음, Padlet 역할 분리 원칙을 기준으로 설계된 연수용 콘텐츠 사이트 프로토타입입니다.</p>
    </footer>
  )
}

function HomePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <Hero
        kicker="Reusable Training Starter"
        title="교사 연수를 위한 생성형 AI 강의자료 사이트"
        description="강사가 보여 주고, 수강생이 따라 하고, 프롬프트를 복사하고, 자료를 바로 내려받는 정적 콘텐츠 허브입니다. 상호작용과 제출은 Padlet로 분리해 진행 흐름을 단순하게 유지합니다."
        actions={[
          { label: '오늘 연수 열기', href: '/today', kind: 'primary' },
          { label: '프롬프트 허브 보기', href: '/prompts' },
        ]}
      />
      <MetricStrip />

      <section className="page-section">
        <SectionHeader title="핵심 도구 바로가기" description="실습 흐름상 자주 여는 도구만 전면 배치했습니다." />
        <div className="tool-grid">
          {Object.values(toolLinkMap).map((tool) => (
            <ToolLinkCard key={tool.title} title={tool.title} description={tool.description} url={tool.url} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader title="대표 모듈" description="오늘 연수와 다른 학교 재사용을 동시에 고려한 모듈 구조입니다." />
        <div className="module-grid">
          {courseModules.slice(0, 3).map((module) => (
            <ModuleCard key={module.slug} module={module} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section className="page-section split">
        <div>
          <SectionHeader title="프롬프트 허브 미리보기" description="복사 버튼이 항상 보이는 카드형 구조를 기본값으로 둡니다." />
          <div className="prompt-preview-grid">
            {prompts.slice(0, 2).map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} compact />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="운영 원칙" description="현장 연수에서 헷갈리기 쉬운 역할 분리를 명확하게 보여줍니다." />
          <NoticeBox
            notices={[
              '사이트는 읽기와 복사 중심입니다.',
              '참가자 결과물 공유와 업로드는 Padlet에서만 처리합니다.',
              '다른 학교 연수 시 세션 정보와 모듈 노출 순서만 바꾸면 재사용할 수 있습니다.',
            ]}
          />
          <PadletCTA text="오늘 Padlet 바로가기" url={currentSession.padletUrl} />
        </div>
      </section>
    </>
  )
}

function TodayPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const featuredModules = currentSession.featuredModules
    .map((slug) => moduleMap.get(slug))
    .filter((item): item is ModuleItem => Boolean(item))

  return (
    <>
      <Hero
        kicker="Today Session"
        title={currentSession.trainingTitle}
        description={`${currentSession.schoolName} 연수용 오늘 페이지입니다. 강사는 여기서 시작하고, 수강생은 여기서 오늘의 순서와 준비 사항을 빠르게 확인합니다.`}
        actions={[
          { label: '첫 모듈 시작', href: `/modules/${featuredModules[0]?.slug ?? courseModules[0].slug}`, kind: 'primary' },
          { label: '자료실 바로가기', href: '/resources' },
        ]}
      />

      <section className="page-section two-column">
        <article className="session-card">
          <SectionHeader title="오늘 연수 정보" />
          <dl className="session-grid">
            <div>
              <dt>학교명</dt>
              <dd>{currentSession.schoolName}</dd>
            </div>
            <div>
              <dt>날짜</dt>
              <dd>{formatKoreanDate(currentSession.date)}</dd>
            </div>
            <div>
              <dt>강사</dt>
              <dd>{currentSession.instructor}</dd>
            </div>
            <div>
              <dt>Padlet</dt>
              <dd>외부 링크로 분리 운영</dd>
            </div>
          </dl>
          <NoticeBox notices={currentSession.notices} />
        </article>

        <article className="session-card accent">
          <SectionHeader title="오늘의 순서" />
          <ol className="order-list">
            {featuredModules.map((module) => (
              <li key={module.slug}>
                <div>
                  <strong>{module.title}</strong>
                  <p>{module.summary}</p>
                </div>
                <button type="button" className="button secondary" onClick={() => onNavigate(`/modules/${module.slug}`)}>
                  열기
                </button>
              </li>
            ))}
          </ol>
          <PadletCTA text="오늘 사용할 Padlet 열기" url={currentSession.padletUrl} />
        </article>
      </section>
    </>
  )
}

function CoursePage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <>
      <section className="page-section">
        <SectionHeader
          title="코스 개요"
          description="이 코스는 생성형 AI 도구 소개가 아니라, 수업 맥락에 맞게 프롬프트를 설계하고 결과물을 재사용하는 흐름 중심으로 짜여 있습니다."
        />
        <div className="course-layout">
          <article className="session-card">
            <h4>학습 흐름</h4>
            <ol className="bullet-steps">
              <li>도구와 계정을 준비한다.</li>
              <li>단순 질문을 프롬프트 구조로 업그레이드한다.</li>
              <li>이미지, 슬라이드, 요약 자료를 생성한다.</li>
              <li>결과를 수업 장면에 맞게 다듬고 Padlet로 공유한다.</li>
            </ol>
          </article>

          <article className="session-card accent">
            <h4>콘텐츠 구조</h4>
            <ul className="bullet-steps">
              <li>`today`는 오늘 연수 전용 랜딩입니다.</li>
              <li>`modules`는 차시별 따라하기 화면입니다.</li>
              <li>`prompts`는 프롬프트 카드와 변수 치환 허브입니다.</li>
              <li>`resources`는 PDF, 링크, 실습지 모음입니다.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader title="전체 모듈" description="각 모듈은 동일한 레이아웃으로 유지되어 현장 설명과 재사용이 쉽습니다." />
        <div className="module-grid">
          {courseModules.map((module) => (
            <ModuleCard key={module.slug} module={module} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </>
  )
}

function ModulePage({
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
      <SidebarNav module={module} />
      <div className="module-content">
        <section className="module-hero" id="overview">
          <div className="card-topline">
            <span>{module.tool}</span>
            <span>{module.difficulty}</span>
          </div>
          <h2>{module.title}</h2>
          <p>{module.summary}</p>
          <dl className="meta-inline">
            <div>
              <dt>한 줄 목표</dt>
              <dd>{module.goal}</dd>
            </div>
            <div>
              <dt>예상 시간</dt>
              <dd>{module.estimatedTime}</dd>
            </div>
          </dl>
          <div className="tool-grid compact">
            {module.externalLinks.map((link) => (
              <ToolLinkCard key={link.label} title={link.label} description={link.description} url={link.url} />
            ))}
          </div>
        </section>

        <section className="page-section" id="prepare">
          <SectionHeader title="준비사항" description="수강생이 막히지 않도록 최소한의 선행 조건만 보여줍니다." />
          <ul className="check-list">
            {module.preparations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="page-section" id="steps">
          <SectionHeader title="단계별 따라하기" />
          <div className="step-list">
            {module.steps.map((step, index) => (
              <ModuleStepCard key={`${module.slug}-${step.title}`} step={step} index={index} />
            ))}
          </div>
        </section>

        <section className="page-section" id="prompts">
          <SectionHeader title="복사 가능한 프롬프트" />
          <div className="prompt-preview-grid">
            {relatedPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

        <section className="page-section" id="examples">
          <SectionHeader title="예시 결과물" />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </section>

        <section className="page-section" id="blockers">
          <SectionHeader title="자주 막히는 부분" />
          <div className="faq-stack">
            {module.blockers.map((blocker) => (
              <details key={blocker.question}>
                <summary>{blocker.question}</summary>
                <p>{blocker.answer}</p>
              </details>
            ))}
          </div>
          <PadletCTA text={module.padletCtaText} url={currentSession.padletUrl} />
        </section>

        <section className="page-section" id="resources">
          <SectionHeader title="관련 자료" />
          <ResourceList items={relatedResources} />
        </section>
      </div>
    </div>
  )
}

function PromptsPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('전체')
  const [tagFilter, setTagFilter] = useState('전체')
  const deferredQuery = useDeferredValue(query)
  const tools = useMemo(() => Array.from(new Set(prompts.map((item) => item.relatedTool))), [])
  const tags = useMemo(() => Array.from(new Set(prompts.flatMap((item) => item.tags))), [])

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return prompts.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.body.toLowerCase().includes(normalizedQuery) ||
        item.exampleUse.toLowerCase().includes(normalizedQuery)
      const matchesTool = toolFilter === '전체' || item.relatedTool === toolFilter
      const matchesTag = tagFilter === '전체' || item.tags.includes(tagFilter)
      return matchesQuery && matchesTool && matchesTag
    })
  }, [deferredQuery, tagFilter, toolFilter])

  return (
    <>
      <section className="page-section">
        <SectionHeader title="프롬프트 허브" description="용도, 도구, 태그 기준으로 빠르게 찾아 복사할 수 있는 카드형 라이브러리입니다." />
        <div className="filters-panel">
          <SearchBar label="프롬프트 검색" value={query} onChange={setQuery} placeholder="수업 설계, Canva, 이미지 생성처럼 검색" />
          <TagFilter label="도구별" options={tools} selected={toolFilter} onSelect={setToolFilter} />
          <TagFilter label="태그별" options={tags} selected={tagFilter} onSelect={setTagFilter} />
        </div>
      </section>

      <div className="prompt-preview-grid">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} onNavigate={onNavigate} />
        ))}
      </div>
    </>
  )
}

function PromptDetailPage({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const relatedModules = courseModules.filter((module) => module.prompts.includes(prompt.slug))
  const relatedExamples = examples.filter((example) => example.relatedPrompt === prompt.slug)

  return (
    <>
      <section className="page-section">
        <article className="prompt-detail-card">
          <div className="card-topline">
            <span>{prompt.category}</span>
            <span>{prompt.relatedTool}</span>
          </div>
          <h2>{prompt.title}</h2>
          <p>{prompt.exampleUse}</p>
          <PromptCard prompt={prompt} onNavigate={onNavigate} />
        </article>
      </section>

      <section className="page-section split">
        <div>
          <SectionHeader title="연결된 모듈" />
          <div className="stack-list">
            {relatedModules.map((module) => (
              <button key={module.slug} type="button" className="text-tile" onClick={() => onNavigate(`/modules/${module.slug}`)}>
                <strong>{module.title}</strong>
                <span>{module.summary}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader title="연결된 예시" />
          <ExampleGallery items={relatedExamples} onNavigate={onNavigate} />
        </div>
      </section>
    </>
  )
}

function ExamplesPage({ onNavigate }: { onNavigate: (href: string) => void }) {
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
    <>
      <section className="page-section">
        <SectionHeader title="예시 갤러리" description="강사가 직접 선별한 결과물만 노출하는 예시 모음입니다." />
        <div className="filters-panel">
          <SearchBar label="예시 검색" value={query} onChange={setQuery} placeholder="이미지, 활동지, 카드뉴스 등" />
          <TagFilter label="도구별" options={tools} selected={toolFilter} onSelect={setToolFilter} />
        </div>
      </section>

      <ExampleGallery items={filteredExamples} onNavigate={onNavigate} />
    </>
  )
}

function ResourcesPage() {
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
    <>
      <section className="page-section">
        <SectionHeader title="자료실" description="PDF, 실습 링크, 공식 도구 링크를 한곳에 모아 두는 화면입니다." />
        <div className="filters-panel">
          <SearchBar label="자료 검색" value={query} onChange={setQuery} placeholder="PDF, Canva, Padlet 등" />
          <TagFilter label="형식별" options={types} selected={typeFilter} onSelect={setTypeFilter} />
          <TagFilter label="카테고리별" options={categories} selected={categoryFilter} onSelect={setCategoryFilter} />
        </div>
      </section>

      <ResourceList items={filteredResources} />
    </>
  )
}

function GuidePage() {
  return (
    <section className="page-section split">
      <article className="session-card">
        <SectionHeader title="계정 준비 안내" />
        <ul className="check-list">
          <li>Gemini는 개인 또는 기관 계정 로그인 상태를 먼저 확인합니다.</li>
          <li>Canva 교육용 계정이 있으면 그대로 사용하고, 없으면 강사 안내 링크를 따릅니다.</li>
          <li>NotebookLM은 구글 계정 상태와 언어 설정을 확인합니다.</li>
          <li>학교 네트워크에서 접속 차단이 있으면 모바일 핫스팟을 예비안으로 준비합니다.</li>
        </ul>
      </article>

      <article className="session-card accent">
        <SectionHeader title="자주 막히는 부분" />
        <div className="faq-stack">
          <details open>
            <summary>복사 버튼이 눌리지 않아요.</summary>
            <p>모바일 브라우저에서는 길게 눌러 복사보다 사이트 내 버튼을 먼저 사용하세요. 브라우저 권한 문제면 새로고침 후 다시 시도합니다.</p>
          </details>
          <details>
            <summary>도구 로그인은 됐는데 결과가 느려요.</summary>
            <p>이미지 생성 단계는 속도 편차가 큽니다. 텍스트 프롬프트 실습부터 먼저 따라가도록 안내하면 흐름이 안정적입니다.</p>
          </details>
          <details>
            <summary>결과 공유는 어디에 올리나요?</summary>
            <p>이 사이트에는 업로드 기능이 없습니다. 공유와 현장 산출물은 Padlet 링크로 이동해 처리합니다.</p>
          </details>
        </div>
      </article>
    </section>
  )
}

function NotFoundPage({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section className="page-section">
      <article className="session-card center">
        <SectionHeader title="페이지를 찾을 수 없습니다" align="center" description="정적 사이트 경로가 잘못되었거나 아직 준비되지 않은 페이지입니다." />
        <button type="button" className="button primary" onClick={() => onNavigate('/')}>
          홈으로 이동
        </button>
      </article>
    </section>
  )
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPathname)

  useEffect(() => {
    const handlePopState = () => setPathname(getCurrentPathname())
    const handleHashChange = () => setPathname(getCurrentPathname())
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const route = useMemo(() => matchRoute(pathname), [pathname])

  const handleNavigate = (href: string) => {
    if (href.startsWith('http')) {
      window.location.assign(href)
      return
    }

    const normalized = normalizePath(href)
    if (normalized === pathname) {
      return
    }

    startTransition(() => {
      window.history.pushState({}, '', buildInternalHref(normalized))
      setPathname(normalized)
    })
  }

  let content: ReactNode

  if (route.kind === 'home') {
    content = <HomePage onNavigate={handleNavigate} />
  } else if (route.kind === 'today') {
    content = <TodayPage onNavigate={handleNavigate} />
  } else if (route.kind === 'course') {
    content = <CoursePage onNavigate={handleNavigate} />
  } else if (route.kind === 'prompts') {
    content = <PromptsPage onNavigate={handleNavigate} />
  } else if (route.kind === 'prompt') {
    const prompt = promptMap.get(route.slug)
    content = prompt ? <PromptDetailPage prompt={prompt} onNavigate={handleNavigate} /> : <NotFoundPage onNavigate={handleNavigate} />
  } else if (route.kind === 'examples') {
    content = <ExamplesPage onNavigate={handleNavigate} />
  } else if (route.kind === 'resources') {
    content = <ResourcesPage />
  } else if (route.kind === 'guide') {
    content = <GuidePage />
  } else if (route.kind === 'module') {
    const module = moduleMap.get(route.slug)
    content = module ? <ModulePage module={module} onNavigate={handleNavigate} /> : <NotFoundPage onNavigate={handleNavigate} />
  } else {
    content = <NotFoundPage onNavigate={handleNavigate} />
  }

  return (
    <div className="site-shell">
      <Header pathname={pathname} onNavigate={handleNavigate} />
      <main className="page-shell">{content}</main>
      <Footer />
    </div>
  )
}

export default App
