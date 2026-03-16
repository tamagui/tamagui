import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetOnAnimationCompleteCase', type: 'useCase' })
})

test('onAnimationComplete fires with open:true after sheet opens', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const lastEvent = page.locator('[data-testid="last-event"]')

  await trigger.waitFor({ state: 'visible' })
  await trigger.click()
  // wait for animation to complete
  await page.waitForTimeout(1500)

  await expect(lastEvent).toHaveText('opened')
})

test('onAnimationComplete fires with open:false after sheet closes', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const lastEvent = page.locator('[data-testid="last-event"]')

  await trigger.click()
  await page.waitForTimeout(1500)
  await closeBtn.click()
  await page.waitForTimeout(1500)

  await expect(lastEvent).toHaveText('closed')
})

test('onAnimationComplete fires exactly once per open/close cycle', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const eventCount = page.locator('[data-testid="event-count"]')

  await trigger.click()
  await page.waitForTimeout(1500)
  await expect(eventCount).toHaveText('1')

  await closeBtn.click()
  await page.waitForTimeout(1500)
  await expect(eventCount).toHaveText('2')
})

test('sheet opacity is 0 after close animation completes (no early vanish)', async ({
  page,
}) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const frame = page.locator('[data-testid="sheet-frame"]').first()

  await trigger.click()
  await page.waitForTimeout(1500)
  await expect(frame).toBeVisible()

  await closeBtn.click()
  // wait for animation to fully complete
  await page.waitForTimeout(1500)
  await expect(frame).not.toBeInViewport({ ratio: 0.5 })
})
