import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

async function recordOpenFrames(page: Page) {
  await page.evaluate(() => {
    const frames: number[] = []
    ;(window as any).__firstOpenFrames = frames
    const start = performance.now()
    const track = () => {
      const el = document.querySelector('[data-testid="first-open-content"]')
      if (el) frames.push(parseFloat(getComputedStyle(el).opacity))
      if (performance.now() - start < 600) requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })
  await page.getByTestId('first-open-trigger').click()
  await page.waitForTimeout(700)
  return page.evaluate(() => (window as any).__firstOpenFrames as number[])
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'PopoverFirstOpenEnterCase', type: 'useCase' })
})

test('first popover open animates its enter (#4240)', async ({ page }) => {
  const frames = await recordOpenFrames(page)
  expect(
    frames.filter((f) => f > 0.05 && f < 0.95).length,
    `first open frames: ${JSON.stringify(frames)}`
  ).toBeGreaterThan(2)
})
