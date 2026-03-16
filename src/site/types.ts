export interface ExternalLink {
  label: string
  url: string
  description: string
}

export interface PromptVariable {
  key: string
  label: string
  placeholder: string
  defaultValue: string
}

export interface PromptItem {
  title: string
  slug: string
  category: string
  tags: string[]
  body: string
  variables: PromptVariable[]
  exampleUse: string
  relatedTool: string
}

export interface ExampleItem {
  title: string
  slug: string
  tool: string
  image: string
  description: string
  relatedPrompt: string
  useCase: string
}

export interface ResourceItem {
  title: string
  type: string
  url: string
  downloadable: boolean
  category: string
}

export interface ModuleStep {
  title: string
  description: string
  tip?: string
}

export interface ModuleBlocker {
  question: string
  answer: string
}

export interface ModuleItem {
  title: string
  slug: string
  summary: string
  tool: string
  order: number
  difficulty: string
  estimatedTime: string
  goal: string
  externalLinks: ExternalLink[]
  prompts: string[]
  examples: string[]
  resources: string[]
  padletCtaText: string
  preparations: string[]
  steps: ModuleStep[]
  blockers: ModuleBlocker[]
}

export interface CurrentSession {
  trainingTitle: string
  schoolName: string
  date: string
  notices: string[]
  padletUrl: string
  featuredModules: string[]
  instructor: string
}
