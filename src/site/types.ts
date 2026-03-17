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
  whereToUse?: string
  expectedOutput?: string
  difficulty?: '입문' | '기초' | '응용'
  useCase?: string
  outputFormat?: string
  clickPath?: string
  afterPasteHint?: string
  fixTip?: string
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

export interface GuideShot {
  title: string
  image: string
  alt: string
  caption?: string
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
  expectedOutcome?: string
  quickWin?: string
  commonMistake?: string
  fallbackAction?: string
  primaryToolUrl?: string
  waitNote?: string
  stepNumber?: number
  ctaLabel?: string
  toolInstruction?: string
  entryHint?: string
  padletInstruction?: string
  screenshotHint?: string
  guideShots?: GuideShot[]
}

export interface CurrentSession {
  trainingTitle: string
  schoolName: string
  date: string
  notices: string[]
  padletUrl: string
  featuredModules: string[]
  instructor: string
  quickStartSteps?: string[]
  mustOpenTools?: string[]
  supportNotes?: string[]
  agendaTitle?: string
  primaryAction?: string
  secondaryAction?: string
}
