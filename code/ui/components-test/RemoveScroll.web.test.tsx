import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { RemoveScroll } from '../remove-scroll/src/RemoveScroll'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test('locks and restores iOS scrolling without measuring a scrollbar gutter', () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone Safari')
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  const readWidth = vi.spyOn(document.documentElement, 'clientWidth', 'get')
  const previousOverflow = document.documentElement.style.overflow
  const previousPosition = document.body.style.position
  const { rerender } = render(<RemoveScroll enabled />)

  expect(document.documentElement.style.overflow).toBe('hidden')
  expect(document.body.style.position).toBe('fixed')
  expect(document.body.style.top).toBe('-120px')
  expect(readWidth).not.toHaveBeenCalled()

  rerender(<RemoveScroll enabled={false} />)
  expect(document.documentElement.style.overflow).toBe(previousOverflow)
  expect(document.body.style.position).toBe(previousPosition)
  expect(scrollTo).toHaveBeenCalledWith(0, 120)
})

test('still reserves an existing desktop scrollbar gutter', () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Chrome')
  vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000)
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(980)
  const previousGutter = document.documentElement.style.scrollbarGutter
  const { unmount } = render(<RemoveScroll enabled />)

  expect(document.documentElement.style.scrollbarGutter).toBe('stable')
  unmount()
  expect(document.documentElement.style.scrollbarGutter).toBe(previousGutter)
})
