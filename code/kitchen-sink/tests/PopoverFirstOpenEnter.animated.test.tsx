import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

async function recordOpenFrames(page: Page) {
  await page.evaluate(() => {
    const frames: number[] = []
    ;(window as any).__firstOpenFrames = frames
    const track = () => {
      const el = document.querySelector('[data-testid="first-open-content"]')
      if (el) {
        const opacity = parseFloat(getComputedStyle(el).opacity)
        frames.push(opacity)
        if (opacity >= 0.98) {
          ;(window as any).__firstOpenComplete = true
          return
        }
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })
  await page.getByTestId('first-open-trigger').click()
  await page.waitForFunction(() => (window as any).__firstOpenComplete === true)
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
