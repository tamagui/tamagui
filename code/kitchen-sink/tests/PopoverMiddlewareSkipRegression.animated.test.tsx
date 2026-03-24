import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for: skipping middleware when closed causes position/arrow
 * glitches on reopen. When middleware is set to [] while closed, computePosition
 * runs without offset/arrow/transformOrigin, producing wrong cached position.
 * On reopen, the animation starts from that wrong position.
 */
test.describe('Popover middleware skip regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
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

  test('position is stable across close/reopen cycles at same trigger', async ({
    page,
  }) => {
    const about = page.locator('#nav-trigger-about')
    const content = page.locator('#nav-content')

    // open at "about"
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    // record settled position
    const pos1 = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top }
    })

    // close
    await page.mouse.move(0, 0)
    await page.waitForTimeout(600)

    // reopen at same trigger
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    // record settled position again
    const pos2 = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top }
    })

    // positions should match (same trigger, same content)
    expect(
      Math.abs(pos2.x - pos1.x),
      `X position shifted by ${(pos2.x - pos1.x).toFixed(1)}px after close/reopen`
    ).toBeLessThan(2)
    expect(
      Math.abs(pos2.y - pos1.y),
      `Y position shifted by ${(pos2.y - pos1.y).toFixed(1)}px after close/reopen`
    ).toBeLessThan(2)
  })

  test('reopen animation starts near final position, not from origin', async ({
    page,
  }) => {
    const about = page.locator('#nav-trigger-about')
    const content = page.locator('#nav-content')

    // first open to establish position
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    const settledPos = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top }
    })

    // close
    await page.mouse.move(0, 0)
    await page.waitForTimeout(600)

    // start tracking positions immediately, then reopen
    await page.evaluate(() => {
      ;(window as any).__reopenPositions = []
      ;(window as any).__trackReopen = true
      const track = () => {
        if (!(window as any).__trackReopen) return
        const el = document.getElementById('nav-content')
        if (el) {
          const style = window.getComputedStyle(el)
          if (parseFloat(style.opacity) > 0.05) {
            const r = el.getBoundingClientRect()
            ;(window as any).__reopenPositions.push({
              x: r.left,
              y: r.top,
              opacity: style.opacity,
              time: Date.now(),
            })
          }
        }
        requestAnimationFrame(track)
      }
      requestAnimationFrame(track)
    })

    // reopen
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    await page.evaluate(() => {
      ;(window as any).__trackReopen = false
    })

    const positions: { x: number; y: number; opacity: string; time: number }[] =
      await page.evaluate(() => (window as any).__reopenPositions)

    if (positions.length === 0) return

    // the FIRST visible frame should be near the settled position, not at (0,0)
    // or some other wrong location caused by missing middleware
    const firstFrame = positions[0]
    const distFromSettled = Math.sqrt(
      (firstFrame.x - settledPos.x) ** 2 + (firstFrame.y - settledPos.y) ** 2
    )

    // allow up to 50px for enter animation movement (enterStyle y: -6)
    // but reject positions that are hundreds of pixels away (middleware bug)
    expect(
      distFromSettled,
      `First visible frame at (${firstFrame.x.toFixed(0)}, ${firstFrame.y.toFixed(0)}) ` +
        `is ${distFromSettled.toFixed(0)}px from settled position ` +
        `(${settledPos.x.toFixed(0)}, ${settledPos.y.toFixed(0)})`
    ).toBeLessThan(50)
  })

  test('switching triggers: no position jump on entry', async ({ page }) => {
    const about = page.locator('#nav-trigger-about')
    const contact = page.locator('#nav-trigger-contact')
    const content = page.locator('#nav-content')

    // open on about first
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    // close
    await page.mouse.move(0, 0)
    await page.waitForTimeout(600)

    // track positions during reopen at contact
    await page.evaluate(() => {
      ;(window as any).__switchPositions = []
      ;(window as any).__trackSwitch = true
      const track = () => {
        if (!(window as any).__trackSwitch) return
        const el = document.getElementById('nav-content')
        if (el) {
          const style = window.getComputedStyle(el)
          if (parseFloat(style.opacity) > 0.05) {
            const r = el.getBoundingClientRect()
            ;(window as any).__switchPositions.push({
              x: r.left,
              y: r.top,
              time: Date.now(),
            })
          }
        }
        requestAnimationFrame(track)
      }
      requestAnimationFrame(track)
    })

    // open on contact
    await contact.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(700)

    await page.evaluate(() => {
      ;(window as any).__trackSwitch = false
    })

    const contactPos = await content.evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top }
    })

    const positions: { x: number; y: number; time: number }[] = await page.evaluate(
      () => (window as any).__switchPositions
    )

    if (positions.length < 3) return

    // check that no frame during entry is wildly far from final position
    // (would indicate middleware was missing during position computation)
    const wildFrames = positions.filter((p) => {
      const dist = Math.sqrt((p.x - contactPos.x) ** 2 + (p.y - contactPos.y) ** 2)
      return dist > 100 // more than 100px from where it should end up
    })

    expect(
      wildFrames.length,
      `${wildFrames.length} frames were >100px from final position. ` +
        `First wild frame: (${wildFrames[0]?.x.toFixed(0)}, ${wildFrames[0]?.y.toFixed(0)}), ` +
        `final: (${contactPos.x.toFixed(0)}, ${contactPos.y.toFixed(0)})`
    ).toBe(0)
  })
})
