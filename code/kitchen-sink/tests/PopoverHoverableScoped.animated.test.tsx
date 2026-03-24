import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Scoped multi-trigger popover with animatePosition:
 * when switching between triggers, the popover content should smoothly
 * animate its position — NOT snap instantly.
 */
test.describe('Popover hoverable scoped position animation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    // animatePosition works via CSS transitions — only test on css/motion drivers
    if (driver !== 'css' && driver !== 'motion') {
      test.skip()
      return
    }

    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
      searchParams: { animationDriver: driver },
    })
    await page.waitForLoadState('networkidle')
  })

  test('position smoothly animates when switching between triggers', async ({ page }) => {
    const aboutTrigger = page.locator('#nav-trigger-about')
    const contactTrigger = page.locator('#nav-trigger-contact')
    const content = page.locator('#nav-content')

    // hover about to open popover
    await aboutTrigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 3000 })

    // wait for enter animation to settle
    await page.waitForTimeout(600)

    // get initial content X position (anchored near "about")
    const posA = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    // start tracking positions at 60fps
    await page.evaluate(() => {
      ;(window as any).__xPositions = []
      const track = () => {
        const el = document.getElementById('nav-content')
        if (el) {
          const rect = el.getBoundingClientRect()
          ;(window as any).__xPositions.push({
            x: rect.left,
            time: Date.now(),
          })
        }
        ;(window as any).__trackRaf = requestAnimationFrame(track)
      }
      ;(window as any).__trackRaf = requestAnimationFrame(track)
    })

    // switch to contact trigger (rightmost)
    await contactTrigger.hover()

    // wait for the 500ms position transition to complete
    await page.waitForTimeout(700)

    // stop tracking
    await page.evaluate(() => cancelAnimationFrame((window as any).__trackRaf))

    // get final content X position (should be anchored near "contact")
    const posB = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    const positions: { x: number; time: number }[] = await page.evaluate(
      () => (window as any).__xPositions
    )

    // the two positions should be different (contact is to the right of about)
    const xDiff = Math.abs(posB.x - posA.x)
    expect(xDiff).toBeGreaterThan(20)

    // check for intermediate positions: if animatePosition works correctly,
    // we should see X values between posA.x and posB.x during the transition.
    // if it snaps, all positions will be either at posA.x or posB.x.
    const minX = Math.min(posA.x, posB.x)
    const maxX = Math.max(posA.x, posB.x)
    const margin = xDiff * 0.15

    const intermediatePositions = positions.filter((p) => {
      return p.x > minX + margin && p.x < maxX - margin
    })

    expect(
      intermediatePositions.length,
      `Position should animate smoothly between triggers. ` +
        `posA.x=${posA.x.toFixed(1)}, posB.x=${posB.x.toFixed(1)}, ` +
        `found ${intermediatePositions.length} intermediate frames out of ${positions.length} total`
    ).toBeGreaterThan(2)
  })
})
