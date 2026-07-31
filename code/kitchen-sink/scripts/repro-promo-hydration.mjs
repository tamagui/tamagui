// repro: tamagui.dev homepage promo row tooltip jump right after hydration.
// jiggles over the first promo link until the tooltip first appears (the
// moment hydration attached handlers), then immediately sweeps across the
// row. reports single-frame teleports.
import { chromium } from '@playwright/test'

const URL = process.env.URL || 'http://localhost:8081/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.addInitScript(() => {
  window.__frames = []
  const sample = () => {
    const el = document.querySelector('[data-popper-animate-position]')
    if (el) {
      const cs = getComputedStyle(el)
      let x = null
      let y = null
      try {
        const m = new DOMMatrixReadOnly(cs.transform)
        x = m.e
        y = m.f
      } catch {}
      window.__frames.push({
        t: performance.now(),
        x,
        y,
        opacity: cs.opacity,
        w: el.offsetWidth,
        text: (el.textContent || '').slice(0, 40),
      })
    } else {
      window.__frames.push({ t: performance.now(), gone: true })
    }
    requestAnimationFrame(sample)
  }
  requestAnimationFrame(sample)
})

await page.goto(URL, { waitUntil: 'domcontentloaded' })

const takeout = page.locator('a[href="/takeout"]').first()
await takeout.waitFor({ state: 'visible', timeout: 30000 })
const hire = page.locator('a[href="https://addeven.com"]').first()

const tb = await takeout.boundingBox()
const hb = await hire.boundingBox()

const y = tb.y + tb.height / 2
const startX = tb.x + 12
const endX = hb.x + hb.width - 12

// jiggle on the first button until the tooltip first mounts = hydration done
const tJiggle = Date.now()
let hydrated = false
for (let i = 0; i < 600; i++) {
  // must exit and re-enter the element: pre-hydration enters are lost and a
  // within-element move never refires mouseenter
  await page.mouse.move(startX - 60, y, { steps: 2 })
  await page.mouse.move(startX, y, { steps: 3 })
  const present = await page
    .evaluate(() => !!document.querySelector('[data-popper-animate-position]'))
    .catch(() => false)
  if (present) {
    hydrated = true
    break
  }
  await page.waitForTimeout(16)
}
console.log(`tooltip first mounted after ${Date.now() - tJiggle}ms of jiggling, hydrated=${hydrated}`)
if (!hydrated) {
  console.log('tooltip never appeared — abort')
  await browser.close()
  process.exit(1)
}

// IMMEDIATELY sweep left -> right across all three buttons (user's gesture)
const steps = 20
for (let i = 0; i <= steps; i++) {
  await page.mouse.move(startX + ((endX - startX) * i) / steps, y)
  await page.waitForTimeout(12)
}
await page.waitForTimeout(1200)

const frames = await page.evaluate(() => window.__frames)
let prev = null
const jumps = []
for (const f of frames) {
  if (f.gone || f.x == null) {
    prev = null
    continue
  }
  if (prev) {
    const d = Math.hypot(f.x - prev.x, f.y - prev.y)
    if (d > 100) {
      jumps.push({
        at: Math.round(f.t),
        from: { x: Math.round(prev.x), y: Math.round(prev.y), text: prev.text },
        to: { x: Math.round(f.x), y: Math.round(f.y), text: f.text },
        d: Math.round(d),
      })
    }
  }
  prev = f
}

const visible = frames.filter((f) => !f.gone && f.x != null)
console.log(`frames: ${frames.length}, visible: ${visible.length}`)
console.log(`jumps > 100px/frame: ${jumps.length}`)
for (const j of jumps) console.log(JSON.stringify(j))

if (visible.length) {
  const first = visible[0].t
  console.log('--- trace (t, x, y, opacity, w, text) ---')
  for (const f of visible) {
    console.log(
      `${Math.round(f.t - first)}\t${Math.round(f.x)}\t${Math.round(f.y)}\t${f.opacity}\t${f.w}\t${f.text}`
    )
  }
}

await browser.close()
