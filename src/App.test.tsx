import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  let clipboardWrite: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.restoreAllMocks()
    window.history.pushState({}, '', '/')
    window.scrollTo = vi.fn()
    clipboardWrite = vi.fn().mockResolvedValue(undefined)
    const existingWriteText = (navigator as { clipboard?: { writeText?: unknown } }).clipboard?.writeText

    if (typeof existingWriteText === 'function') {
      vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(
        (text: string) => (clipboardWrite as unknown as (value: string) => Promise<void>)(text),
      )
      return
    }

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: clipboardWrite,
      },
    })
  })

  it('renders the today page with current session details', () => {
    window.history.pushState({}, '', '/today')
    render(<App />)

    expect(screen.getByRole('heading', { name: '생성형 AI로 이미지, 영상, 글쓰기까지 빠르게 만들기' })).toBeInTheDocument()
    expect(screen.getByText('의랑초등학교')).toBeInTheDocument()
    expect(screen.getByText('반곡초 황도연')).toBeInTheDocument()
  })

  it('filters prompts on the prompt hub', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/prompts')
    render(<App />)

    const search = screen.getByRole('searchbox', { name: '프롬프트 검색' })
    await user.type(search, 'Grok')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Grok 영상 생성용 장면 설계 프롬프트' })).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: 'AI 글쓰기 초안 만들기' })).not.toBeInTheDocument()
  })

  it('copies a prompt with replaced variables', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/prompts/gemini-image-prompt')
    render(<App />)

    const topicInput = screen.getByLabelText('주제')
    await user.clear(topicInput)
    await user.type(topicInput, '물의 순환 포스터')
    await user.click(screen.getByRole('button', { name: '프롬프트 복사' }))

    await waitFor(() => {
      expect(clipboardWrite).toHaveBeenCalled()
    })

    expect(clipboardWrite.mock.calls[0][0]).toContain('물의 순환 포스터')
    expect(clipboardWrite.mock.calls[0][0]).toContain('텍스트를 넣지 말아야')
  })
})
