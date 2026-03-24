import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Global tooltip pattern: single scoped tooltip with triggers in opposite corners.
 *
 * Two behaviors to verify:
 * 1. While open, switching triggers → smooth position animation
 * 2. Close at A, reopen at B → snap position (animateOnly: []), then animate in
 */

test.describe('Tooltip Global Pattern', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'motion') {
      test.skip()
      return
    }

    await setupPage(page, { name: 'TooltipGlobalPatternCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
  })

  test('while open: smoothly animates position when switching triggers', async ({
    page,
  }) => {
    const triggerTL = page.locator('[data-testid="trigger-tl"]')
    const triggerBR = page.locator('[data-testid="trigger-br"]')
    const content = page.locator('[data-testid="global-tip-content"]')

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

    // hover top-left trigger to open
    await page.mouse.move(tlCenter.x, tlCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(tlCenter.x + 1, tlCenter.y + 1)
    await page.waitForTimeout(800)
    await expect(content).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    const posA = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    // track positions
    await page.evaluate(() => {
      ;(window as any).__positions = []
      const track = () => {
        const el = document.querySelector('[data-testid="global-tip-content"]')
        if (el) {
          const rect = el.getBoundingClientRect()
          ;(window as any).__positions.push({
            x: rect.left,
            y: rect.top,
            time: Date.now(),
          })
        }
        ;(window as any).__rafId = requestAnimationFrame(track)
      }
      ;(window as any).__rafId = requestAnimationFrame(track)
    })

    // switch to bottom-right (tooltip stays open via triggerElements)
    await page.mouse.move(brCenter.x, brCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(brCenter.x + 1, brCenter.y + 1)
    await page.waitForTimeout(400)

    await page.evaluate(() => cancelAnimationFrame((window as any).__rafId))

    const posB = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    const positions: { x: number; y: number }[] = await page.evaluate(
      () => (window as any).__positions
    )

    const xDiff = Math.abs(posB.x - posA.x)
    expect(xDiff).toBeGreaterThan(100)

    const minX = Math.min(posA.x, posB.x)
    const maxX = Math.max(posA.x, posB.x)
    const margin = xDiff * 0.15

    const intermediatePositions = positions.filter(
      (p) => p.x > minX + margin && p.x < maxX - margin
    )

    expect(
      intermediatePositions.length,
      `Should smoothly animate while open. ` +
        `posA.x=${posA.x.toFixed(1)}, posB.x=${posB.x.toFixed(1)}, ` +
        `intermediate=${intermediatePositions.length}/${positions.length}`
    ).toBeGreaterThan(2)
  })

  test('close then reopen: snaps position, does not slide from old position', async ({
    page,
  }) => {
    const triggerTL = page.locator('[data-testid="trigger-tl"]')
    const triggerBR = page.locator('[data-testid="trigger-br"]')
    const content = page.locator('[data-testid="global-tip-content"]')

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

    // open at top-left
    await page.mouse.move(tlCenter.x, tlCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(tlCenter.x + 1, tlCenter.y + 1)
    await page.waitForTimeout(800)
    await expect(content).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(300)

    const posA = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    // close: move mouse far away
    await page.mouse.move(400, 300)
    await page.waitForTimeout(1000)
    await expect(content).not.toBeVisible({ timeout: 5000 })

    // start tracking
    await page.evaluate(() => {
      ;(window as any).__positions = []
      const track = () => {
        const el = document.querySelector('[data-testid="global-tip-content"]')
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

    // reopen at bottom-right
    await page.mouse.move(brCenter.x, brCenter.y)
    await page.waitForTimeout(100)
    await page.mouse.move(brCenter.x + 1, brCenter.y + 1)
    await page.waitForTimeout(1000)
    await expect(content).toBeVisible({ timeout: 5000 })

    await page.evaluate(() => cancelAnimationFrame((window as any).__rafId))

    const posB = await content.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    })

    const positions: { x: number; y: number; opacity: number }[] = await page.evaluate(
      () => (window as any).__positions
    )

    const totalDistance = Math.sqrt((posB.x - posA.x) ** 2 + (posB.y - posA.y) ** 2)
    expect(totalDistance).toBeGreaterThan(200)

    // no VISIBLE frame should be in the "middle zone" between A and B
    // the tooltip should snap to B's position, not slide from A
    const threshold = totalDistance * 0.25
    const middlePositions = positions.filter((p) => {
      if (p.opacity < 0.1) return false
      const distFromA = Math.sqrt((p.x - posA.x) ** 2 + (p.y - posA.y) ** 2)
      const distFromB = Math.sqrt((p.x - posB.x) ** 2 + (p.y - posB.y) ** 2)
      return distFromA > threshold && distFromB > threshold
    })

    expect(
      middlePositions.length,
      `Close→reopen should snap, not slide. Found ${middlePositions.length} frames in middle zone`
    ).toBeLessThanOrEqual(2)
  })
})
