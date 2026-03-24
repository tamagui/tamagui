import { expect, test } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

// bug: rapidly sweeping across many side-by-side hoverable triggers with short
// restMs can cause the popover to get "stuck" on a past trigger or close
// unexpectedly. the root cause is a race between safePolygon closing during the
// gap between triggers and stale openRef preventing re-open.

test.describe('Popover hoverable rapid trigger switching', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableRapidCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
    await page.waitForLoadState('networkidle')
  })

  test('rapid sweep: popover stays open and tracks final trigger', async ({ page }) => {
    const content = page.locator('#rapid-content')

    // hover first trigger to open
    const triggerA = page.locator('#rapid-trigger-a')
    await triggerA.hover()
    await page.waitForTimeout(150) // restMs is 60ms + buffer
    await expect(content).toBeVisible({ timeout: 2000 })

    // move through gaps between triggers to expose the race condition:
    // when the mouse is in the gap, onTriggerRef is false and safePolygon
    // can fire a close. then when entering the next trigger, stale openRef
    // prevents re-open.
    const ids = ['a', 'b', 'c', 'd', 'e', 'f']
    for (let i = 0; i < ids.length - 1; i++) {
      const curr = page.locator(`#rapid-trigger-${ids[i]}`)
      const next = page.locator(`#rapid-trigger-${ids[i + 1]}`)
      const currBox = await curr.boundingBox()
      const nextBox = await next.boundingBox()
      if (currBox && nextBox) {
        // move to the gap between current and next trigger
        const gapX =
          currBox.x + currBox.width + (nextBox.x - (currBox.x + currBox.width)) / 2
        const gapY = currBox.y + currBox.height / 2
        await page.mouse.move(gapX, gapY)
        // wait in the gap for safePolygon's document mousemove handler to fire
        // the mouse is now between triggers (onTriggerRef is false)
        await page.waitForTimeout(30)
        // now move to the next trigger
        await page.mouse.move(
          nextBox.x + nextBox.width / 2,
          nextBox.y + nextBox.height / 2
        )
        await page.waitForTimeout(20)
      }
    }

    // rest on the final trigger
    await page.waitForTimeout(200)

    // popover should still be visible (not closed/stuck)
    await expect(content).toBeVisible({ timeout: 2000 })

    // the panel label should show the final trigger
    const label = page.locator('#rapid-panel-label')
    await expect(label).toHaveText('Panel F', { timeout: 2000 })
  })

  test('rapid back-and-forth: popover stays open', async ({ page }) => {
    const content = page.locator('#rapid-content')

    // open on trigger c
    const triggerC = page.locator('#rapid-trigger-c')
    await triggerC.hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible({ timeout: 2000 })

    // sweep back and forth quickly with abrupt jumps
    const sweep = ['d', 'e', 'f', 'e', 'd', 'c', 'b', 'a', 'b', 'c', 'd', 'e', 'f']
    for (const id of sweep) {
      const trigger = page.locator(`#rapid-trigger-${id}`)
      const box = await trigger.boundingBox()
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
          steps: 1,
        })
      }
      await page.waitForTimeout(5)
    }

    await page.waitForTimeout(200)

    // should still be open and tracking final trigger
    await expect(content).toBeVisible({ timeout: 2000 })
    const label = page.locator('#rapid-panel-label')
    await expect(label).toHaveText('Panel F', { timeout: 2000 })
  })

  test('rapid sweep then rest: content positioned near final trigger', async ({
    page,
  }) => {
    const content = page.locator('#rapid-content')

    // open on first trigger
    await page.locator('#rapid-trigger-a').hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible({ timeout: 2000 })

    // quickly move to last trigger
    const triggerF = page.locator('#rapid-trigger-f')
    const box = await triggerF.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
        steps: 3,
      })
    }
    await page.waitForTimeout(200)

    await expect(content).toBeVisible({ timeout: 2000 })

    // content should be near trigger F, not stuck at trigger A
    const triggerFRect = await getBoundingRect(page, '#rapid-trigger-f')
    const triggerARect = await getBoundingRect(page, '#rapid-trigger-a')
    const contentRect = await getBoundingRect(page, '#rapid-content')

    // content x should be closer to trigger F than to trigger A
    const distToF = Math.abs(contentRect!.x - triggerFRect!.x)
    const distToA = Math.abs(contentRect!.x - triggerARect!.x)
    expect(distToF).toBeLessThan(distToA)
  })
})
