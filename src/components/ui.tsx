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
      <aside className="step-rail">
        <button type="button" className="brand-lockup" onClick={() => onNavigate('/today')} aria-label="시작하기로 이동">
          <span className="brand-mark">AI</span>
          <span className="brand-copy">
            <strong>생성형 AI 실습 워크북</strong>
            <small>teacher training manual</small>
          </span>
        </button>

        <nav className="step-nav" aria-label="실습 단계">
          <span className="step-nav-label">시작</span>
          <button
            type="button"
            className={`step-nav-link ${pathname === '/' || pathname === '/today' ? 'active' : ''}`}
            onClick={() => onNavigate('/today')}
          >
            시작하기
          </button>

          <span className="step-nav-label">단계</span>
          {stepItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className={`step-nav-link ${isCurrentPath(pathname, item.href) ? 'active' : ''}`}
              onClick={() => onNavigate(item.href)}
            >
              {item.label}
            </button>
          ))}

          <span className="step-nav-label">참고</span>
          <button
            type="button"
            className={`step-nav-link ${isCurrentPath(pathname, '/prompts') ? 'active' : ''}`}
            onClick={() => onNavigate('/prompts')}
          >
            프롬프트 모음
          </button>
          <button
            type="button"
            className={`step-nav-link ${pathname === '/resources' || pathname === '/guide' ? 'active' : ''}`}
            onClick={() => onNavigate('/resources')}
          >
            자료/도움
          </button>
        </nav>

        <div className="rail-shortcuts">
          <span className="step-nav-label">바로 열기</span>
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

export function MobileStepBar({ currentStep }: { currentStep: number }) {
  return (
    <nav className="mobile-step-bar" aria-label="단계 진행">
      {courseModules.map((module) => {
        const isActive = module.stepNumber === currentStep
        const isDone = (module.stepNumber ?? 0) < currentStep

        return (
          <div key={module.slug} className={`mobile-step-chip ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`.trim()}>
            <span>{module.stepNumber}</span>
            <strong>{module.title}</strong>
          </div>
        )
      })}
    </nav>
  )
}

export function WorkbookSheet({
  children,
  accent = 'default',
}: {
  children: ReactNode
  accent?: 'default' | 'blue' | 'apricot'
}) {
  return <section className={`workbook-sheet ${accent}`}>{children}</section>
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

export function StartSummary({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <WorkbookSheet accent="blue">
      <span className="section-label">오늘 할 일</span>
      <h2 className="sheet-heading">{title}</h2>
      <ol className="plain-steps">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </WorkbookSheet>
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
    <WorkbookSheet>
      <span className="section-label">{label}</span>
      <h2 className="sheet-heading">{title}</h2>
      <p className="lead-copy">{description}</p>
      {action ? <ActionButton href={action.href} kind="solid" external={action.external}>{action.label}</ActionButton> : null}
    </WorkbookSheet>
  )
}

export function ToolActionBlock({
  items,
}: {
  items: Array<{ title: string; description: string; url: string }>
}) {
  return (
    <WorkbookSheet>
      <SectionTitle title="지금 열어야 할 도구" description="버튼만 눌러 순서대로 열어 두세요." />
      <div className="tool-actions">
        {items.map((item) => (
          <a key={item.title} className="tool-action" href={item.url} target="_blank" rel="noreferrer">
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <span>열기</span>
          </a>
        ))}
      </div>
    </WorkbookSheet>
  )
}

export function SessionMeta({
  schoolName,
  date,
  instructor,
}: {
  schoolName: string
  date: string
  instructor: string
}) {
  const items = [
    { label: '학교', value: schoolName },
    { label: '날짜', value: formatKoreanDate(date) },
    { label: '강사', value: instructor },
  ]

  return (
    <WorkbookSheet>
      <SectionTitle title="오늘 연수 정보" />
      <div className="meta-strip">
        {items.map((item) => (
          <div key={item.label} className="meta-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </WorkbookSheet>
  )
}

export function StepList({
  modules,
  onNavigate,
}: {
  modules: ModuleItem[]
  onNavigate: (href: string) => void
}) {
  return (
    <WorkbookSheet>
      <SectionTitle title="오늘 순서" description="위에서 아래로 차례대로 진행하면 됩니다." />
      <div className="step-list">
        {modules.map((module) => (
          <button key={module.slug} type="button" className="step-row" onClick={() => onNavigate(`/modules/${module.slug}`)}>
            <div className="step-row-number">{module.stepNumber}</div>
            <div className="step-row-copy">
              <strong>{module.title}</strong>
              <p>{module.summary}</p>
            </div>
            <span>{module.estimatedTime}</span>
          </button>
        ))}
      </div>
    </WorkbookSheet>
  )
}

export function StepHeader({
  module,
}: {
  module: ModuleItem
}) {
  return (
    <WorkbookSheet accent="blue">
      <span className="section-label">Step {module.stepNumber}</span>
      <h2 className="sheet-heading">{module.title}</h2>
      <p className="lead-copy">{module.summary}</p>
      <div className="meta-inline">
        <span>예상 시간 {module.estimatedTime}</span>
        <span>{module.difficulty}</span>
        <span>{module.expectedOutcome ?? module.goal}</span>
      </div>
    </WorkbookSheet>
  )
}

export function StepSection({
  title,
  description,
  children,
  accent = 'default',
}: {
  title: string
  description?: string
  children: ReactNode
  accent?: 'default' | 'blue' | 'apricot'
}) {
  return (
    <WorkbookSheet accent={accent}>
      <SectionTitle title={title} description={description} />
      {children}
    </WorkbookSheet>
  )
}

export function InfoInline({
  items,
}: {
  items: string[]
}) {
  return (
    <div className="info-inline">
      {items.map((item) => (
        <div key={item} className="info-inline-item">
          {item}
        </div>
      ))}
    </div>
  )
}

export function ScreenGuide({
  module,
}: {
  module: ModuleItem
}) {
  return (
    <div className="screen-guide">
      <div className="screen-guide-copy">
        <strong>{module.entryHint ?? '입력창과 탭 위치를 먼저 확인하세요.'}</strong>
        <p>{module.screenshotHint ?? '실제 화면 캡처가 준비되면 이 자리에 바로 교체할 수 있습니다.'}</p>
      </div>
      <div className="screen-placeholder">
        <div className="placeholder-top" />
        <div className="placeholder-title" />
        <div className="placeholder-tabs">
          <span />
          <span />
          <span />
        </div>
        <div className="placeholder-body" />
      </div>
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
        <li key={`${step.title}-${index}`} className="instruction-item">
          <div className="instruction-number">{index + 1}</div>
          <div className="instruction-copy">
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

export function PromptInline({
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
    <div className="prompt-inline">
      <div className="prompt-inline-head">
        <div>
          <span className="section-label">{prompt.relatedTool}</span>
          <strong>{prompt.title}</strong>
        </div>
        <CopyButton text={renderedPrompt} />
      </div>
      <div className="prompt-inline-meta">
        <p><strong>언제 쓰나요:</strong> {prompt.exampleUse}</p>
        <p><strong>어디에 붙여 넣나요:</strong> {prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</p>
      </div>
      <button type="button" className="action-button ghost" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
        자세히 보기
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
      <input type="search" aria-label={label} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
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
  const renderedPrompt = replacePromptVariables(
    prompt,
    Object.fromEntries(prompt.variables.map((variable) => [variable.key, variable.defaultValue])),
  )

  return (
    <div className="prompt-list-item">
      <div>
        <div className="meta-inline">
          <span>{prompt.relatedTool}</span>
          <span>{prompt.difficulty ?? '기초'}</span>
        </div>
        <strong>{prompt.title}</strong>
        <p>{prompt.exampleUse}</p>
        <p>{prompt.whereToUse ?? `${prompt.relatedTool} 입력창에 붙여 넣습니다.`}</p>
      </div>
      <div className="prompt-list-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="action-button ghost" onClick={() => onNavigate(`/prompts/${prompt.slug}`)}>
          자세히 보기
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
    <WorkbookSheet>
      <div className="meta-inline">
        <span>{prompt.relatedTool}</span>
        <span>{prompt.difficulty ?? '기초'}</span>
      </div>
      <h2 className="sheet-heading">{prompt.title}</h2>
      <p className="lead-copy">{prompt.exampleUse}</p>

      <div className="detail-lines">
        <p><strong>들어가는 곳:</strong> {prompt.clickPath ?? prompt.whereToUse ?? `${prompt.relatedTool} 입력창`}</p>
        <p><strong>붙여 넣은 뒤 확인:</strong> {prompt.afterPasteHint ?? '결과가 원하는 형식인지 확인합니다.'}</p>
        <p><strong>결과 수정 팁:</strong> {prompt.fixTip ?? '조건을 더 짧고 구체적으로 다시 적습니다.'}</p>
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
      <div className="toolbar-actions">
        <CopyButton text={renderedPrompt} />
        <button type="button" className="action-button outline" onClick={() => onNavigate('/prompts')}>
          프롬프트 목록
        </button>
      </div>
    </WorkbookSheet>
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
    <div className="example-strip">
      {items.map((item) => (
        <article key={item.slug} className="example-item">
          <img src={buildAssetHref(item.image)} alt="" />
          <div className="example-copy">
            <div className="meta-inline">
              <span>{item.tool}</span>
              <span>{item.useCase}</span>
            </div>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
            <button type="button" className="action-button ghost" onClick={() => onNavigate(`/prompts/${item.relatedPrompt}`)}>
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
          <article key={`${item.category}-${item.title}`} className="resource-item">
            <div>
              <div className="meta-inline">
                <span>{item.category}</span>
                <span>{item.type}</span>
              </div>
              <strong>{item.title}</strong>
            </div>
            {isRoute ? (
              <button type="button" className="action-button outline" onClick={() => onNavigate(item.url)}>
                열기
              </button>
            ) : (
              <a
                className="action-button outline"
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

export function NoteBlock({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: string[]
}) {
  return (
    <WorkbookSheet accent="apricot">
      <SectionTitle title={title} description={description} />
      <ul className="plain-notes">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </WorkbookSheet>
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
    <WorkbookSheet accent="blue">
      <span className="section-label">Padlet</span>
      <h2 className="sheet-heading">{text}</h2>
      <p className="lead-copy">{description ?? '결과 공유는 Padlet에서만 진행합니다.'}</p>
      <ActionButton href={url} kind="solid" external>
        Padlet 열기
      </ActionButton>
    </WorkbookSheet>
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
      {previousHref ? (
        <a className="action-button outline nav-button" href={buildInternalHref(previousHref)}>
          이전 단계: {previousLabel}
        </a>
      ) : (
        <span />
      )}
      {nextHref ? (
        <a className="action-button solid nav-button" href={buildInternalHref(nextHref)}>
          다음 단계: {nextLabel}
        </a>
      ) : null}
    </div>
  )
}
