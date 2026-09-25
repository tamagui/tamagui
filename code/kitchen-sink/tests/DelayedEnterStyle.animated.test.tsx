import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * DELAYED ENTER STYLE TESTS
 *
 * A delayed enter animation should hold its enterStyle for the whole delay,
 * then animate in. Runs across all animation drivers.
 *
 * Bug: The reanimated driver used to paint the final value during the delay,
 * snap back to enterStyle once it ended, and only then animate in.
 */

async function getOpacity(page: Page, testId: string): Promise<number> {
  return page
    .getByTestId(testId)
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).opacity))
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'DelayedEnterStyleCase', type: 'useCase' })
})

test('delayed enterStyle stays at enterStyle until the delay ends', async ({ page }) => {
  // transition={['quick', { delay: 1000 }]}, enterStyle={{ opacity: 0 }}
  await page.getByTestId('delayed-enter-show').click()

  // halfway through the delay
  await page.waitForTimeout(500)
  const duringDelay = await getOpacity(page, 'delayed-enter-target')
  expect(duringDelay, 'During delay, opacity should be at enterStyle').toBeCloseTo(0, 1)

  // wait for delay + animation to complete
  await page.waitForTimeout(2000)
  const endOpacity = await getOpacity(page, 'delayed-enter-target')
  expect(endOpacity, 'End opacity').toBeCloseTo(1, 1)
})
