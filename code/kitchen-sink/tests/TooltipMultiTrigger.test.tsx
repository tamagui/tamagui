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
    await expect(label).toContainText('Expert', { timeout: 2000 })
  })

  test('arrow stays aligned with hovered trigger after switch', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover first trigger to open
    await page.locator('#tip-trigger-a').hover()
    await page.waitForTimeout(200)
    await expect(content).toBeVisible({ timeout: 3000 })

    // verify arrow is near trigger A
    const arrowA = await getBoundingRect(page, '#tip-arrow')
    const triggerARect = await getBoundingRect(page, '#tip-trigger-a')
    expect(arrowA).toBeTruthy()
    const arrowACX = arrowA!.x + arrowA!.width / 2
    const triggerACX = triggerARect!.x + triggerARect!.width / 2
    // arrow should be within 30px of trigger center
    expect(Math.abs(arrowACX - triggerACX)).toBeLessThan(30)

    // quickly jump to trigger C (2 steps = very fast mouse move)
    const triggerC = page.locator('#tip-trigger-c')
    const cBox = await triggerC.boundingBox()
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 2,
    })

    // wait for position to settle (animatePosition transition)
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 2000 })

    // arrow should now be near trigger C, not still near trigger A
    const arrowC = await getBoundingRect(page, '#tip-arrow')
    const triggerCRect = await getBoundingRect(page, '#tip-trigger-c')
    const contentRect = await getBoundingRect(page, '#tip-content')
    expect(arrowC).toBeTruthy()
    expect(contentRect).toBeTruthy()

    const arrowCCX = arrowC!.x + arrowC!.width / 2
    const triggerCCX = triggerCRect!.x + triggerCRect!.width / 2
    const contentCCX = contentRect!.x + contentRect!.width / 2

    // arrow center should be within content bounds
    expect(arrowCCX).toBeGreaterThanOrEqual(contentRect!.x)
    expect(arrowCCX).toBeLessThanOrEqual(contentRect!.x + contentRect!.width)

    // arrow should be reasonably near trigger C (not still at A)
    // with offset=20 and animatePosition, arrow should track the trigger
    expect(
      Math.abs(arrowCCX - triggerCCX),
      `arrow center (${arrowCCX}) should be near trigger C center (${triggerCCX}), content center at ${contentCCX}`
    ).toBeLessThan(40)
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
