import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * TOOLTIP POSITION JUMP TEST (Motion Driver Only)
 *
 * Bug: When using enableAnimationForPositionChange with a scoped tooltip,
 * rapidly moving between triggers causes the tooltip to JUMP to wrong position
 * (often near origin/top-left) before animating back.
 *
 * Key: Must actually MOVE the mouse across, not just call hover() which teleports.
 */

test.describe('Tooltip Position Jump', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // only test with motion driver - this is where the bug manifests
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver !== 'motion') {
      test.skip()
      return
    }

    await setupPage(page, { name: 'TooltipPositionJumpCase', type: 'useCase' })
    await page.waitForTimeout(500)
  })

  test('scoped tooltip should not jump when moving quickly between triggers', async ({ page }) => {
    // get button positions
    const hireBtn = page.locator('[data-testid="tooltip-trigger-hire"]')
    const bentoBtn = page.locator('[data-testid="tooltip-trigger-bento"]')
    const takeoutBtn = page.locator('[data-testid="tooltip-trigger-takeout"]')

    const hireBox = await hireBtn.boundingBox()
    const bentoBox = await bentoBtn.boundingBox()
    const takeoutBox = await takeoutBtn.boundingBox()

    if (!hireBox || !bentoBox || !takeoutBox) {
      throw new Error('Could not find button positions')
    }

    // inject position tracking script
    await page.evaluate(() => {
      ;(window as any).__tooltipPositions = []
      ;(window as any).__trackTooltip = () => {
        const el = document.querySelector('[data-testid="tooltip-jump-content"]') as HTMLElement
        if (!el) return null

        const style = getComputedStyle(el)
        const transform = style.transform
        if (!transform || transform === 'none') return null

        const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
        if (!match) return null

        const pos = { x: parseFloat(match[1]), y: parseFloat(match[2]), time: Date.now() }
        ;(window as any).__tooltipPositions.push(pos)
        return pos
      }

      // start tracking at 60fps
      const track = () => {
        ;(window as any).__trackTooltip()
        requestAnimationFrame(track)
      }
      requestAnimationFrame(track)
    })

    // step 1: hover on rightmost button (HIRE) and wait for tooltip to fully appear
    const hireCenter = { x: hireBox.x + hireBox.width / 2, y: hireBox.y + hireBox.height / 2 }
    await page.mouse.move(hireCenter.x, hireCenter.y)
    await page.waitForTimeout(800)

    // step 2: move mouse QUICKLY across to leftmost button (TAKEOUT)
    // must actually traverse the path, not teleport
    const takeoutCenter = { x: takeoutBox.x + takeoutBox.width / 2, y: takeoutBox.y + takeoutBox.height / 2 }

    // do fast sweep: HIRE -> TAKEOUT in ~100ms total
    const steps = 10
    const totalTime = 100
    const stepDelay = totalTime / steps

    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const x = hireCenter.x + (takeoutCenter.x - hireCenter.x) * t
      const y = hireCenter.y + (takeoutCenter.y - hireCenter.y) * t
      await page.mouse.move(x, y)
      await page.waitForTimeout(stepDelay)
    }

    await page.waitForTimeout(300)

    // analyze for jumps
    const positions = await page.evaluate(() => (window as any).__tooltipPositions)
    const jumps: any[] = []

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1]
      const curr = positions[i]
      const dx = Math.abs(curr.x - prev.x)
      const dy = Math.abs(curr.y - prev.y)
      const delta = Math.sqrt(dx * dx + dy * dy)
      const timeDelta = curr.time - prev.time

      // jump: large delta in short time, going toward origin
      if (timeDelta < 50 && delta > 100) {
        const jumpingLeft = curr.x < prev.x - 100
        const jumpingUp = curr.y < prev.y - 50
        const jumpToNearOrigin = curr.x < 200 && curr.y < 200 && prev.x > 300

        if (jumpingLeft || jumpingUp || jumpToNearOrigin) {
          jumps.push({ from: prev, to: curr, delta: Math.round(delta) })
        }
      }
    }

    console.log(`Collected ${positions.length} positions, found ${jumps.length} jumps`)
    if (jumps.length > 0) {
      console.log('Jumps:', JSON.stringify(jumps, null, 2))
    }

    expect(jumps.length, `Detected ${jumps.length} position jumps!`).toBe(0)
  })

  test('rapid back-and-forth should not cause jumps', async ({ page }) => {
    const hireBtn = page.locator('[data-testid="tooltip-trigger-hire"]')
    const takeoutBtn = page.locator('[data-testid="tooltip-trigger-takeout"]')

    const hireBox = await hireBtn.boundingBox()
    const takeoutBox = await takeoutBtn.boundingBox()

    if (!hireBox || !takeoutBox) {
      throw new Error('Could not find button positions')
    }

    // inject tracking
    await page.evaluate(() => {
      ;(window as any).__tooltipPositions = []
      const track = () => {
        const el = document.querySelector('[data-testid="tooltip-jump-content"]') as HTMLElement
        if (el) {
          const transform = getComputedStyle(el).transform
          if (transform && transform !== 'none') {
            const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
            if (match) {
              ;(window as any).__tooltipPositions.push({
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
                time: Date.now()
              })
            }
          }
        }
        requestAnimationFrame(track)
      }
      requestAnimationFrame(track)
    })

    const hireCenter = { x: hireBox.x + hireBox.width / 2, y: hireBox.y + hireBox.height / 2 }
    const takeoutCenter = { x: takeoutBox.x + takeoutBox.width / 2, y: takeoutBox.y + takeoutBox.height / 2 }

    // hover HIRE first
    await page.mouse.move(hireCenter.x, hireCenter.y)
    await page.waitForTimeout(600)

    // do 3 rapid back-and-forth sweeps
    for (let sweep = 0; sweep < 3; sweep++) {
      for (let i = 0; i <= 8; i++) {
        const t = i / 8
        await page.mouse.move(
          hireCenter.x + (takeoutCenter.x - hireCenter.x) * t,
          hireCenter.y + (takeoutCenter.y - hireCenter.y) * t
        )
        await page.waitForTimeout(10)
      }
      for (let i = 0; i <= 8; i++) {
        const t = i / 8
        await page.mouse.move(
          takeoutCenter.x + (hireCenter.x - takeoutCenter.x) * t,
          takeoutCenter.y + (hireCenter.y - takeoutCenter.y) * t
        )
        await page.waitForTimeout(10)
      }
    }

    await page.waitForTimeout(300)

    const positions = await page.evaluate(() => (window as any).__tooltipPositions)
    const jumps: any[] = []

    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1]
      const curr = positions[i]
      const delta = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2)
      const timeDelta = curr.time - prev.time

      if (timeDelta < 50 && delta > 100) {
        const jumpingTowardOrigin = curr.x < prev.x - 50 && curr.x < 200
        if (jumpingTowardOrigin) {
          jumps.push({ from: prev, to: curr, delta: Math.round(delta) })
        }
      }
    }

    console.log(`Found ${jumps.length} jumps in back-and-forth test`)
    expect(jumps.length).toBe(0)
  })
})
