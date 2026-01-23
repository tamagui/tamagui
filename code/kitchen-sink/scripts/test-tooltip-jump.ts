/**
 * Standalone Playwright script to test tooltip position jump bug
 * Run: npx playwright test scripts/test-tooltip-jump.ts --headed
 */
import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })

  // Navigate with animation driver (pass as arg, default motion)
  const driver = process.argv[2] || 'motion'
  const url = `http://localhost:9000/?test=TooltipPositionJumpCase&animationDriver=${driver}`
  console.log('Navigating to:', url)

  // Capture console logs from the page
  page.on('console', msg => {
    if (msg.text().includes('[motion]')) {
      console.log('PAGE:', msg.text())
    }
  })

  await page.goto(url)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)

  // Inject position tracking - track both transform and bounding rect
  await page.evaluate(`
    window.__positions = []
    window.__debugStyles = []
    function trackTooltip() {
      const el = document.querySelector('[data-testid="tooltip-jump-content"]')
      if (el) {
        const transform = getComputedStyle(el).transform
        const rect = el.getBoundingClientRect()
        window.__positions.push({
          x: rect.left,
          y: rect.top,
          transform: transform,
          time: Date.now()
        })
        if (window.__debugStyles.length < 5) {
          const style = getComputedStyle(el)
          window.__debugStyles.push({
            transform: style.transform,
            left: style.left,
            top: style.top,
            position: style.position,
          })
        }
      }
      requestAnimationFrame(trackTooltip)
    }
    requestAnimationFrame(trackTooltip)
  `)

  // Get button positions
  const hireBtn = page.locator('[data-testid="tooltip-trigger-hire"]')
  const takeoutBtn = page.locator('[data-testid="tooltip-trigger-takeout"]')

  const hireBox = await hireBtn.boundingBox()
  const takeoutBox = await takeoutBtn.boundingBox()

  if (!hireBox || !takeoutBox) {
    console.error('Could not find buttons!')
    await browser.close()
    return
  }

  console.log('Button positions:')
  console.log('  HIRE:', hireBox)
  console.log('  TAKEOUT:', takeoutBox)

  const hireCenter = { x: hireBox.x + hireBox.width / 2, y: hireBox.y + hireBox.height / 2 }
  const takeoutCenter = { x: takeoutBox.x + takeoutBox.width / 2, y: takeoutBox.y + takeoutBox.height / 2 }

  console.log('\n1. Hovering on HIRE button...')
  // Use hover() which dispatches proper mouse events
  await hireBtn.hover()
  await page.waitForTimeout(800)

  // Check if tooltip appeared
  let tooltipVisible = await page.locator('[data-testid="tooltip-jump-content"]').isVisible().catch(() => false)
  console.log('   Tooltip visible:', tooltipVisible)

  if (!tooltipVisible) {
    console.log('   Trying direct mouse events...')
    await page.mouse.move(hireCenter.x, hireCenter.y)
    await page.dispatchEvent('[data-testid="tooltip-trigger-hire"]', 'mouseenter')
    await page.waitForTimeout(500)
    tooltipVisible = await page.locator('[data-testid="tooltip-jump-content"]').isVisible().catch(() => false)
    console.log('   Tooltip visible now:', tooltipVisible)
  }

  if (!tooltipVisible) {
    console.log('   Trying focus/click approach...')
    await hireBtn.focus()
    await page.waitForTimeout(500)
    tooltipVisible = await page.locator('[data-testid="tooltip-jump-content"]').isVisible().catch(() => false)
    console.log('   Tooltip visible now:', tooltipVisible)
  }

  console.log('2. Sweeping QUICKLY to TAKEOUT...')
  // Fast sweep: 100ms total
  const steps = 10
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await page.mouse.move(
      hireCenter.x + (takeoutCenter.x - hireCenter.x) * t,
      hireCenter.y + (takeoutCenter.y - hireCenter.y) * t
    )
    await page.waitForTimeout(10)
  }

  await page.waitForTimeout(500)

  // Analyze positions
  const positions = await page.evaluate(`window.__positions`)
  const debugStyles = await page.evaluate(`window.__debugStyles`)
  console.log(`\nCollected ${positions.length} positions`)
  console.log('\nDebug styles (first few):')
  debugStyles.forEach((s: any, i: number) => console.log(`  ${i}:`, s))

  // Show first 20 and last 20 positions
  console.log('\nFirst 20 positions:')
  positions.slice(0, 20).forEach((p: any, i: number) => {
    console.log(`  ${i}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`)
  })
  console.log('\nLast 20 positions:')
  positions.slice(-20).forEach((p: any, i: number) => {
    console.log(`  ${positions.length - 20 + i}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`)
  })

  // Find jumps - lower threshold
  const jumps: any[] = []
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    const delta = Math.sqrt(dx * dx + dy * dy)
    const timeDelta = curr.time - prev.time

    // Any significant movement
    if (delta > 20) {
      jumps.push({
        idx: i,
        from: `(${prev.x.toFixed(0)}, ${prev.y.toFixed(0)})`,
        to: `(${curr.x.toFixed(0)}, ${curr.y.toFixed(0)})`,
        delta: delta.toFixed(0),
        dx: dx.toFixed(0),
        dy: dy.toFixed(0),
        timeDelta
      })
    }
  }

  console.log(`\nFound ${jumps.length} jumps:`)
  jumps.forEach((j, i) => {
    console.log(`  ${i + 1}. [idx ${j.idx}] ${j.from} -> ${j.to}  (Δ${j.delta}px, dx=${j.dx}, dy=${j.dy}, ${j.timeDelta}ms)`)
    // Show context around the jump
    const start = Math.max(0, j.idx - 3)
    const end = Math.min(positions.length, j.idx + 4)
    console.log('      Context:')
    for (let k = start; k < end; k++) {
      const p = positions[k]
      const marker = k === j.idx ? '>>> ' : '    '
      console.log(`      ${marker}${k}: (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) t=${p.transform?.slice(0,40)}...`)
    }
  })

  // Keep browser open for manual inspection
  console.log('\n\nBrowser left open for inspection. Press Ctrl+C to close.')
  await new Promise(() => {}) // hang forever
}

main().catch(console.error)
