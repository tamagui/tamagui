import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: false })
const page = await browser.newPage()

// Capture all console logs
page.on('console', async msg => {
  const text = msg.text()
  if (text.includes('[motion DEBUG]') || text.includes('glow')) {
    // get all args to see full object
    const args = await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => arg.toString())))
    console.log(`[CONSOLE ${Date.now()}]`, ...args)
  }
})

// Track transforms
await page.addInitScript(() => {
  window.__glowHistory = []
  const observer = new MutationObserver(() => {
    document.querySelectorAll('[data-testid^="glow-"]').forEach(el => {
      const transform = getComputedStyle(el).transform
      const opacity = getComputedStyle(el).opacity
      window.__glowHistory.push({
        id: el.getAttribute('data-testid'),
        transform,
        opacity,
        time: performance.now()
      })
    })
  })
  observer.observe(document, { childList: true, subtree: true, attributes: true })

  // Also capture on RAF
  const captureRAF = () => {
    document.querySelectorAll('[data-testid^="glow-"]').forEach(el => {
      const transform = getComputedStyle(el).transform
      const opacity = getComputedStyle(el).opacity
      window.__glowHistory.push({
        id: el.getAttribute('data-testid'),
        transform,
        opacity,
        time: performance.now(),
        raf: true
      })
    })
    if (window.__glowHistory.length < 200) {
      requestAnimationFrame(captureRAF)
    }
  }
  requestAnimationFrame(captureRAF)
})

console.log('Navigating to http://localhost:8081/')
await page.goto('http://localhost:8081/')

// Wait for hydration
await page.waitForTimeout(3000)

// Get glow history
const history = await page.evaluate(() => window.__glowHistory)

console.log('\n=== GLOW TRANSFORM HISTORY ===')
console.log(`Total frames captured: ${history.length}`)

// Group by glow id
const byId = {}
history.forEach(h => {
  if (!byId[h.id]) byId[h.id] = []
  byId[h.id].push(h)
})

for (const [id, frames] of Object.entries(byId)) {
  console.log(`\n--- ${id} ---`)
  console.log(`First 5 frames:`)
  frames.slice(0, 5).forEach((f, i) => {
    console.log(`  ${i}: transform=${f.transform}, opacity=${f.opacity}, time=${f.time.toFixed(0)}ms`)
  })
  console.log(`Last 3 frames:`)
  frames.slice(-3).forEach((f, i) => {
    console.log(`  ${frames.length - 3 + i}: transform=${f.transform}, opacity=${f.opacity}, time=${f.time.toFixed(0)}ms`)
  })

  // Check for origin (0,0) transforms
  const originFrames = frames.filter(f => {
    const match = f.transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
    if (match) {
      const tx = parseFloat(match[1])
      const ty = parseFloat(match[2])
      return Math.abs(tx) < 10 && Math.abs(ty) < 10
    }
    return false
  })

  if (originFrames.length > 0) {
    console.log(`\n  ⚠️  FOUND ${originFrames.length} FRAMES AT ORIGIN!`)
    originFrames.slice(0, 3).forEach(f => {
      console.log(`    time=${f.time.toFixed(0)}ms, transform=${f.transform}`)
    })
  }
}

await browser.close()
