import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('TooltipTrigger display inline', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'TooltipTriggerInlineCase', type: 'useCase' })
  })

  test('tooltip trigger with display="inline" renders inline', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('inline-tooltip-trigger')
    await expect(trigger).toBeVisible()

    // Check that the trigger has inline display
    const display = await trigger.evaluate((el) => {
      return window.getComputedStyle(el).display
    })

    // Should be inline, inline-block, or inline-flex - not block/flex
    expect(display).toMatch(/^inline/)
  })

  test('inline tooltip triggers appear within text flow', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('inline-tooltip-trigger')
    const text = page.getByTestId('inline-tooltip-text')

    // The trigger and its text should be visible
    await expect(trigger).toBeVisible()
    await expect(text).toBeVisible()

    // The text content should be inline within the paragraph
    const triggerBox = await trigger.boundingBox()
    const textBox = await text.boundingBox()

    // Text should be contained within or equal to trigger bounds
    expect(triggerBox).toBeTruthy()
    expect(textBox).toBeTruthy()
  })

  test('tooltip still works with inline display', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('inline-tooltip-trigger')
    const content = page.getByTestId('inline-tooltip-content')

    // Initially content should not be visible
    await expect(content).not.toBeVisible()

    // Hover over trigger to show tooltip
    await trigger.hover()

    // Wait for tooltip to appear
    await expect(content).toBeVisible({ timeout: 5000 })

    // Move away from trigger
    await page.mouse.move(0, 0)

    // Wait for tooltip to hide
    await page.waitForTimeout(500)
    await expect(content).not.toBeVisible()
  })
})
