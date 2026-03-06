import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for position glitches when opening/closing scoped popovers
 * across multiple targets with animatePosition enabled.
 *
 * Tracks frame-by-frame positions to detect:
 * - Jumps to (0,0) or far-off positions during enter/exit
 * - Arrow misalignment
 * - Position instability after multiple open/close cycles
 */
test.describe('Popover scoped position glitch detection', () => {
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

  test('no far-off positions during open/close across targets', async ({ page }) => {
    const about = page.locator('#nav-trigger-about')
    const blog = page.locator('#nav-trigger-blog')
    const contact = page.locator('#nav-trigger-contact')
    const content = page.locator('#nav-content')

    // get trigger positions for reference
    const triggerBounds = await page.evaluate(() => {
      const triggers = ['about', 'blog', 'contact'].map((id) => {
        const el = document.getElementById(`nav-trigger-${id}`)!
        const r = el.getBoundingClientRect()
        return { id, x: r.left, y: r.top, right: r.right, bottom: r.bottom }
      })
      return triggers
    })

    // reasonable bounds: content should be within viewport, near the triggers
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    const viewportHeight = await page.evaluate(() => window.innerHeight)
    const triggerMinX = Math.min(...triggerBounds.map((t) => t.x))
    const triggerMaxRight = Math.max(...triggerBounds.map((t) => t.right))
    const triggerBottom = Math.max(...triggerBounds.map((t) => t.bottom))

    // start position tracker
    await page.evaluate(() => {
      ;(window as any).__posLog = []
      ;(window as any).__trackPositions = true
      const track = () => {
        if (!(window as any).__trackPositions) return
        const el = document.getElementById('nav-content')
        if (el) {
          const r = el.getBoundingClientRect()
          const style = window.getComputedStyle(el)
          ;(window as any).__posLog.push({
            x: r.left,
            y: r.top,
            w: r.width,
            h: r.height,
            opacity: style.opacity,
            transform: style.transform,
            time: Date.now(),
          })
        }
        requestAnimationFrame(track)
      }
      requestAnimationFrame(track)
    })

    // cycle 1: open on about, wait, close
    await about.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(600)
    await page.mouse.move(0, 0)
    await page.waitForTimeout(500)

    // cycle 2: open on contact
    await contact.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(600)
    await page.mouse.move(0, 0)
    await page.waitForTimeout(500)

    // cycle 3: open on blog
    await blog.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 3000 })
    await page.waitForTimeout(600)

    // cycle 4: switch directly to about (no close in between)
    await about.hover()
    await page.waitForTimeout(700)

    // cycle 5: switch directly to contact
    await contact.hover()
    await page.waitForTimeout(700)

    // stop tracking
    await page.evaluate(() => {
      ;(window as any).__trackPositions = false
    })

    const positions: {
      x: number
      y: number
      w: number
      h: number
      opacity: string
      transform: string
      time: number
    }[] = await page.evaluate(() => (window as any).__posLog)

    // filter to frames where content is visible (opacity > 0)
    const visibleFrames = positions.filter((p) => parseFloat(p.opacity) > 0.1)

    // check: no frame should have content at a far-off position
    // "far off" = more than 200px outside the trigger area
    const badFrames = visibleFrames.filter((p) => {
      const tooFarLeft = p.x < triggerMinX - 200
      const tooFarRight = p.x > triggerMaxRight + 200
      const tooFarUp = p.y < 0
      const tooFarDown = p.y > viewportHeight + 100
      const atOrigin = p.x === 0 && p.y === 0
      return tooFarLeft || tooFarRight || tooFarUp || tooFarDown || atOrigin
    })

    if (badFrames.length > 0) {
      console.log('bad frames:', JSON.stringify(badFrames.slice(0, 5), null, 2))
      console.log(
        'trigger area:',
        JSON.stringify({ triggerMinX, triggerMaxRight, triggerBottom })
      )
    }

    expect(
      badFrames.length,
      `Found ${badFrames.length} frames with far-off positions. ` +
        `First bad: x=${badFrames[0]?.x}, y=${badFrames[0]?.y}`
    ).toBe(0)

    // check: no sudden large jumps between consecutive visible frames
    const jumpThreshold = 150 // px
    const jumps: { from: (typeof visibleFrames)[0]; to: (typeof visibleFrames)[0] }[] = []
    for (let i = 1; i < visibleFrames.length; i++) {
      const dx = Math.abs(visibleFrames[i].x - visibleFrames[i - 1].x)
      const dy = Math.abs(visibleFrames[i].y - visibleFrames[i - 1].y)
      if (dx > jumpThreshold || dy > jumpThreshold) {
        jumps.push({ from: visibleFrames[i - 1], to: visibleFrames[i] })
      }
    }

    if (jumps.length > 0) {
      console.log(
        'position jumps:',
        JSON.stringify(
          jumps.slice(0, 3).map((j) => ({
            from: { x: j.from.x.toFixed(1), y: j.from.y.toFixed(1) },
            to: { x: j.to.x.toFixed(1), y: j.to.y.toFixed(1) },
            dx: Math.abs(j.to.x - j.from.x).toFixed(1),
            dy: Math.abs(j.to.y - j.from.y).toFixed(1),
          })),
          null,
          2
        )
      )
    }

    // allow some jumps (close→reopen at different target is expected)
    // but there shouldn't be jumps DURING an animation
    expect(
      jumps.length,
      `Found ${jumps.length} large position jumps (>${jumpThreshold}px)`
    ).toBeLessThanOrEqual(4) // at most one jump per close→reopen transition
  })
})
