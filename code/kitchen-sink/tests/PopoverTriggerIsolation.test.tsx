import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// helper to extract render count from text like "renders: 1"
function parseRenderCount(text: string | null): number {
  if (!text) return 0
  const match = text.match(/renders:\s*(\d+)/)
  return match ? Number(match[1]) : 0
}

test.describe('Popover Trigger Render Isolation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverTriggerIsolationCase', type: 'useCase' })
  })

  test('only the active trigger re-renders when popover opens', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // get initial render counts
    const getRenderCounts = async () => {
      return {
        trigger1: parseRenderCount(
          await page.getByTestId('isolated-trigger-1-render-count').textContent()
        ),
        trigger2: parseRenderCount(
          await page.getByTestId('isolated-trigger-2-render-count').textContent()
        ),
        trigger3: parseRenderCount(
          await page.getByTestId('isolated-trigger-3-render-count').textContent()
        ),
      }
    }

    const initialCounts = await getRenderCounts()

    // click trigger1 to open popover
    await page.getByTestId('isolated-trigger-1').click()

    // wait for popover to open
    const content = page.getByTestId('isolated-popover-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // check render counts after opening
    const afterOpenCounts = await getRenderCounts()

    // trigger1 (active) may re-render to update aria-expanded
    // but trigger2 and trigger3 (inactive) should NOT re-render
    expect(afterOpenCounts.trigger2).toBe(initialCounts.trigger2)
    expect(afterOpenCounts.trigger3).toBe(initialCounts.trigger3)

    // close the popover
    await page.getByTestId('isolated-close').click()
    await expect(content).not.toBeVisible({ timeout: 5000 })

    // check render counts after closing
    const afterCloseCounts = await getRenderCounts()

    // inactive triggers should still not have re-rendered
    expect(afterCloseCounts.trigger2).toBe(initialCounts.trigger2)
    expect(afterCloseCounts.trigger3).toBe(initialCounts.trigger3)
  })
})
