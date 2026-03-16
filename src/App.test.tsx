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

    expect(screen.getByRole('heading', { name: '생성형 AI를 활용한 칼퇴하기' })).toBeInTheDocument()
    expect(screen.getByText('의랑초등학교')).toBeInTheDocument()
    expect(screen.getByText('반곡초 황도연')).toBeInTheDocument()
  })

  it('filters prompts on the prompt hub', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/prompts')
    render(<App />)

    const search = screen.getByRole('searchbox', { name: '프롬프트 검색' })
    await user.type(search, 'Canva 앱')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Canva 앱 PRD 메이커' })).toBeInTheDocument()
    })

    expect(screen.queryByRole('button', { name: '수업 설계 가속 프롬프트' })).not.toBeInTheDocument()
  })

  it('copies a prompt with replaced variables', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/prompts/lesson-design-accelerator')
    render(<App />)

    const gradeInput = screen.getByLabelText('학년')
    await user.clear(gradeInput)
    await user.type(gradeInput, '6학년')
    await user.click(screen.getByRole('button', { name: '프롬프트 복사' }))

    await waitFor(() => {
      expect(clipboardWrite).toHaveBeenCalled()
    })

    expect(clipboardWrite.mock.calls[0][0]).toContain('6학년')
    expect(clipboardWrite.mock.calls[0][0]).toContain('설명하는 글 쓰기')
  })
})
