import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Named sizes: a control is line-height plus padding tall, never a height
 * token. So at every size the frame fits its own text, the sized controls
 * agree on a height, and the icon is the size's icon px.
 */

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

// the v6 recipe: text line-height + 2 * paddingY + 2px of border
const EXPECTED_HEIGHT = { xs: 26, sm: 34, md: 38, lg: 42, xl: 50 } as const
const EXPECTED_ICON = { xs: 12, sm: 16, md: 16, lg: 16, xl: 20 } as const

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ControlSizesCase', type: 'useCase' })
})

function box(page: Page, testid: string) {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { width: r.width, height: r.height }
  }, testid)
}

// the frame's border box against the tallest text box inside it. an <input>
// holds no text node, so its own line box is the thing that has to fit.
function measureText(page: Page, testid: string) {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return null
    const frame = el.getBoundingClientRect().height
    const style = getComputedStyle(el)
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const lh = Number.parseFloat(style.lineHeight)
      const text = Number.isFinite(lh) ? lh : Number.parseFloat(style.fontSize) * 1.2
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

test('every sized control fits its own text at every size', async ({ page }) => {
  const tooShort: string[] = []
  for (const size of ['default', ...SIZES]) {
    for (const kind of ['button', 'input', 'select', 'tab', 'label', 'listitem']) {
      const m = await measureText(page, `sizes-${kind}-${size}`)
      expect(m, `${kind} ${size} should render`).not.toBeNull()
      if (m!.frame + 0.5 < m!.text) {
        tooShort.push(`${kind} size=${size}: frame ${m!.frame} < text ${m!.text}`)
      }
    }
  }
  expect(
    tooShort,
    `controls shorter than their own text:\n${tooShort.join('\n')}`
  ).toEqual([])
})

test('button, input, select and toggle share a height at each size', async ({ page }) => {
  for (const size of SIZES) {
    const button = await box(page, `sizes-button-${size}`)
    expect(button!.height, `button ${size}`).toBeCloseTo(EXPECTED_HEIGHT[size], 0)
    for (const kind of ['input', 'select', 'toggle']) {
      const m = await box(page, `sizes-${kind}-${size}`)
      expect(m!.height, `${kind} ${size} matches button`).toBeCloseTo(button!.height, 0)
    }
    const toggle = await box(page, `sizes-toggle-${size}`)
    expect(toggle!.width, `toggle ${size} is square`).toBeCloseTo(toggle!.height, 0)
  }
})

test('the unsized default is md', async ({ page }) => {
  const def = await box(page, 'sizes-button-default')
  const md = await box(page, 'sizes-button-md')
  expect(def!.height).toBeCloseTo(md!.height, 0)
})

test('icons, checkboxes and radios are the size icon px', async ({ page }) => {
  for (const size of SIZES) {
    const icon = await page.evaluate((id) => {
      const svg = document.querySelector(`[data-testid="${id}"] svg`)
      return svg ? svg.getBoundingClientRect().width : null
    }, `sizes-button-${size}`)
    expect(icon, `button ${size} icon`).toBeCloseTo(EXPECTED_ICON[size], 0)
    const checkbox = await box(page, `sizes-checkbox-${size}`)
    expect(checkbox!.width, `checkbox ${size}`).toBeCloseTo(EXPECTED_ICON[size], 0)
    const radio = await box(page, `sizes-radio-${size}`)
    expect(radio!.width, `radio ${size}`).toBeCloseTo(EXPECTED_ICON[size], 0)
  }
})

test('a token key stays on the config scales', async ({ page }) => {
  // v6 size token 4 is 16px, the same as a Square: no ramp rewrites it
  const token = await box(page, 'sizes-button-token-4')
  expect(token!.height).toBeGreaterThanOrEqual(16)
  const square = await box(page, 'sizes-square-5')
  expect(square!.width).toBeCloseTo(20, 0)
  // a named size on a shape is that size's control height
  const squareMd = await box(page, 'sizes-square-md')
  expect(squareMd!.width).toBeCloseTo(36, 0)
})
