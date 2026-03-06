import { expect, test } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

test.describe('Tooltip multi-trigger rapid hover', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'TooltipMultiTriggerCase',
      type: 'useCase',
    })
    await page.waitForLoadState('networkidle')
  })

  test('rapid sweep: tooltip stays open and tracks final trigger', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover first trigger to open
    await page.locator('#tip-trigger-a').hover()
    await page.waitForTimeout(200)
    await expect(content).toBeVisible({ timeout: 3000 })

    // sweep through triggers with gaps
    const ids = ['a', 'b', 'c']
    for (let i = 0; i < ids.length - 1; i++) {
      const curr = page.locator(`#tip-trigger-${ids[i]}`)
      const next = page.locator(`#tip-trigger-${ids[i + 1]}`)
      const currBox = await curr.boundingBox()
      const nextBox = await next.boundingBox()
      if (currBox && nextBox) {
        // move to gap between triggers
        const gapX =
          currBox.x + currBox.width + (nextBox.x - (currBox.x + currBox.width)) / 2
        const gapY = currBox.y + currBox.height / 2
        await page.mouse.move(gapX, gapY)
        await page.waitForTimeout(30)
        // move to next trigger
        await page.mouse.move(
          nextBox.x + nextBox.width / 2,
          nextBox.y + nextBox.height / 2
        )
        await page.waitForTimeout(20)
      }
    }

    await page.waitForTimeout(200)
    await expect(content).toBeVisible({ timeout: 2000 })

    const label = page.locator('#tip-label')
    await expect(label).toContainText('Third', { timeout: 2000 })
  })

  test('arrow stays centered on tooltip content', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover first trigger
    await page.locator('#tip-trigger-a').hover()
    await page.waitForTimeout(200)
    await expect(content).toBeVisible({ timeout: 3000 })

    // quickly jump to last trigger
    const triggerC = page.locator('#tip-trigger-c')
    const box = await triggerC.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 3,
      })
    }
    await page.waitForTimeout(300)
    await expect(content).toBeVisible({ timeout: 2000 })

    // arrow should be within the horizontal bounds of the content
    const arrowRect = await getBoundingRect(page, '#tip-arrow')
    const contentRect = await getBoundingRect(page, '#tip-content')

    expect(arrowRect).toBeTruthy()
    expect(contentRect).toBeTruthy()

    // arrow center should be within content bounds (not displaced far left/right)
    const arrowCenterX = arrowRect!.x + arrowRect!.width / 2
    expect(arrowCenterX).toBeGreaterThanOrEqual(contentRect!.x)
    expect(arrowCenterX).toBeLessThanOrEqual(contentRect!.x + contentRect!.width)
  })

  test('tooltip closes when cursor leaves all triggers', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover to open
    await page.locator('#tip-trigger-b').hover()
    await page.waitForTimeout(200)
    await expect(content).toBeVisible({ timeout: 3000 })

    // move cursor far away from triggers
    await page.mouse.move(10, 10)
    await page.waitForTimeout(500)

    await expect(content).not.toBeVisible({ timeout: 3000 })
  })
})
