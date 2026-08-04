import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// regression: withStaticProperties(Tooltip, { Content }) from a lazy-loaded
// module must not swap the shared Tooltip.Content identity. before the fix it
// mutated the shared component, so the next render of an open tooltip
// remounted the content subtree and teleported to the new anchor in a single
// frame (tamagui.dev promo row jump).

const CONTENT_SEL = '[data-popper-animate-position]'

test.describe('Tooltip static clobber (withStaticProperties on shared compound)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // same skip as the sibling shared-tooltip suites: the react-native web
    // driver can't drive the shared-tooltip animatePosition pattern
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'native') {
      test.skip()
    }
    await setupPage(page, { name: 'TooltipStaticClobberCase', type: 'useCase' })
    await page.waitForSelector('[data-testid="clobber-icon-0"]', { timeout: 15000 })
  })

  test('crossing triggers still glides after a module extends Tooltip', async ({
    page,
  }) => {
    const box = async (i: number) => {
      const b = await page.locator(`[data-testid="clobber-icon-${i}"]`).boundingBox()
      if (!b) throw new Error(`icon-${i} not found`)
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
    }

    // open the tooltip on the first icon and let it settle
    const first = await box(0)
    await page.mouse.move(first.x, first.y, { steps: 4 })
    await page.waitForSelector(CONTENT_SEL, { timeout: 5000 })
    await page.waitForTimeout(500)

    // simulate the lazy chunk extending Tooltip while the tooltip stays open
    // (no pointer movement — exactly how a chunk load behaves)
    await page.evaluate(() => (window as any).__clobberTooltip())

    // per-frame recorder: track x and node identity. v3 writes position to the
    // `translate` property, so read that first and only fall back to the
    // transform matrix (same reader as the sibling toolbar-row suite)
    await page.evaluate((sel) => {
      ;(window as any).__rec = []
      let nextId = 1
      const sample = () => {
        const el = document.querySelector(sel) as any
        if (el) {
          if (!el.__recId) el.__recId = nextId++
          const style = getComputedStyle(el)
          const x =
            style.translate !== 'none'
              ? Number.parseFloat(style.translate)
              : style.transform === 'none'
                ? 0
                : new DOMMatrixReadOnly(style.transform).e
          ;(window as any).__rec.push({ x, id: el.__recId })
        }
        requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    }, CONTENT_SEL)

    // cross to the last icon — the render after the clobber previously
    // remounted and teleported
    const last = await box(2)
    const steps = 8
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(first.x + ((last.x - first.x) * i) / steps, first.y)
      await page.waitForTimeout(16)
    }
    await page.waitForTimeout(700)

    const rec = await page.evaluate(
      () => (window as any).__rec as { x: number; id: number }[]
    )
    expect(rec.length).toBeGreaterThan(10)

    // no remount: the same DOM node must survive the crossing
    const ids = new Set(rec.map((r) => r.id))
    expect(ids.size).toBe(1)

    // no teleport: per-frame movement stays animation-sized. same threshold as
    // the sibling toolbar-row suite, which calibrated it against v3's drivers:
    // an animated glide moves tens of px/frame at most, a teleport is 150+
    let maxJump = 0
    for (let i = 1; i < rec.length; i++) {
      maxJump = Math.max(maxJump, Math.abs(rec[i].x - rec[i - 1].x))
    }
    expect(maxJump).toBeLessThan(150)

    // and the tooltip did retarget to the last icon
    const state = await page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement
      const style = getComputedStyle(el)
      const x =
        style.translate !== 'none'
          ? Number.parseFloat(style.translate)
          : style.transform === 'none'
            ? 0
            : new DOMMatrixReadOnly(style.transform).e
      return { center: x + el.offsetWidth / 2, text: el.textContent }
    }, CONTENT_SEL)
    expect(state.text).toContain('Gamma')
    expect(Math.abs(state.center - last.x)).toBeLessThan(4)
  })
})
