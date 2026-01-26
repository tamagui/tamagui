import { expect, test } from '@playwright/test'

/**
 * Tests for motion driver issues on tamagui.dev
 *
 * These tests run against the actual tamagui.dev site (localhost:4444)
 * to test motion driver behavior on the real site components.
 *
 * SKIPPED: requires tamagui.dev running on localhost:4444
 */

const SITE_URL = 'http://localhost:4444'

test.use({
  video: 'on',
})

test.describe.skip('Tamagui.dev Motion Issues', () => {
  test.beforeAll(async () => {
    // verify site is running
  })

  test.describe('Logo Jitter Bug', () => {
    test('dot indicator should not jitter when moving mouse rapidly across TAMAGUI text', async ({ page }) => {
      await page.goto(SITE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)

      // find the logo-words element (in header, not footer)
      const logoWords = page.locator('header .logo-words').first()
      await expect(logoWords).toBeVisible()

      const logoBox = await logoWords.boundingBox()
      if (!logoBox) {
        throw new Error('Could not find logo-words bounding box')
      }

      // inject position tracking for the Circle (dot indicator)
      // the dot is a Circle with position absolute inside logo-words
      await page.evaluate(() => {
        (window as any).__dotPositions = []
        ;(window as any).__dotDebug = { found: false, selector: null }
        const track = () => {
          // find the circle element inside logo-words
          // it's in the header, which has render="header" so becomes a <header> tag
          const header = document.querySelector('header')
          if (!header) {
            (window as any).__dotDebug.selector = 'no header found'
            requestAnimationFrame(track)
            return
          }
          const logoWords = header.querySelector('.logo-words')
          if (!logoWords) {
            (window as any).__dotDebug.selector = 'no logo-words in header'
            requestAnimationFrame(track)
            return
          }
          // the circle is the first child element with position absolute (the SVG is not absolute)
          let found = false
          for (const child of Array.from(logoWords.children)) {
            const el = child as HTMLElement
            const computed = getComputedStyle(el)
            if (computed.position === 'absolute') {
              found = true
              ;(window as any).__dotDebug.found = true
              ;(window as any).__dotDebug.selector = 'found absolute positioned child'
              const transform = computed.transform
              if (transform && transform !== 'none') {
                const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
                if (match) {
                  (window as any).__dotPositions.push({
                    x: parseFloat(match[1]),
                    y: parseFloat(match[2]),
                    time: Date.now(),
                    transform,
                  })
                }
              } else {
                // transform may be in translate form or not set yet
                const left = parseFloat(computed.left) || 0
                const top = parseFloat(computed.top) || 0
                ;(window as any).__dotPositions.push({
                  x: left,
                  y: top,
                  time: Date.now(),
                  noTransform: true,
                })
              }
              break
            }
          }
          if (!found) {
            ;(window as any).__dotDebug.selector = 'no absolute child - children: ' + logoWords.children.length
          }
          requestAnimationFrame(track)
        }
        requestAnimationFrame(track)
      })

      // hover over logo first to activate animation
      const centerY = logoBox.y + logoBox.height / 2
      await page.mouse.move(logoBox.x + 10, centerY)
      await page.waitForTimeout(300)

      // do very rapid back-and-forth to trigger jitter
      // mimic user quickly flicking mouse back and forth every few frames
      const screenshots: string[] = []
      for (let sweep = 0; sweep < 20; sweep++) {
        // quick flick right then left - this mimics the user pattern that causes jitter
        // every 2-3 mouse moves we change direction
        const rightX = logoBox.x + logoBox.width * 0.8
        const leftX = logoBox.x + logoBox.width * 0.2
        const midX = logoBox.x + logoBox.width * 0.5

        // rapid: left->right->left in quick succession
        await page.mouse.move(leftX, centerY)
        await page.waitForTimeout(16) // ~60fps
        await page.mouse.move(rightX, centerY)
        await page.waitForTimeout(16)
        await page.mouse.move(midX, centerY)
        await page.waitForTimeout(16)

        // take screenshot every few sweeps to see visual state
        if (sweep % 5 === 0) {
          const screenshot = await page.screenshot()
          screenshots.push(screenshot.toString('base64').slice(0, 50) + '...')
        }
      }

      // also do the continuous sweep pattern
      for (let sweep = 0; sweep < 3; sweep++) {
        for (let i = 0; i <= 10; i++) {
          const t = i / 10
          const x = logoBox.x + (logoBox.width) * t
          await page.mouse.move(x, centerY)
          await page.waitForTimeout(8)
        }
        for (let i = 0; i <= 10; i++) {
          const t = i / 10
          const x = logoBox.x + logoBox.width - (logoBox.width) * t
          await page.mouse.move(x, centerY)
          await page.waitForTimeout(8)
        }
      }

      console.log(`Took ${screenshots.length} screenshots during test`)

      await page.waitForTimeout(500)

      // analyze positions for unexpected jumps
      const positions = await page.evaluate(() => (window as any).__dotPositions || [])
      const debug = await page.evaluate(() => (window as any).__dotDebug || {})

      console.log(`Collected ${positions.length} dot positions`)
      console.log(`Debug:`, debug)
      if (positions.length > 0) {
        console.log('First position:', positions[0])
        console.log('Last position:', positions[positions.length - 1])
        // show all x values to see the pattern
        const xValues = positions.map((p: any) => Math.round(p.x))
        console.log('X values sample (first 50):', xValues.slice(0, 50).join(', '))
        console.log('X values sample (last 50):', xValues.slice(-50).join(', '))
      }

      // analyze for jitter patterns:
      // 1. Large sudden jumps (>20px in one frame)
      // 2. Rapid back-and-forth oscillations
      const jumps: any[] = []
      const oscillations: any[] = []

      for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1]
        const curr = positions[i]
        const dx = curr.x - prev.x
        const timeDelta = curr.time - prev.time

        // detect large jumps: >20px change in a single frame
        if (Math.abs(dx) > 20 && timeDelta < 30) {
          jumps.push({
            idx: i,
            from: Math.round(prev.x),
            to: Math.round(curr.x),
            dx: Math.round(dx),
            timeDelta,
          })
        }
      }

      // detect oscillations: A->B->A pattern in <100ms
      for (let i = 2; i < positions.length; i++) {
        const a = positions[i - 2]
        const b = positions[i - 1]
        const c = positions[i]
        const totalTime = c.time - a.time

        if (totalTime < 100) {
          // check if c is close to a (returned to original position)
          const returnDistance = Math.abs(c.x - a.x)
          const deviationDistance = Math.abs(b.x - a.x)
          if (returnDistance < 3 && deviationDistance > 8) {
            oscillations.push({
              idx: i,
              pattern: `${Math.round(a.x)} -> ${Math.round(b.x)} -> ${Math.round(c.x)}`,
              totalTime,
            })
          }
        }
      }

      console.log(`Large jumps (>20px): ${jumps.length}`)
      if (jumps.length > 0) {
        console.log('Jump samples:', jumps.slice(0, 5))
      }
      console.log(`Oscillations: ${oscillations.length}`)
      if (oscillations.length > 0) {
        console.log('Oscillation samples:', oscillations.slice(0, 5))
      }

      console.log(`Detected ${jumps.length} jitters`)
      if (jumps.length > 0) {
        console.log('First few jitters:', JSON.stringify(jumps.slice(0, 5), null, 2))
      }

      // allow some jitter but not excessive
      // in a well-behaved animation, we might get 0-3 jitters at direction changes
      // the bug causes 10+ jitters
      expect(jumps.length, `Too many jitters detected: ${jumps.length}`).toBeLessThan(10)
    })
  })

  test.describe('PromoLinksRow Tooltip Position Jump', () => {
    test('tooltip should not jump when moving between promo buttons', async ({ page }) => {
      await page.goto(SITE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)

      // resize to ensure promo buttons are visible
      await page.setViewportSize({ width: 1400, height: 900 })
      await page.waitForTimeout(500)

      // find the PromoLinksRow buttons (Starter Kit/Takeout, Copy-Paste UI/Bento, Add Even)
      // these are the buttons that use the scoped tooltip with animatePosition
      // the buttons show "Starter Kit", "Copy-Paste UI", "Add Even"
      const takeoutBtn = page.locator('button:has-text("Starter Kit")').first()
      const bentoBtn = page.locator('button:has-text("Copy-Paste UI")').first()
      const consultingBtn = page.locator('button:has-text("Hire Us!")').first()

      const takeoutVisible = await takeoutBtn.isVisible().catch(() => false)
      const bentoVisible = await bentoBtn.isVisible().catch(() => false)
      const consultingVisible = await consultingBtn.isVisible().catch(() => false)

      if (!takeoutVisible || !bentoVisible || !consultingVisible) {
        console.log('PromoLinksRow buttons not visible, skipping')
        console.log('Takeout visible:', takeoutVisible)
        console.log('Bento visible:', bentoVisible)
        console.log('Consulting visible:', consultingVisible)
        test.skip()
        return
      }

      const takeoutBox = await takeoutBtn.boundingBox()
      const bentoBox = await bentoBtn.boundingBox()
      const consultingBox = await consultingBtn.boundingBox()

      if (!takeoutBox || !bentoBox || !consultingBox) {
        throw new Error('Could not get bounding boxes for promo buttons')
      }

      console.log('Button positions:')
      console.log('  Takeout (left):', takeoutBox.x)
      console.log('  Bento (middle):', bentoBox.x)
      console.log('  Consulting (right):', consultingBox.x)

      // inject position tracking for tooltip
      // the tooltip content has animatePosition and scope="promo-tooltip"
      await page.evaluate(() => {
        (window as any).__tooltipPositions = []
        ;(window as any).__jumpLog = []
        let lastPos: any = null

        const track = () => {
          // find tooltip by data-placement attribute (set by Popper)
          const tooltip = document.querySelector('[data-placement]') as HTMLElement
          if (tooltip) {
            // get actual rendered position
            const rect = tooltip.getBoundingClientRect()
            const transform = getComputedStyle(tooltip).transform
            let x = rect.x
            let y = rect.y

            // also extract matrix values if present
            if (transform && transform !== 'none') {
              const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
              if (match) {
                // use rect for tracking since that's where it visually appears
              }
            }

            const pos = { x: rect.x, y: rect.y, time: Date.now() }
            ;(window as any).__tooltipPositions.push(pos)

            // detect jumps in real-time
            if (lastPos) {
              const dx = Math.abs(x - lastPos.x)
              if (dx > 100) {
                const msg = `JUMP: ${lastPos.x.toFixed(0)} -> ${x.toFixed(0)} (dx: ${dx.toFixed(0)})`
                ;(window as any).__jumpLog.push(msg)
                console.log('%c' + msg, 'color: red; font-weight: bold')
              }
            }
            lastPos = pos
          } else {
            lastPos = null
          }
          requestAnimationFrame(track)
        }
        requestAnimationFrame(track)
      })

      // step 1: hover on rightmost button (Consulting) to open tooltip
      const consultingCenter = { x: consultingBox.x + consultingBox.width / 2, y: consultingBox.y + consultingBox.height / 2 }
      await page.mouse.move(consultingCenter.x, consultingCenter.y)
      await page.waitForTimeout(800) // wait for tooltip to fully appear

      // step 2: FAST move to leftmost button (Takeout)
      // this is the pattern that triggers the jump bug
      const takeoutCenter = { x: takeoutBox.x + takeoutBox.width / 2, y: takeoutBox.y + takeoutBox.height / 2 }

      // fast sweep across all 3 buttons
      const steps = 10
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const x = consultingCenter.x + (takeoutCenter.x - consultingCenter.x) * t
        const y = consultingCenter.y + (takeoutCenter.y - consultingCenter.y) * t
        await page.mouse.move(x, y)
        await page.waitForTimeout(10) // fast movement
      }

      await page.waitForTimeout(400)

      // analyze for position jumps
      const positions = await page.evaluate(() => (window as any).__tooltipPositions || [])
      const jumpLog = await page.evaluate(() => (window as any).__jumpLog || [])

      const jumps: any[] = []
      for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1]
        const curr = positions[i]
        const dx = curr.x - prev.x
        const timeDelta = curr.time - prev.time

        // detect large sudden jumps (>100px in <50ms)
        if (Math.abs(dx) > 100 && timeDelta < 50) {
          jumps.push({
            idx: i,
            from: Math.round(prev.x),
            to: Math.round(curr.x),
            dx: Math.round(dx),
            timeDelta,
          })
        }
      }

      console.log(`Collected ${positions.length} tooltip positions`)
      if (positions.length > 0) {
        const xValues = positions.map((p: any) => Math.round(p.x))
        console.log('X positions (first 30):', xValues.slice(0, 30).join(', '))
        console.log('X positions (last 30):', xValues.slice(-30).join(', '))
      }
      console.log(`Jump log from browser:`, jumpLog)
      console.log(`Detected ${jumps.length} position jumps`)
      if (jumps.length > 0) {
        console.log('Jumps:', JSON.stringify(jumps.slice(0, 5), null, 2))
      }

      expect(jumps.length, `Tooltip jumped ${jumps.length} times!`).toBe(0)
    })

    test('inner content animations should not get stuck at endpoints', async ({ page }) => {
      await page.goto(SITE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)

      await page.setViewportSize({ width: 1400, height: 900 })
      await page.waitForTimeout(500)

      // find header links
      const coreLink = page.locator('a:has-text("Core")').first()
      const menuButton = page.locator('button[aria-label="Open the main menu"]').first()

      const coreVisible = await coreLink.isVisible().catch(() => false)
      if (!coreVisible) {
        console.log('Core link not visible, skipping')
        test.skip()
        return
      }

      // inject tracking for Frame (inner content) animations
      await page.evaluate(() => {
        (window as any).__framePositions = []
        const track = () => {
          const frames = document.querySelectorAll('.header-popover-frame')
          frames.forEach((frame, idx) => {
            const el = frame as HTMLElement
            const transform = getComputedStyle(el).transform
            const opacity = getComputedStyle(el).opacity
            if (transform && transform !== 'none') {
              const match = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
              if (match) {
                (window as any).__framePositions.push({
                  idx,
                  x: parseFloat(match[1]),
                  y: parseFloat(match[2]),
                  opacity: parseFloat(opacity),
                  time: Date.now(),
                })
              }
            }
          })
          requestAnimationFrame(track)
        }
        requestAnimationFrame(track)
      })

      // hover Core
      await coreLink.hover()
      await page.waitForTimeout(400)

      // rapidly switch to menu button
      await menuButton.hover()
      await page.waitForTimeout(200)

      // back to Core
      await coreLink.hover()
      await page.waitForTimeout(200)

      // to menu
      await menuButton.hover()
      await page.waitForTimeout(200)

      // to Core
      await coreLink.hover()
      await page.waitForTimeout(400)

      const positions = await page.evaluate(() => (window as any).__framePositions || [])
      console.log(`Collected ${positions.length} frame positions`)

      // analyze for stuck animations (opacity stuck at 0 or x stuck at wrong value)
      let stuckAtExit = 0
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i]
        // check for opacity stuck near 0 when it should be 1
        if (pos.opacity < 0.1 && Math.abs(pos.x) > 30) {
          stuckAtExit++
        }
      }

      console.log(`Frames stuck at exit state: ${stuckAtExit}`)
      // some exit states during transition are fine, but not excessive
      expect(stuckAtExit).toBeLessThan(50)
    })
  })
})
