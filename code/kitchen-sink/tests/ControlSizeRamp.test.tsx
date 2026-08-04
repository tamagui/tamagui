import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * A control must be tall enough to hold its own text, at every size it offers.
 *
 * Nothing checked this before, which is how `<Button size="3">` shipped as a
 * 12px-tall frame around 16px text: v6's size scale is a spacing scale, and
 * reading a frame height straight off it produced controls smaller than their
 * own line box. Frame heights now come from the control ramp in
 * `@tamagui/size`, and this suite is the thing that keeps them there.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ControlSizeRampCase', type: 'useCase' })
})

type Measured = { frame: number; text: number } | null

// a frame's border box against the tallest text box inside it. an <input> holds
// no text node, so its own line box is the thing that has to fit.
function measure(page: Page, testid: string): Promise<Measured> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return null
    const frame = el.getBoundingClientRect().height
    const style = getComputedStyle(el)
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const lh = Number.parseFloat(style.lineHeight)
      const text = Number.isFinite(lh)
        ? lh
        : Number.parseFloat(style.fontSize) * 1.2
      return { frame, text }
    }
    let text = 0
    for (const node of Array.from(el.querySelectorAll('*'))) {
      if (node.children.length === 0 && node.textContent?.trim()) {
        text = Math.max(text, node.getBoundingClientRect().height)
      }
    }
    return { frame, text: text || frame }
  }, testid)
}

// read the rendered steps rather than duplicating the ramp, so adding a step in
// @tamagui/size automatically extends this suite
function renderedSteps(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid^="ramp-button-"]'), (el) =>
      (el.getAttribute('data-testid') || '').replace('ramp-button-', '')
    ).filter((s) => s && s !== 'default')
  )
}

test('every control ramp step fits its own text', async ({ page }) => {
  const steps = await renderedSteps(page)
  expect(steps.length).toBeGreaterThan(5)

  const tooShort: string[] = []
  for (const step of ['default', ...steps]) {
    for (const kind of ['button', 'input']) {
      const m = await measure(page, `ramp-${kind}-${step}`)
      expect(m, `${kind} ${step} should render`).not.toBeNull()
      if (m!.frame + 0.5 < m!.text) {
        tooShort.push(
          `${kind} size=${step}: frame ${m!.frame.toFixed(1)}px < text ${m!.text.toFixed(1)}px`
        )
      }
    }
  }

  expect(
    tooShort,
    `controls shorter than their own text:\n${tooShort.join('\n')}`
  ).toEqual([])
})

test('the unsized default matches the ramp true step', async ({ page }) => {
  // `true` is the `4` step; if these diverge the default has grown a special
  // case again, which is exactly what the ramp replaced
  const def = await measure(page, 'ramp-button-default')
  const four = await measure(page, 'ramp-button-4')
  expect(def!.frame).toBeCloseTo(four!.frame, 0)
  expect(def!.frame).toBeCloseTo(44, 0)
})

test('control heights increase with the ramp and reproduce v2 values', async ({
  page,
}) => {
  const heights: number[] = []
  for (const step of ['1', '2', '3', '4', '5', '6']) {
    const m = await measure(page, `ramp-button-${step}`)
    expect(m, `step ${step} should render`).not.toBeNull()
    heights.push(m!.frame)
  }
  for (let i = 1; i < heights.length; i++) {
    expect(heights[i], `step ${i + 1} taller than step ${i}`).toBeGreaterThan(
      heights[i - 1]
    )
  }
  // the v2 size token values the ramp replicates
  expect(heights[0]).toBeCloseTo(20, 0)
  expect(heights[3]).toBeCloseTo(44, 0)
  expect(heights[4]).toBeCloseTo(52, 0)
})

test('geometry stays on the spacing scale, not the control ramp', async ({ page }) => {
  // the ramp is for controls only. a Square is a length, so size="5" is the
  // config's spacing token (20px), never the ramp's 52px.
  const five = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="ramp-square-5"]')!
    const r = el.getBoundingClientRect()
    return { w: r.width, h: r.height }
  })
  expect(five.w).toBeCloseTo(20, 0)
  expect(five.h).toBeCloseTo(20, 0)

  const three = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="ramp-square-3"]')!
    return el.getBoundingClientRect().width
  })
  expect(three).toBeCloseTo(12, 0)
})
