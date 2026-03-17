import { startTransition, useEffect, useMemo, useState } from 'react'
import './styles.css'
import { AppShell } from './components/ui'
import { getCurrentPathname, matchRoute, normalizePath, buildInternalHref } from './lib/routing'
import { promptMap } from './site/content'
import {
  CoursePage,
  ExamplesPage,
  GuidePage,
  HomePage,
  ModulePage,
  NotFoundPage,
  PromptDetailPage,
  PromptsPage,
  ResourcesPage,
  TodayPage,
} from './pages'
import { courseModules } from './site/content'

const moduleMap = new Map(courseModules.map((module) => [module.slug, module]))

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

  let content

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
    content = <ResourcesPage onNavigate={handleNavigate} />
  } else if (route.kind === 'guide') {
    content = <GuidePage onNavigate={handleNavigate} />
  } else if (route.kind === 'module') {
    const module = moduleMap.get(route.slug)
    content = module ? <ModulePage module={module} onNavigate={handleNavigate} /> : <NotFoundPage onNavigate={handleNavigate} />
  } else {
    content = <NotFoundPage onNavigate={handleNavigate} />
  }

  return (
    <AppShell pathname={pathname} onNavigate={handleNavigate}>
      {content}
    </AppShell>
  )
}

export default App
