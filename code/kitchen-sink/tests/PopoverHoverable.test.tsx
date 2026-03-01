import { expect, test } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

// helper: get opacity of element by id
async function getOpacity(page: any, id: string) {
  return page.evaluate(
    (sel: string) => parseFloat(getComputedStyle(document.getElementById(sel)!).opacity),
    id
  )
}

// Bug 1: delay should apply to both enter AND exit
test.describe('Popover hoverable delay', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableDelayCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('delay applies to enter: popover should not open before delay elapses', async ({
    page,
  }) => {
    const trigger = page.locator('#delay-trigger')
    const content = page.locator('#delay-content')

    await expect(content).not.toBeVisible()

    // hover over trigger
    await trigger.hover()

    // check immediately after hover (should NOT be open yet - delay is 400ms)
    await expect(content).not.toBeVisible()

    // wait less than delay - still should not open
    await page.waitForTimeout(200)
    await expect(content).not.toBeVisible()

    // wait full delay time - should now be open
    await page.waitForTimeout(300)
    await expect(content).toBeVisible({ timeout: 3000 })
  })

  test('delay applies to exit: popover should not close before delay elapses', async ({
    page,
  }) => {
    const trigger = page.locator('#delay-trigger')
    const content = page.locator('#delay-content')

    // hover to open (wait for delay)
    await trigger.hover()
    await page.waitForTimeout(600)
    await expect(content).toBeVisible({ timeout: 3000 })

    // move mouse far away (outside safe zone)
    await page.mouse.move(10, 10)

    // should still be visible right after (delay is 400ms)
    await expect(content).toBeVisible()

    // wait less than delay - still should be visible
    await page.waitForTimeout(200)
    await expect(content).toBeVisible()

    // wait for delay to elapse - should now be closing
    await page.waitForTimeout(400)
    await expect(content).not.toBeVisible({ timeout: 2000 })
  })
})

// Bug 2: restMs should only apply to enter (not exit)
test.describe('Popover hoverable restMs', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableRestMsCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('restMs delays enter: popover should open after mouse rests', async ({ page }) => {
    const trigger = page.locator('#restms-trigger')
    const content = page.locator('#restms-content')

    await expect(content).not.toBeVisible()

    // hover over trigger
    await trigger.hover()

    // should not open immediately
    await expect(content).not.toBeVisible()

    // wait for restMs to elapse
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 2000 })
  })

  test('exit without restMs: popover should close quickly after mouse leaves', async ({
    page,
  }) => {
    const trigger = page.locator('#restms-trigger')
    const content = page.locator('#restms-content')

    // open it
    await trigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 2000 })

    // move mouse away - with restMs but no delay, exit should be handled by safePolygon (quick)
    await page.mouse.move(10, 10)

    // exit should happen quickly (no restMs delay on exit, only animation duration ~200ms)
    await expect(content).not.toBeVisible({ timeout: 1000 })
  })
})

// Bug 3: exit animation should play when hoverable closes popover
test.describe('Popover hoverable exit animation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableExitAnimCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('exit animation plays: content should still be visible briefly after mouse leaves', async ({
    page,
  }) => {
    const trigger = page.locator('#exitanim-trigger')
    const content = page.locator('#exitanim-content')

    // hover to open
    await trigger.hover()
    await expect(content).toBeVisible({ timeout: 3000 })

    // wait for enter animation to complete (500ms transition + buffer)
    await page.waitForTimeout(700)

    // confirm fully visible now
    const opacityBefore = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(opacityBefore).toBeGreaterThan(0.9)

    // move mouse far away (outside safe zone) to trigger close
    await page.mouse.move(10, 10)

    // immediately after leaving - content should still be visible (animation in progress)
    // the transition is 500ms so it should still be partially visible
    await page.waitForTimeout(50)

    const opacityDuring = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    // should be animating - opacity should be > 0 (not instantly gone to 0)
    expect(opacityDuring).toBeGreaterThan(0)

    // wait for animation to complete (500ms + buffer)
    await page.waitForTimeout(600)
    await expect(content).not.toBeVisible({ timeout: 2000 })
  })
})

// Bug: scoped multi-trigger hoverable - mimics WebsiteHeader.tsx pattern
// uses CSS driver since animatePosition needs a driver that supports classNames
test.describe('Popover hoverable scoped multi-trigger', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
    await page.waitForLoadState('networkidle')
  })

  test('scoped: delay applies to enter - should not open immediately', async ({
    page,
  }) => {
    const trigger = page.locator('#nav-trigger-about')
    const content = page.locator('#nav-content')

    await trigger.hover()

    // should NOT be open right away (300ms delay)
    await expect(content).not.toBeVisible()

    // wait for delay
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })
  })

  test('scoped: exit animation plays when hovering away', async ({ page }) => {
    const trigger = page.locator('#nav-trigger-about')
    const content = page.locator('#nav-content')

    // open it
    await trigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })

    // wait for enter animation to finish (500ms transition)
    await page.waitForTimeout(700)

    // verify content is correctly positioned below trigger (not stuck at y=0)
    const triggerRect = await getBoundingRect(page, '#nav-trigger-about')
    const contentRect = await getBoundingRect(page, '#nav-content')

    expect(contentRect!.y).toBeGreaterThan(triggerRect!.y)

    const opacityBefore = await getOpacity(page, 'nav-content')
    expect(opacityBefore).toBeGreaterThan(0.9)

    // move far away to trigger close
    await page.mouse.move(10, 10)

    // check opacity shortly after - should still be > 0 (animating out with 500ms transition)
    await page.waitForTimeout(50)
    const opacityDuring = await getOpacity(page, 'nav-content')
    expect(opacityDuring).toBeGreaterThan(0)

    // wait for animation to complete (500ms + buffer)
    await page.waitForTimeout(600)
    await expect(content).not.toBeVisible({ timeout: 2000 })
  })

  test('scoped: switching between triggers keeps popover open', async ({ page }) => {
    const aboutTrigger = page.locator('#nav-trigger-about')
    const blogTrigger = page.locator('#nav-trigger-blog')
    const content = page.locator('#nav-content')

    // open about
    await aboutTrigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })

    // switch to blog trigger - popover should stay open
    await blogTrigger.hover()
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()
  })
})
