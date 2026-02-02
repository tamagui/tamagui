import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * TooltipGroup Tests
 *
 * TooltipGroup enables grouped delay behavior:
 * - First tooltip in group: waits for full delay
 * - Subsequent tooltips: show immediately while within the group's timeout window
 *
 * This is implemented via FloatingDelayGroup from @floating-ui/react.
 */

async function tooltipVisible(page: Page, testId: string): Promise<boolean> {
  return page.evaluate((id) => !!document.querySelector(`[data-testid="${id}"]`), testId)
}

test.describe('TooltipGroup', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'TooltipGroupCase', type: 'useCase' })
  })

  test('subsequent grouped tooltips skip delay', async ({ page }) => {
    // Config: 1000ms open delay, 500ms timeout
    const DELAY = 1000

    // Show first tooltip (with delay)
    await page.getByTestId('tooltip-trigger-1').hover()
    await page.waitForTimeout(DELAY + 200)
    expect(await tooltipVisible(page, 'tooltip-content-1')).toBe(true)

    // Move to second tooltip - should appear quickly (no full delay)
    await page.getByTestId('tooltip-trigger-2').hover()
    await page.waitForTimeout(300)

    expect(
      await tooltipVisible(page, 'tooltip-content-2'),
      'Second grouped tooltip should appear without waiting for full delay'
    ).toBe(true)
  })

  test('first grouped tooltip respects delay', async ({ page }) => {
    const DELAY = 1000

    await page.getByTestId('tooltip-trigger-1').hover()

    // Should NOT appear before delay
    await page.waitForTimeout(200)
    expect(
      await tooltipVisible(page, 'tooltip-content-1'),
      'Should not appear before delay'
    ).toBe(false)

    // Should appear after delay
    await page.waitForTimeout(DELAY)
    expect(
      await tooltipVisible(page, 'tooltip-content-1'),
      'Should appear after delay'
    ).toBe(true)
  })

  test('standalone tooltips always have delay', async ({ page }) => {
    const DELAY = 1000

    // Show standalone A
    await page.getByTestId('tooltip-trigger-standalone-a').hover()
    await page.waitForTimeout(DELAY + 200)
    expect(await tooltipVisible(page, 'tooltip-content-standalone-a')).toBe(true)

    // Move to standalone B - should NOT appear quickly (has its own delay)
    await page.getByTestId('tooltip-trigger-standalone-b').hover()
    await page.waitForTimeout(300)

    expect(
      await tooltipVisible(page, 'tooltip-content-standalone-b'),
      'Standalone tooltips should always wait for their delay'
    ).toBe(false)
  })
})
