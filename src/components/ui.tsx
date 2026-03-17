import { useState, type ReactNode } from 'react'
import { buildAssetHref, buildInternalHref, isCurrentPath, isExternalHref, isInternalRoute } from '../lib/routing'
import { courseModules, currentSession } from '../site/content'
import type { ExampleItem, GuideShot, ModuleItem, PromptItem, ResourceItem } from '../site/types'

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

function getCurrentStep(pathname: string): number {
  const current = courseModules.find((module) => isCurrentPath(pathname, `/modules/${module.slug}`))
  return current?.stepNumber ?? 0
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
  const currentStep = getCurrentStep(pathname)

  return (
    <div className="app-shell">
      <aside className="step-rail" aria-label="연수 단계">
        <button type="button" className="brand-lockup" onClick={() => onNavigate('/today')} aria-label="시작 페이지로 이동">
          <span className="brand-mark">AI</span>
          <span className="brand-copy">
            <strong>생성형 AI 실습 워크북</strong>
            <small>teacher training manual</small>
          </span>
        </button>

        <div className="rail-group">
          <span className="rail-label">시작</span>
          <button
            type="button"
            className={`rail-link ${pathname === '/' || pathname === '/today' ? 'active' : ''}`}
            onClick={() => onNavigate('/today')}
          >
            시작하기
          </button>
        </div>

        <div className="rail-group">
          <span className="rail-label">단계</span>
          <nav className="rail-nav">
            {courseModules.map((module) => {
              const isActive = isCurrentPath(pathname, `/modules/${module.slug}`)
              const isDone = currentStep > 0 && (module.stepNumber ?? 0) < currentStep

              return (
                <button
                  key={module.slug}
                  type="button"
                  className={`rail-link rail-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`.trim()}
                  onClick={() => onNavigate(`/modules/${module.slug}`)}
                >
                  <span className="rail-step-number">{module.stepNumber}</span>
                  <span className="rail-step-copy">{module.title}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="rail-group">
          <span className="rail-label">참고</span>
          <button
            type="button"
            className={`rail-link ${isCurrentPath(pathname, '/prompts') ? 'active' : ''}`}
            onClick={() => onNavigate('/prompts')}
          >
            프롬프트 모음
          </button>
          <button
            type="button"
            className={`rail-link ${pathname === '/resources' || pathname === '/guide' ? 'active' : ''}`}
            onClick={() => onNavigate('/resources')}
          >
            자료/도움
          </button>
        </div>

        <div className="rail-group rail-shortcuts">
          <span className="rail-label">바로 열기</span>
          <a className="rail-shortcut" href={currentSession.padletUrl} target="_blank" rel="noreferrer">
            Padlet 열기
          </a>
          <a className="rail-shortcut" href="https://gemini.google.com" target="_blank" rel="noreferrer">
            Gemini 열기
          </a>
          <a className="rail-shortcut" href="https://grok.com" target="_blank" rel="noreferrer">
            Grok 열기
          </a>
        </div>
      </aside>

      <main className="content-stage">{children}</main>
    </div>
  )
}

export function WorkbookPage({
  children,
  width = 'normal',
}: {
  children: ReactNode
  width?: 'normal' | 'wide'
}) {
  return <article className={`workbook-page ${width === 'wide' ? 'wide' : ''}`}>{children}</article>
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: { label: string; href: string; kind?: 'solid' | 'outline'; external?: boolean }
}) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? (
        <div className="page-header-action">
          <ActionButton href={action.href} kind={action.kind ?? 'solid'} external={action.external}>
            {action.label}
          </ActionButton>
        </div>
      ) : null}
    </header>
  )
}

export function WorkbookSection({
  title,
  description,
  children,
  tone = 'default',
}: {
  title: string
  description?: string
  children: ReactNode
  tone?: 'default' | 'blue' | 'apricot'
}) {
  return (
    <section className={`workbook-section tone-${tone}`}>
      <div className="section-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="section-body">{children}</div>
    </section>
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
      <a className={`action-button ${kind}`} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <a className={`action-button ${kind}`} href={buildInternalHref(href)}>
      {children}
    </a>
  )
}

export function StartSummary({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div className="start-summary">
      <p className="section-kicker">오늘 연수에서 할 일</p>
      <h2>{title}</h2>
      <ol className="order-outline">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  )
}

export function PrimaryTask({
  label,
  title,
  description,
  action,
}: {
  label: string
  title: string
  description: string
  action?: { label: string; href: string; external?: boolean }
}) {
  return (
    <div className="primary-task">
      <p className="section-kicker">{label}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? (
        <div className="primary-task-action">
          <ActionButton href={action.href} kind="solid" external={action.external}>
            {action.label}
          </ActionButton>
        </div>
      ) : null}
    </div>
  )
}

export function MetaLine({ items }: { items: string[] }) {
  return (
    <div className="meta-line">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  )
}

export function ToolActionBlock({
  items,
}: {
  items: Array<{ title: string; description: string; url: string }>
}) {
  return (
    <div className="tool-actions">
      {items.map((item) => (
        <a key={item.title} className="tool-action" href={item.url} target="_blank" rel="noreferrer">
          <div className="tool-action-copy">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
          <span>열기</span>
        </a>
      ))}
    </div>
  )
}

export function SessionMeta({
  schoolName,
  date,
  instructor,
  notices,
}: {
  schoolName: string
  date: string
  instructor: string
  notices: string[]
}) {
  return (
    <div className="session-meta">
      <div className="session-meta-grid">
        <div>
          <span>학교</span>
          <strong>{schoolName}</strong>
        </div>
        <div>
          <span>날짜</span>
          <strong>{formatKoreanDate(date)}</strong>
        </div>
        <div>
          <span>강사</span>
          <strong>{instructor}</strong>
        </div>
      </div>
      <ul className="plain-notes">
        {notices.map((notice) => (
          <li key={notice}>{notice}</li>
        ))}
      </ul>
    </div>
  )
}

export function StepOutlineList({
  modules,
  onNavigate,
}: {
  modules: ModuleItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <ol className="step-outline-list">
      {modules.map((module) => (
        <li key={module.slug}>
          <button type="button" className="step-outline-row" onClick={() => onNavigate(`/modules/${module.slug}`)}>
            <span className="step-outline-number">{module.stepNumber}</span>
            <span className="step-outline-copy">
              <strong>{module.title}</strong>
              <small>{module.summary}</small>
            </span>
            <span className="step-outline-time">{module.estimatedTime}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}

export function GuideShotsGallery({
  shots,
  fallbackTitle,
  fallbackText,
}: {
  shots: GuideShot[]
  fallbackTitle?: string
  fallbackText?: string
}) {
  if (shots.length === 0) {
    return (
      <div className="guide-fallback">
        <strong>{fallbackTitle ?? '입력 위치를 먼저 확인하세요.'}</strong>
        <p>{fallbackText ?? '실제 캡처가 들어오면 이 영역이 화면 안내 이미지로 바뀝니다.'}</p>
      </div>
    )
  }

  return (
    <div className="guide-shot-grid">
      {shots.map((shot) => (
        <figure key={`${shot.title}-${shot.image}`} className="guide-shot">
          <img src={buildAssetHref(shot.image)} alt={shot.alt} />
          <figcaption>
            <strong>{shot.title}</strong>
            {shot.caption ? <p>{shot.caption}</p> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export function InstructionList({
  steps,
}: {
  steps: ModuleItem['steps']
}) {
  return (
    <ol className="instruction-list">
      {steps.map((step, index) => (
        <li key={`${step.title}-${index}`} className="instruction-row">
          <div className="instruction-number">{index + 1}</div>
          <div className="instruction-content">
            <strong>{step.title}</strong>
            <p>{step.description}</p>
            {step.tip ? <small>{step.tip}</small> : null}
          </div>
        </li>
      ))}
    </ol>
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
      className="action-button solid"
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
      {status === 'idle' ? label : status === 'done' ? '복사 완료' : '다시 시도'}
    </button>
  )
}

export function PromptInline({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const values = Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue]))
  const renderedPrompt = replacePromptVariables(prompt, values)

  return (
    <div className="prompt-inline">
      <div className="prompt-inline-head">
        <div>
          <p className="section-kicker">{prompt.relatedTool}</p>
          <strong>{prompt.title}</strong>
        </div>
        <CopyButton text={renderedPrompt} />
      </div>
      <div className="prompt-inline-meta">
        <p>
          <strong>어디에 붙이나요</strong> {prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}
        </p>
        <p>
          <strong>무엇에 쓰나요</strong> {prompt.exampleUse}
        </p>
      </div>
      <pre className="prompt-code">{renderedPrompt}</pre>
      <button type="button" className="text-link" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        프롬프트 상세 보기
      </button>
    </div>
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
      <input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function PromptListItem({
  prompt,
  onNavigate,
}: {
  prompt: PromptItem
  onNavigate: (href: string) => void
}) {
  const values = Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue]))
  const renderedPrompt = replacePromptVariables(prompt, values)

  return (
    <div className="prompt-row">
      <div className="prompt-row-copy">
        <div className="meta-line compact">
          <span>{prompt.relatedTool}</span>
          <span>{prompt.difficulty ?? '기초'}</span>
        </div>
        <strong>{prompt.title}</strong>
        <p>{prompt.exampleUse}</p>
        <small>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</small>
      </div>
      <div className="prompt-row-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="text-link" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          상세 보기
        </button>
      </div>
    </div>
  )
}

export function PromptDetailBlock({
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
    <div className="prompt-detail">
      <div className="meta-line">
        <span>{prompt.relatedTool}</span>
        <span>{prompt.difficulty ?? '기초'}</span>
        <span>{prompt.outputFormat ?? '자유 형식'}</span>
      </div>

      <div className="detail-copy">
        <p>
          <strong>실행 위치</strong> {prompt.clickPath ?? prompt.whereToUse ?? `${prompt.relatedTool} 입력창`}
        </p>
        <p>
          <strong>붙여 넣은 뒤 확인</strong> {prompt.afterPasteHint ?? '원하는 형식과 길이로 나오고 있는지 확인합니다.'}
        </p>
        <p>
          <strong>결과가 이상할 때</strong> {prompt.fixTip ?? '조건을 줄이고 더 구체적인 문장으로 다시 요청합니다.'}
        </p>
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

      <pre className="prompt-code">{renderedPrompt}</pre>
      <div className="inline-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="text-link" onClick={() => onNavigate('/prompts')}>
          프롬프트 목록으로
        </button>
      </div>
    </div>
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
    <div className="example-gallery">
      {items.map((item) => (
        <article key={item.slug} className="example-card">
          <img src={buildAssetHref(item.image)} alt={item.title} />
          <div className="example-copy">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <button type="button" className="text-link" onClick={() => onNavigate(`/prompts/${item.relatedPrompt}`)}>
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
        const href = item.downloadable && item.url.startsWith('/') ? buildAssetHref(item.url) : item.url

        return (
          <div key={`${item.category}-${item.title}`} className="resource-row">
            <div className="resource-copy">
              <div className="meta-line compact">
                <span>{item.category}</span>
                <span>{item.type}</span>
              </div>
              <strong>{item.title}</strong>
            </div>
            {isRoute ? (
              <button type="button" className="text-link" onClick={() => onNavigate(item.url)}>
                보기
              </button>
            ) : (
              <a
                className="text-link"
                href={href}
                target={item.downloadable ? undefined : '_blank'}
                rel={item.downloadable ? undefined : 'noreferrer'}
                download={item.downloadable || undefined}
              >
                {item.downloadable ? '다운로드' : '열기'}
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function NoteBlock({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div className="note-block">
      <strong>{title}</strong>
      <ul className="plain-notes">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function PadletSubmitBlock({
  text,
  url,
  description,
}: {
  text: string
  url: string
  description?: string
}) {
  return (
    <div className="padlet-block">
      <p className="section-kicker">Padlet 제출</p>
      <h3>{text}</h3>
      <p>{description ?? '결과 공유는 Padlet에서만 진행합니다.'}</p>
      <ActionButton href={url} kind="solid" external>
        Padlet 열기
      </ActionButton>
    </div>
  )
}

export function StepNav({
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
    <div className="step-nav-footer">
      <div className="step-nav-side">
        {previousHref ? (
          <a className="action-button outline nav-button" href={buildInternalHref(previousHref)}>
            이전 단계: {previousLabel}
          </a>
        ) : null}
      </div>
      <div className="step-nav-side end">
        {nextHref ? (
          <a className="action-button solid nav-button" href={buildInternalHref(nextHref)}>
            다음 단계: {nextLabel}
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action: { label: string; href: string }
}) {
  return (
    <div className="empty-state">
      <h1>{title}</h1>
      <p>{description}</p>
      <ActionButton href={action.href} kind="solid">
        {action.label}
      </ActionButton>
    </div>
  )
}
