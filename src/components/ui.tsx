import { useMemo, useState, type ReactNode } from 'react'
import { buildAssetHref, buildInternalHref, isCurrentPath, isExternalHref, isInternalRoute } from '../lib/routing'
import { courseModules, currentSession } from '../site/content'
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

export function AppShell({
  pathname,
  onNavigate,
  children,
}: {
  pathname: string
  onNavigate: (href: string) => void
  children: ReactNode
}) {
  const stepItems = useMemo(
    () =>
      courseModules.map((module) => ({
        href: `/modules/${module.slug}`,
        label: `${module.stepNumber}. ${module.title}`,
      })),
    [],
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button type="button" className="brand-lockup" onClick={() => onNavigate('/today')} aria-label="시작하기로 이동">
          <span className="brand-mark">AI</span>
          <span className="brand-copy">
            <strong>생성형 AI 따라하기</strong>
            <small>teacher training manual</small>
          </span>
        </button>

        <nav className="sidebar-nav" aria-label="실습 단계">
          <span className="sidebar-label">시작</span>
          <button
            type="button"
            className={`sidebar-link ${pathname === '/' || pathname === '/today' ? 'active' : ''}`}
            onClick={() => onNavigate('/today')}
          >
            시작하기
          </button>

          <span className="sidebar-label">실습 단계</span>
          {stepItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className={`sidebar-link ${isCurrentPath(pathname, item.href) ? 'active' : ''}`}
              onClick={() => onNavigate(item.href)}
            >
              {item.label}
            </button>
          ))}

          <span className="sidebar-label">보조 메뉴</span>
          <button
            type="button"
            className={`sidebar-link ${isCurrentPath(pathname, '/prompts') ? 'active' : ''}`}
            onClick={() => onNavigate('/prompts')}
          >
            프롬프트 모음
          </button>
          <button
            type="button"
            className={`sidebar-link ${pathname === '/resources' || pathname === '/guide' ? 'active' : ''}`}
            onClick={() => onNavigate('/resources')}
          >
            자료/도움
          </button>
        </nav>

        <div className="sidebar-support">
          <span className="sidebar-label">바로 열기</span>
          <a className="sidebar-ghost" href={currentSession.padletUrl} target="_blank" rel="noreferrer">
            Padlet
          </a>
          <a className="sidebar-ghost" href="https://gemini.google.com" target="_blank" rel="noreferrer">
            Gemini
          </a>
          <a className="sidebar-ghost" href="https://grok.com" target="_blank" rel="noreferrer">
            Grok
          </a>
        </div>
      </aside>

      <main className="content-canvas">{children}</main>
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
    <header className="page-toolbar">
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

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav className="step-indicator" aria-label="실습 단계 진행">
      {courseModules.map((module) => {
        const active = module.stepNumber === currentStep
        const complete = (module.stepNumber ?? 0) < currentStep

        return (
          <div key={module.slug} className={`step-pill ${active ? 'active' : ''} ${complete ? 'complete' : ''}`.trim()}>
            <span>{module.stepNumber}</span>
            <strong>{module.title}</strong>
          </div>
        )
      })}
    </nav>
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

export function IntroCard({
  label,
  title,
  items,
  tone = 'default',
}: {
  label: string
  title: string
  items: string[]
  tone?: 'default' | 'blue' | 'apricot'
}) {
  return (
    <section className={`manual-card ${tone}`}>
      <span className="panel-label">{label}</span>
      <strong>{title}</strong>
      <ul className="manual-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function ToolLinkCard({
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
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <span>열기</span>
    </a>
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
    <section className="manual-panel">
      <div className="panel-heading">
        <span className="panel-label">실습 순서</span>
        <strong>위에서 아래로 순서대로 따라가면 됩니다.</strong>
      </div>
      <div className="schedule-list">
        {modules.map((module) => (
          <button key={module.slug} type="button" className="schedule-item" onClick={() => onNavigate(`/modules/${module.slug}`)}>
            <div className="schedule-number">{module.stepNumber}</div>
            <div className="schedule-copy">
              <strong>{module.title}</strong>
              <p>{module.summary}</p>
            </div>
            <span>{module.estimatedTime}</span>
          </button>
        ))}
      </div>
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
    { label: '학교', value: schoolName },
    { label: '날짜', value: formatKoreanDate(date) },
    { label: '강사', value: instructor },
  ]

  return (
    <section className="manual-panel">
      <div className="panel-heading">
        <span className="panel-label">기본 정보</span>
        <strong>오늘 연수 정보</strong>
      </div>
      <div className="info-grid">
        {entries.map((entry) => (
          <article key={entry.label} className="info-box">
            <span>{entry.label}</span>
            <strong>{entry.value}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

export function StepTaskCard({
  module,
}: {
  module: ModuleItem
}) {
  return (
    <section className="manual-panel focus-panel">
      <div className="panel-heading">
        <span className="panel-label">지금 할 일</span>
        <strong>{module.toolInstruction ?? `${module.tool}을 열고 이 단계부터 시작하세요.`}</strong>
      </div>
      <div className="focus-meta">
        <span>{module.stepNumber}단계</span>
        <span>{module.estimatedTime}</span>
        <span>{module.difficulty}</span>
      </div>
      <p>{module.entryHint ?? module.summary}</p>
      {module.primaryToolUrl ? <ActionButton href={module.primaryToolUrl} kind="solid" external>{module.ctaLabel ?? '지금 열기'}</ActionButton> : null}
    </section>
  )
}

export function HelpStrip({
  items,
}: {
  items: string[]
}) {
  return (
    <section className="help-strip">
      {items.map((item) => (
        <article key={item} className="help-chip">
          {item}
        </article>
      ))}
    </section>
  )
}

export function ScreenshotGuideCard({
  module,
}: {
  module: ModuleItem
}) {
  return (
    <section className="manual-panel">
      <div className="panel-heading">
        <span className="panel-label">어디를 누르나요</span>
        <strong>{module.entryHint ?? '입력창이나 탭 위치를 먼저 확인하세요.'}</strong>
      </div>
      <p>{module.screenshotHint ?? '실제 화면 캡처가 준비되면 이 자리에 바로 교체할 수 있습니다.'}</p>
      <div className="screenshot-placeholder">
        <div className="fake-topbar" />
        <div className="fake-title" />
        <div className="fake-tabs">
          <span />
          <span />
          <span />
        </div>
        <div className="fake-content" />
      </div>
    </section>
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
      <div className="process-index">{index + 1}</div>
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
          window.setTimeout(() => setStatus('idle'), 1500)
        } catch {
          setStatus('error')
          window.setTimeout(() => setStatus('idle'), 1500)
        }
      }}
    >
      {status === 'idle' && label}
      {status === 'done' && '복사 완료'}
      {status === 'error' && '다시 시도'}
    </button>
  )
}

export function PromptRecipeCard({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const renderedPrompt = replacePromptVariables(
    prompt,
    Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue])),
  )

  return (
    <article className="prompt-recipe-card">
      <div className="recipe-top">
        <div>
          <span className="panel-label">{prompt.relatedTool}</span>
          <strong>{prompt.title}</strong>
        </div>
        <CopyButton text={renderedPrompt} />
      </div>
      <div className="recipe-grid">
        <div>
          <span>언제 쓰나요</span>
          <p>{prompt.exampleUse}</p>
        </div>
        <div>
          <span>어디에 붙여 넣나요</span>
          <p>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</p>
        </div>
      </div>
      <button type="button" className="button ghost" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        상세 보기
      </button>
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
  const renderedPrompt = replacePromptVariables(
    prompt,
    Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue])),
  )

  return (
    <article className="prompt-list-card">
      <div>
        <div className="meta-row">
          <span>{prompt.relatedTool}</span>
          <span>{prompt.difficulty ?? '기초'}</span>
        </div>
        <strong>{prompt.title}</strong>
        <p>{prompt.exampleUse}</p>
        <p>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</p>
      </div>
      <div className="prompt-list-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="button ghost" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          자세히 보기
        </button>
      </div>
    </article>
  )
}

export function PromptCard({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue])),
  )
  const renderedPrompt = replacePromptVariables(prompt, values)

  return (
    <article className="prompt-detail-card">
      <div className="meta-row">
        <span>{prompt.relatedTool}</span>
        <span>{prompt.difficulty ?? '기초'}</span>
      </div>
      <h2>{prompt.title}</h2>
      <p>{prompt.exampleUse}</p>

      <div className="detail-grid">
        <article className="info-box">
          <span>들어가는 곳</span>
          <strong>{prompt.clickPath ?? prompt.whereToUse ?? `${prompt.relatedTool} 입력창`}</strong>
        </article>
        <article className="info-box">
          <span>붙여 넣은 뒤 확인</span>
          <strong>{prompt.afterPasteHint ?? '결과가 원하는 형식으로 나오는지 확인합니다.'}</strong>
        </article>
        <article className="info-box">
          <span>안 맞으면 수정</span>
          <strong>{prompt.fixTip ?? '조건을 더 짧고 구체적으로 다시 적습니다.'}</strong>
        </article>
      </div>

      {prompt.variables.length > 0 ? (
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

      <pre>{renderedPrompt}</pre>
      <div className="toolbar-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="button outline" onClick={() => onNavigate('/prompts')}>
          프롬프트 목록
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
    <div className="example-grid">
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
    <section className="manual-card apricot">
      <span className="panel-label">도움말</span>
      <strong>{title}</strong>
      <p>{description}</p>
      <ul className="manual-list">
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
  description,
}: {
  text: string
  url: string
  description?: string
}) {
  return (
    <a className="padlet-card" href={url} target="_blank" rel="noreferrer">
      <span className="panel-label">Padlet</span>
      <strong>{text}</strong>
      <p>{description ?? '결과 공유는 Padlet에서만 진행합니다.'}</p>
    </a>
  )
}

export function StepFooterNav({
  previousHref,
  previousLabel,
  nextHref,
  nextLabel,
}: {
  previousHref?: string
  previousLabel?: string
  nextHref?: string
  nextLabel?: string
}) {
  return (
    <div className="step-footer-nav">
      {previousHref ? (
        <a className="button outline footer-button" href={buildInternalHref(previousHref)}>
          이전: {previousLabel}
        </a>
      ) : (
        <span />
      )}
      {nextHref ? (
        <a className="button solid footer-button" href={buildInternalHref(nextHref)}>
          다음: {nextLabel}
        </a>
      ) : null}
    </div>
  )
}
