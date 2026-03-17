import { useState, type ReactNode } from 'react'
import { navigationItems, buildAssetHref, buildInternalHref, isCurrentPath, isExternalHref, isInternalRoute } from '../lib/routing'
import { currentSession } from '../site/content'
import type { ExampleItem, ModuleItem, PromptItem, ResourceItem } from '../site/types'

export function formatKoreanDate(value: string): string {
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
  const copied = typeof document.execCommand === 'function' && document.execCommand('copy')
  textarea.remove()

  if (!copied) {
    throw new Error('COPY_FAILED')
  }
}

function navigateOrOpen(href: string, onNavigate: (href: string) => void) {
  if (isInternalRoute(href)) {
    onNavigate(href)
    return
  }

  window.open(href, '_blank', 'noreferrer')
}

export function AppShell({
  pathname,
  onNavigate,
  children,
}: {
  pathname: string
  onNavigate: (href: string) => void
  children: ReactNode
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button type="button" className="brand-lockup" onClick={() => onNavigate('/')} aria-label="홈으로 이동">
          <span className="brand-mark">AI</span>
          <span className="brand-copy">
            <strong>생성형 AI 강의자료 허브</strong>
            <small>Tomorrow training workflow</small>
          </span>
        </button>

        <nav className="sidebar-nav" aria-label="주요 메뉴">
          {navigationItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className={`sidebar-link ${isCurrentPath(pathname, item.href) ? 'active' : ''}`}
              onClick={() => onNavigate(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-support">
          <span className="sidebar-label">빠른 이동</span>
          <a className="sidebar-ghost" href={currentSession.padletUrl} target="_blank" rel="noreferrer">
            Padlet 열기
          </a>
          <button type="button" className="sidebar-ghost" onClick={() => onNavigate('/resources')}>
            외부 도구와 도움말
          </button>
        </div>
      </aside>

      <div className="app-content">{children}</div>
    </div>
  )
}

export function PageToolbar({
  eyebrow,
  title,
  description,
  actions = [],
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: Array<{ label: string; href: string; kind?: 'solid' | 'outline' | 'ghost'; external?: boolean }>
}) {
  return (
    <header className="page-toolbar glass-panel">
      <div>
        {eyebrow ? <p className="toolbar-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions.length > 0 ? (
        <div className="toolbar-actions">
          {actions.map((action) => (
            <ActionButton
              key={`${action.href}-${action.label}`}
              href={action.href}
              kind={action.kind ?? 'outline'}
              external={action.external}
            >
              {action.label}
            </ActionButton>
          ))}
        </div>
      ) : null}
    </header>
  )
}

export function ActionButton({
  href,
  kind,
  children,
  external = false,
}: {
  href: string
  kind: 'solid' | 'outline' | 'ghost'
  children: ReactNode
  external?: boolean
}) {
  if (external || isExternalHref(href)) {
    return (
      <a className={`button ${kind}`} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <a className={`button ${kind}`} href={buildInternalHref(href)}>
      {children}
    </a>
  )
}

export function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

export function ActionCard({
  label,
  title,
  description,
  href,
  onNavigate,
  tone = 'default',
  external = false,
}: {
  label: string
  title: string
  description: string
  href: string
  onNavigate: (href: string) => void
  tone?: 'default' | 'accent' | 'soft'
  external?: boolean
}) {
  return (
    <button
      type="button"
      className={`action-card ${tone}`}
      onClick={() => (external || isExternalHref(href) ? navigateOrOpen(href, onNavigate) : onNavigate(href))}
    >
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </button>
  )
}

export function QuickStartCard({ steps }: { steps: string[] }) {
  return (
    <section className="glass-panel feature-card">
      <div className="panel-header">
        <div>
          <span className="panel-label">5분 퀵스타트</span>
          <strong>처음 접속했을 때 이 순서만 따라오세요.</strong>
        </div>
      </div>
      <ol className="step-chip-list">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  )
}

export function ToolStackCard({
  title,
  items,
}: {
  title: string
  items: Array<{ title: string; description: string; url: string }>
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="panel-label">도구 열기</span>
          <strong>{title}</strong>
        </div>
      </div>
      <div className="tool-stack">
        {items.map((item) => (
          <a key={item.title} className="list-card" href={item.url} target="_blank" rel="noreferrer">
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <span>열기</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export function InfoListCard({
  label,
  title,
  items,
}: {
  label: string
  title: string
  items: string[]
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="panel-label">{label}</span>
          <strong>{title}</strong>
        </div>
      </div>
      <ul className="info-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function SessionInfoCard({
  schoolName,
  date,
  instructor,
}: {
  schoolName: string
  date: string
  instructor: string
}) {
  const entries = [
    { label: '학교명', value: schoolName },
    { label: '날짜', value: formatKoreanDate(date) },
    { label: '강사', value: instructor },
  ]

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="panel-label">오늘 연수</span>
          <strong>세션 기본 정보</strong>
        </div>
      </div>
      <div className="detail-grid">
        {entries.map((entry) => (
          <article key={entry.label} className="detail-card">
            <span>{entry.label}</span>
            <strong>{entry.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ScheduleBoard({
  modules,
  onNavigate,
}: {
  modules: ModuleItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="panel-label">오늘의 순서</span>
          <strong>순서대로 열면 됩니다.</strong>
        </div>
      </div>
      <div className="board-list">
        {modules.map((module) => (
          <article key={module.slug} className="board-row">
            <div className="board-copy">
              <div className="board-heading">
                <strong>{module.title}</strong>
                <span>{module.estimatedTime}</span>
              </div>
              <p>{module.expectedOutcome ?? module.summary}</p>
            </div>
            <button type="button" className="button outline board-button" onClick={() => onNavigate(`/modules/${module.slug}`)}>
              열기
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ModuleSummaryCard({
  module,
  onNavigate,
}: {
  module: ModuleItem
  onNavigate: (href: string) => void
}) {
  return (
    <article className="module-summary-card">
      <div className="meta-row">
        <span>{module.tool}</span>
        <span>{module.difficulty}</span>
      </div>
      <button type="button" className="card-title-button" onClick={() => onNavigate(`/modules/${module.slug}`)}>
        {module.title}
      </button>
      <p>{module.summary}</p>
      <div className="summary-points">
        <div>
          <span>끝나면 얻는 것</span>
          <strong>{module.expectedOutcome ?? module.goal}</strong>
        </div>
        <div>
          <span>빠른 성공 포인트</span>
          <strong>{module.quickWin ?? module.goal}</strong>
        </div>
      </div>
      <button type="button" className="button outline block-button" onClick={() => onNavigate(`/modules/${module.slug}`)}>
        모듈 보기
      </button>
    </article>
  )
}

export function ModuleRail({ module }: { module: ModuleItem }) {
  const anchors = [
    { href: '#overview', label: '개요' },
    { href: '#prepare', label: '준비 체크' },
    { href: '#steps', label: '실습 순서' },
    { href: '#prompts', label: '프롬프트' },
    { href: '#examples', label: '예시 결과' },
    { href: '#resources', label: '자료 연결' },
  ]

  return (
    <aside className="module-rail">
      <section className="glass-panel rail-card">
        <span className="panel-label">모듈 개요</span>
        <strong>{module.title}</strong>
        <p>{module.summary}</p>
        <div className="rail-stat">
          <span>난이도</span>
          <strong>{module.difficulty}</strong>
        </div>
        <div className="rail-stat">
          <span>예상 시간</span>
          <strong>{module.estimatedTime}</strong>
        </div>
        <div className="rail-stat">
          <span>빠른 성공 포인트</span>
          <strong>{module.quickWin ?? module.goal}</strong>
        </div>
      </section>

      <nav className="rail-nav" aria-label="모듈 이동">
        {anchors.map((anchor) => (
          <a key={anchor.href} href={anchor.href}>
            {anchor.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export function ModuleStepCard({
  step,
  index,
}: {
  step: ModuleItem['steps'][number]
  index: number
}) {
  return (
    <article className="process-card">
      <div className="process-index">{String(index + 1).padStart(2, '0')}</div>
      <div>
        <strong>{step.title}</strong>
        <p>{step.description}</p>
        {step.tip ? <small>{step.tip}</small> : null}
      </div>
    </article>
  )
}

export function SearchField({
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
    <label className="search-field">
      <span>{label}</span>
      <input type="search" aria-label={label} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function TagFilter({
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
    <section className="filter-block" aria-label={label}>
      <span>{label}</span>
      <div className="filter-row">
        <button type="button" className={`filter-chip ${selected === '전체' ? 'active' : ''}`} onClick={() => onSelect('전체')}>
          전체
        </button>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`filter-chip ${selected === option ? 'active' : ''}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

export function CopyButton({
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
      className="button solid"
      onClick={async () => {
        try {
          await copyToClipboard(text)
          setStatus('done')
          window.setTimeout(() => setStatus('idle'), 1600)
        } catch {
          setStatus('error')
          window.setTimeout(() => setStatus('idle'), 1600)
        }
      }}
    >
      {status === 'idle' && label}
      {status === 'done' && '복사 완료'}
      {status === 'error' && '다시 시도'}
    </button>
  )
}

export function PromptCard({
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
      <div className="meta-row">
        <span>{prompt.relatedTool}</span>
        <span>{prompt.difficulty ?? '기초'}</span>
      </div>
      <button type="button" className="card-title-button" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        {prompt.title}
      </button>
      <div className="prompt-intel">
        <div>
          <span>언제 쓰나요</span>
          <strong>{prompt.exampleUse}</strong>
        </div>
        <div>
          <span>어디에 붙여 넣나요</span>
          <strong>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</strong>
        </div>
        <div>
          <span>예상 결과</span>
          <strong>{prompt.expectedOutput ?? '바로 수정 가능한 초안을 받습니다.'}</strong>
        </div>
      </div>

      {!compact && prompt.variables.length > 0 ? (
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
      ) : null}

      <div className="tag-row">
        {prompt.tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </div>

      <pre>{compact ? `${renderedPrompt.slice(0, 220)}${renderedPrompt.length > 220 ? '...' : ''}` : renderedPrompt}</pre>
      <div className="prompt-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="button outline" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          상세 보기
        </button>
      </div>
    </article>
  )
}

export function PromptListCard({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  return (
    <article className="prompt-list-card">
      <div className="meta-row">
        <span>{prompt.relatedTool}</span>
        <span>{prompt.difficulty ?? '기초'}</span>
      </div>
      <button type="button" className="card-title-button" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        {prompt.title}
      </button>
      <p>{prompt.useCase ?? prompt.exampleUse}</p>
      <div className="prompt-rows">
        <div>
          <span>어디에 붙여 넣나요</span>
          <strong>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</strong>
        </div>
        <div>
          <span>예상 결과</span>
          <strong>{prompt.expectedOutput ?? '바로 수정 가능한 초안을 받습니다.'}</strong>
        </div>
      </div>
      <div className="tag-row">
        {prompt.tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </div>
      <div className="prompt-list-actions">
        <button type="button" className="button ghost" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          자세히 보기
        </button>
      </div>
    </article>
  )
}

export function ExampleGallery({
  items,
  onNavigate,
}: {
  items: ExampleItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <div className="card-grid dual">
      {items.map((item) => (
        <article key={item.slug} className="example-card">
          <img src={buildAssetHref(item.image)} alt="" />
          <div className="example-copy">
            <div className="meta-row">
              <span>{item.tool}</span>
              <span>{item.useCase}</span>
            </div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <button type="button" className="button ghost" onClick={() => onNavigate(`/prompts/${item.relatedPrompt}`)}>
              관련 프롬프트 보기
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export function ResourceList({
  items,
  onNavigate,
}: {
  items: ResourceItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <div className="resource-list">
      {items.map((item) => {
        const isRoute = isInternalRoute(item.url) && !item.downloadable
        const resolvedHref = item.downloadable && item.url.startsWith('/') ? buildAssetHref(item.url) : item.url

        return (
          <article key={`${item.category}-${item.title}`} className="resource-row">
            <div>
              <div className="meta-row">
                <span>{item.category}</span>
                <span>{item.type}</span>
              </div>
              <strong>{item.title}</strong>
            </div>
            {isRoute ? (
              <button type="button" className="button outline" onClick={() => onNavigate(item.url)}>
                열기
              </button>
            ) : (
              <a
                className="button outline"
                href={resolvedHref}
                target={item.downloadable ? undefined : '_blank'}
                rel={item.downloadable ? undefined : 'noreferrer'}
                download={item.downloadable || undefined}
              >
                {item.downloadable ? '다운로드' : '열기'}
              </a>
            )}
          </article>
        )
      })}
    </div>
  )
}

export function SupportCard({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: string[]
}) {
  return (
    <section className="panel support-card">
      <div className="panel-header">
        <div>
          <span className="panel-label">지원 안내</span>
          <strong>{title}</strong>
        </div>
      </div>
      <p>{description}</p>
      <ul className="support-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function PadletCard({
  text,
  url,
}: {
  text: string
  url: string
}) {
  return (
    <a className="padlet-card" href={url} target="_blank" rel="noreferrer">
      <span className="panel-label">Padlet</span>
      <strong>{text}</strong>
      <p>이 사이트에는 업로드 기능이 없으므로 결과 공유는 Padlet에서만 진행합니다.</p>
    </a>
  )
}
