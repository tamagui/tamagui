import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Global tooltip pattern: single scoped tooltip with triggers in opposite corners.
 * When switching triggers, the tooltip should snap to the new position,
 * NOT slide across the screen.
 */

test.describe('Tooltip Global Pattern', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'motion') {
      test.skip()
      return
    }

    await setupPage(page, { name: 'TooltipGlobalPatternCase', type: 'useCase' })
    await page.waitForTimeout(500)
  })

  test('scoped tooltip should not slide across screen when switching far-apart triggers', async ({
    page,
  }) => {
    const triggerTL = page.locator('[data-testid="trigger-tl"]')
    const triggerBR = page.locator('[data-testid="trigger-br"]')

    const tlBox = await triggerTL.boundingBox()
    const brBox = await triggerBR.boundingBox()
    expect(tlBox).toBeTruthy()
    expect(brBox).toBeTruthy()

    const tlCenter = {
      x: tlBox!.x + tlBox!.width / 2,
      y: tlBox!.y + tlBox!.height / 2,
    }
    const brCenter = {
      x: brBox!.x + brBox!.width / 2,
      y: brBox!.y + brBox!.height / 2,
    }

    // hover top-left trigger: move then nudge to ensure useHover picks it up
    await page.mouse.move(tlCenter.x, tlCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(tlCenter.x + 1, tlCenter.y + 1)
    await page.waitForTimeout(800)

    // verify tooltip opened
    const tooltipWrapper = page.locator('[data-popper-animate-position]')
    const isVisible = await tooltipWrapper.isVisible().catch(() => false)

    if (!isVisible) {
      // fallback: try content testid
      const content = page.locator('[data-testid="global-tip-content"]')
      await expect(content).toBeVisible({ timeout: 2000 })
    }

    // get stable tooltip position near top-left
    const posA = await page.evaluate(() => {
      const el = document.querySelector('[data-popper-animate-position]') as HTMLElement
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })
    expect(posA, 'Tooltip should be visible at trigger A position').toBeTruthy()

    // start tracking positions at 60fps
    await page.evaluate(() => {
      ;(window as any).__positions = []
      const track = () => {
        const el = document.querySelector('[data-popper-animate-position]') as HTMLElement
        if (el) {
          const rect = el.getBoundingClientRect()
          const style = getComputedStyle(el)
          ;(window as any).__positions.push({
            x: rect.left,
            y: rect.top,
            opacity: parseFloat(style.opacity),
            time: Date.now(),
          })
        }
        ;(window as any).__rafId = requestAnimationFrame(track)
      }
      ;(window as any).__rafId = requestAnimationFrame(track)
    })

    // switch to bottom-right trigger
    await page.mouse.move(brCenter.x, brCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(brCenter.x + 1, brCenter.y + 1)
    await page.waitForTimeout(600)

    // stop tracking
    await page.evaluate(() => cancelAnimationFrame((window as any).__rafId))

    // get stable tooltip position near bottom-right
    const posB = await page.evaluate(() => {
      const el = document.querySelector('[data-popper-animate-position]') as HTMLElement
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })
    expect(posB, 'Tooltip should be visible at trigger B position').toBeTruthy()

    const positions: { x: number; y: number; opacity: number; time: number }[] =
      await page.evaluate(() => (window as any).__positions)

    // the two trigger positions should be far apart (>200px diagonal)
    const totalDistance = Math.sqrt((posB!.x - posA!.x) ** 2 + (posB!.y - posA!.y) ** 2)
    expect(totalDistance).toBeGreaterThan(200)

    // check: no VISIBLE position should be far from both A and B
    // if tooltip slides, we'll see positions in the "middle zone" between A and B
    const threshold = totalDistance * 0.25
    const middlePositions = positions.filter((p) => {
      if (p.opacity < 0.1) return false
      const distFromA = Math.sqrt((p.x - posA!.x) ** 2 + (p.y - posA!.y) ** 2)
      const distFromB = Math.sqrt((p.x - posB!.x) ** 2 + (p.y - posB!.y) ** 2)
      return distFromA > threshold && distFromB > threshold
    })

    if (middlePositions.length > 0) {
      console.log(
        `Found ${middlePositions.length} middle positions (sliding detected)`,
        middlePositions.slice(0, 5)
      )
    }

    expect(
      middlePositions.length,
      `Tooltip slid across screen: ${middlePositions.length} frames in middle zone`
    ).toBeLessThanOrEqual(2)
  })
})
