import { afterEach, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

test('retains the largest viewport without measuring layout on each sheet render', async () => {
  const viewport = Object.assign(new EventTarget(), { height: 700 })
  const browser = Object.assign(new EventTarget(), {
    innerHeight: 700,
    visualViewport: viewport,
    screen: { height: 852 },
  })
  const readLayoutHeight = vi.fn(() => browser.innerHeight)
  vi.stubGlobal('window', browser)
  vi.stubGlobal('document', {
    documentElement: {
      get clientHeight() {
        return readLayoutHeight()
      },
    },
  })
  const { getMaxViewportHeight } = await import('../sheet/src/webViewport')

  expect(getMaxViewportHeight()).toBe(852)
  readLayoutHeight.mockClear()
  expect(getMaxViewportHeight()).toBe(852)
  expect(getMaxViewportHeight()).toBe(852)
  expect(readLayoutHeight).not.toHaveBeenCalled()

  // a taller window must update the close target before another sheet opens.
  browser.innerHeight = 1000
  browser.dispatchEvent(new Event('resize'))
  expect(getMaxViewportHeight()).toBe(1000)

  // keyboard and browser chrome changes must never shrink that target.
  browser.innerHeight = 500
  viewport.height = 400
  viewport.dispatchEvent(new Event('resize'))
  expect(getMaxViewportHeight()).toBe(1000)

  // visual viewport growth is also a source of the high-water mark.
  viewport.height = 1100
  viewport.dispatchEvent(new Event('resize'))
  expect(getMaxViewportHeight()).toBe(1100)
})

test('the visible viewport follows the larger of layout and inner height without reading layout', async () => {
  const viewport = Object.assign(new EventTarget(), { height: 735 })
  const browser = Object.assign(new EventTarget(), {
    innerHeight: 695,
    visualViewport: viewport,
    screen: { height: 852 },
  })
  let layoutHeight = 695
  const readLayoutHeight = vi.fn(() => layoutHeight)
  vi.stubGlobal('window', browser)
  vi.stubGlobal('document', {
    documentElement: {
      get clientHeight() {
        return readLayoutHeight()
      },
    },
  })
  const { getVisibleViewportHeight } = await import('../sheet/src/webViewport')

  expect(getVisibleViewportHeight()).toBe(695)

  // iOS Safari: collapsing the toolbar grows innerHeight but leaves clientHeight.
  browser.innerHeight = 735
  browser.dispatchEvent(new Event('resize'))
  readLayoutHeight.mockClear()
  expect(getVisibleViewportHeight()).toBe(735)
  expect(readLayoutHeight).not.toHaveBeenCalled()

  // the keyboard shrinks innerHeight but not the layout viewport.
  browser.innerHeight = 400
  browser.dispatchEvent(new Event('resize'))
  expect(getVisibleViewportHeight()).toBe(695)

  // and the visible viewport can shrink again (unlike the high-water mark).
  layoutHeight = 600
  browser.innerHeight = 600
  browser.dispatchEvent(new Event('resize'))
  expect(getVisibleViewportHeight()).toBe(600)
})
