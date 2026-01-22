import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * TOOLTIP POSITION JUMP TEST (Motion Driver Only)
 *
 * Bug: Grouped tooltips occasionally jump to (0,0) before moving to correct position.
 * Root cause: Motion driver captured x/y from 0 before floating-ui calculated position.
 * Fix: Don't pass x/y props when position hasn't been calculated yet (hide=true).
 */

async function getTooltipPosition(page: Page, testId: string) {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`) as HTMLElement
    if (!el) return { x: -1, y: -1, exists: false }
    const rect = el.getBoundingClientRect()
    return { x: rect.left, y: rect.top, exists: true }
  }, testId)
}

test.describe('Tooltip Position Jump', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // only test with motion driver - this is where the bug manifested
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'motion') {
      test.skip()
      return
    }

    await setupPage(page, { name: 'TooltipPositionJumpCase', type: 'useCase' })
    await page.waitForTimeout(500)
  })

  test('grouped tooltips should not jump to origin during hover transitions', async ({ page }) => {
    const triggers = [
      page.getByTestId('tooltip-jump-trigger-1'),
      page.getByTestId('tooltip-jump-trigger-2'),
      page.getByTestId('tooltip-jump-trigger-3'),
      page.getByTestId('tooltip-jump-trigger-4'),
    ]

    // hover between all 4 triggers multiple times with varied timing
    for (let round = 0; round < 10; round++) {
      const delay = 30 + Math.random() * 70
      for (const trigger of triggers) {
        await trigger.hover()
        await page.waitForTimeout(delay)
      }
      for (const trigger of [...triggers].reverse()) {
        await trigger.hover()
        await page.waitForTimeout(delay)
      }
    }

    // the UI has its own jump detector - check its count
    const jumpCount = await page.getByTestId('jump-count').textContent()
    const jumps = parseInt(jumpCount || '0')

    console.log(`Detected ${jumps} position jumps`)

    expect(jumps, 'Should not have position jumps to origin').toBe(0)
  })

  test('tooltip position should not be near origin after hover', async ({ page }) => {
    const trigger = page.getByTestId('tooltip-jump-trigger-2')

    // rapidly hover on/off to stress test
    for (let i = 0; i < 20; i++) {
      await trigger.hover()
      await page.waitForTimeout(20 + Math.random() * 50)
      await page.mouse.move(10, 10)
      await page.waitForTimeout(30)
    }

    // hover and check final position
    await trigger.hover()
    await page.waitForTimeout(300)

    const pos = await getTooltipPosition(page, 'tooltip-jump-content-2')

    if (pos.exists) {
      // position should be reasonable (not at origin)
      expect(pos.x, 'X should not be near origin').toBeGreaterThan(50)
      expect(pos.y, 'Y should not be near origin').toBeGreaterThan(50)
    }
  })
})
