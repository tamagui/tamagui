import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// regression: popover content should appear near its trigger, not fly in
// from the top-left corner. when floating-ui resets isPositioned on close
// but x/y retain stale values, the hide logic must still prevent the
// content from being visible at the wrong position.

// native animation driver has a pre-existing initial position bug
const driverName = process.env.TAMAGUI_TEST_ANIMATION_DRIVER || ''
test.skip(
  driverName === 'native',
  'native driver has pre-existing initial position issue'
)

test.describe('Popover initial position', () => {
  test('hoverable popover appears near trigger, not at top-left', async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
    })

    const content = page.locator('#nav-content')
    const trigger = page.locator('#nav-trigger-about')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    // hover trigger to open
    await trigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible()

    const contentBox = await content.boundingBox()
    expect(contentBox).toBeTruthy()

    // content should be near the trigger, not at the page origin
    // popover is placed below trigger, so content.y should be close to trigger bottom
    const triggerBottom = triggerBox!.y + triggerBox!.height
    expect(contentBox!.y).toBeGreaterThan(triggerBottom - 20)
    expect(contentBox!.y).toBeLessThan(triggerBottom + 100)

    // content x should be in the general area of the trigger, not at 0
    expect(contentBox!.x).toBeGreaterThan(triggerBox!.x - contentBox!.width)
  })

  test('popover does not briefly appear at origin on reopen', async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
    })

    const content = page.locator('#nav-content')
    const trigger = page.locator('#nav-trigger-contact')

    // open
    await trigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible()

    // close fully
    await page.mouse.move(10, 600, { steps: 2 })
    await page.waitForTimeout(800)
    await expect(content).not.toBeVisible()

    // reopen on same trigger and check position EARLY
    await trigger.hover()
    await page.waitForTimeout(100)

    const earlyBox = await content.boundingBox()
    if (earlyBox) {
      const triggerBox = await trigger.boundingBox()
      // if content is visible, it must NOT be at the top-left corner
      // (the fly-from-origin bug shows content starting near 0,0)
      const distFromOrigin = Math.sqrt(earlyBox.x ** 2 + earlyBox.y ** 2)
      const triggerDist = Math.sqrt(
        (earlyBox.x - triggerBox!.x) ** 2 + (earlyBox.y - triggerBox!.y) ** 2
      )
      // content should be closer to trigger than to the page origin
      expect(triggerDist).toBeLessThan(distFromOrigin + 50)
    }
  })
})
