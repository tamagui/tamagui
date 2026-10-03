import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { expectNoTeleport, type PositionSample } from './utils'

// the shared-tooltip sweep in TooltipToolbarRow only starves frames when the
// machine running it is already loaded, which is why the reanimated teleport
// (a spring stepped with a negative time delta reached translate
// -33,554,430px) reproduced on CI and never locally. cpu throttling makes the
// starvation deterministic, so the guard holds on a quiet machine too.

const CONTENT_SEL = '[data-popper-animate-position]'
const THROTTLE_RATE = 10

test('tooltip position stays continuous when frames are starved', async ({ page }) => {
  const client = await page.context().newCDPSession(page)
  await setupPage(page, { name: 'TooltipToolbarRowCase', type: 'useCase' })
  await page.waitForSelector('[data-testid="icon-0"]', { timeout: 15000 })

  const iconCenter = async (i: number) => {
    const box = await page.locator(`[data-testid="icon-${i}"]`).boundingBox()
    if (!box) throw new Error(`icon-${i} not found`)
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  }

  const right = await iconCenter(7)
  const left = await iconCenter(0)

  await page.mouse.move(right.x, right.y, { steps: 4 })
  await page.waitForSelector(CONTENT_SEL, { timeout: 5000 })
  await page.waitForTimeout(500)

  await page.evaluate((sel) => {
    ;(window as any).__tips = []
    const sample = (at: number) => {
      const el = document.querySelector(sel) as HTMLElement | null
      if (el) {
        const style = getComputedStyle(el)
        ;(window as any).__tips.push({
          at,
          tx:
            style.translate !== 'none'
              ? Number.parseFloat(style.translate)
              : style.transform === 'none'
                ? 0
                : new DOMMatrixReadOnly(style.transform).e,
        })
      }
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  }, CONTENT_SEL)

  await client.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE_RATE })
  const steps = 24
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(right.x + ((left.x - right.x) * i) / steps, right.y)
    await page.waitForTimeout(12)
  }
  await page.waitForTimeout(800)
  await client.send('Emulation.setCPUThrottlingRate', { rate: 1 })

  const samples = await page.evaluate(() => (window as any).__tips as PositionSample[])

  // the throttle has to have actually starved frames, or this passes for the
  // wrong reason on a fast machine
  const gaps = samples
    .slice(1)
    .map((s, i) => s.at - samples[i].at)
    .filter((gap) => gap > 40)
  expect(gaps.length).toBeGreaterThan(0)

  expectNoTeleport(samples)
})
