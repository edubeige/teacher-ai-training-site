export type RouteMatch =
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

export const navigationItems = [
  { href: '/', label: '홈' },
  { href: '/today', label: '오늘 연수' },
  { href: '/course/generative-ai', label: '코스' },
  { href: '/prompts', label: '프롬프트 허브' },
  { href: '/examples', label: '예시 갤러리' },
  { href: '/resources', label: '자료실' },
  { href: '/guide', label: '가이드' },
] as const

const baseUrl = import.meta.env.BASE_URL

export function useHashRouting(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.hostname.endsWith('github.io')
}

export function normalizePath(pathname: string): string {
  const trimmed = pathname.trim()
  if (!trimmed) {
    return '/'
  }

  const withoutTrailingSlash = trimmed !== '/' ? trimmed.replace(/\/+$/, '') : trimmed
  return withoutTrailingSlash || '/'
}

export function stripBasePath(pathname: string): string {
  const normalized = normalizePath(pathname)
  const normalizedBase = baseUrl === '/' ? '/' : `/${baseUrl.replace(/^\/|\/$/g, '')}`

  if (normalizedBase === '/' || !normalized.startsWith(normalizedBase)) {
    return normalized
  }

  const stripped = normalized.slice(normalizedBase.length)
  return normalizePath(stripped || '/')
}

export function buildInternalHref(pathname: string): string {
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

export function buildAssetHref(pathname: string): string {
  const sanitized = pathname.replace(/^\/+/, '')
  return `${baseUrl}${sanitized}`
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function isInternalRoute(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

export function getCurrentPathname(): string {
  if (typeof window === 'undefined') {
    return '/'
  }

  if (useHashRouting()) {
    const hashPath = window.location.hash.replace(/^#/, '')
    return normalizePath(hashPath || '/')
  }

  return stripBasePath(window.location.pathname)
}

export function matchRoute(pathname: string): RouteMatch {
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

export function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
