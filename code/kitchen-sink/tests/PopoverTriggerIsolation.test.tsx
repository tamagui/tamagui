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

  test('triggers with disableTriggerOpenSync do not re-render when popover opens', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // get initial render counts for isolated triggers
    const getIsolatedRenderCounts = async () => {
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

    const initialCounts = await getIsolatedRenderCounts()

    // click first trigger to open popover
    await page.getByTestId('isolated-trigger-1').click()

    // wait for popover to open
    const content = page.getByTestId('isolated-popover-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // check render counts after opening
    const afterOpenCounts = await getIsolatedRenderCounts()

    // with disableTriggerOpenSync, triggers should NOT have re-rendered
    // (render counts should stay the same)
    expect(afterOpenCounts.trigger1).toBe(initialCounts.trigger1)
    expect(afterOpenCounts.trigger2).toBe(initialCounts.trigger2)
    expect(afterOpenCounts.trigger3).toBe(initialCounts.trigger3)

    // close the popover
    await page.getByTestId('isolated-close').click()
    await expect(content).not.toBeVisible({ timeout: 5000 })

    // check render counts after closing
    const afterCloseCounts = await getIsolatedRenderCounts()

    // triggers should still not have re-rendered
    expect(afterCloseCounts.trigger1).toBe(initialCounts.trigger1)
    expect(afterCloseCounts.trigger2).toBe(initialCounts.trigger2)
    expect(afterCloseCounts.trigger3).toBe(initialCounts.trigger3)
  })

  test('triggers without disableTriggerOpenSync DO re-render when popover opens', async ({
    page,
  }) => {
    await page.waitForLoadState('networkidle')

    // get initial render counts for normal triggers
    const getNormalRenderCounts = async () => {
      return {
        trigger1: parseRenderCount(
          await page.getByTestId('normal-trigger-1-render-count').textContent()
        ),
        trigger2: parseRenderCount(
          await page.getByTestId('normal-trigger-2-render-count').textContent()
        ),
        trigger3: parseRenderCount(
          await page.getByTestId('normal-trigger-3-render-count').textContent()
        ),
      }
    }

    const initialCounts = await getNormalRenderCounts()

    // click first trigger to open popover
    await page.getByTestId('normal-trigger-1').click()

    // wait for popover to open
    const content = page.getByTestId('normal-popover-content')
    await expect(content).toBeVisible({ timeout: 5000 })

    // check render counts after opening
    const afterOpenCounts = await getNormalRenderCounts()

    // without disableTriggerOpenSync, ALL triggers should have re-rendered
    // (render counts should have increased)
    expect(afterOpenCounts.trigger1).toBeGreaterThan(initialCounts.trigger1)
    expect(afterOpenCounts.trigger2).toBeGreaterThan(initialCounts.trigger2)
    expect(afterOpenCounts.trigger3).toBeGreaterThan(initialCounts.trigger3)
  })
})
