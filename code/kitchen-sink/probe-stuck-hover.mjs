import { chromium } from 'playwright'

const PORT = process.env.PORT || '7979'
const driver = process.env.DRIVER || 'reanimated'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })

const url = `http://localhost:${PORT}/?theme=light&animationDriver=${driver}&test=ReanimatedStuckHoverCase`
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, {
  timeout: 10000,
})
await page.waitForTimeout(400)

const bg = (id) =>
  page.getByTestId(id).evaluate((el) => getComputedStyle(el).backgroundColor)
const RED = 'rgb(255, 0, 0)'
const center = async (id) => {
  const b = await page.getByTestId(id).boundingBox()
  return [b.x + b.width / 2, b.y + b.height / 2]
}

console.log(`\n=== driver=${driver} ===`)

// Aggressive: re-render mid-hover at many micro-offsets, then hover out, looking
// for a timing where the post-commit reconcile races the hover-out emit and the
// latch stays stuck on hover.
let stuckCount = 0
for (let trial = 0; trial < 40; trial++) {
  const [cx, cy] = await center('stuck-rerender')
  await page.mouse.move(5, 5)
  await page.waitForTimeout(40)
  // hover in
  await page.mouse.move(cx, cy)
  // bump (real re-render) almost immediately while hovered
  await page.evaluate(() => document.querySelector('[data-testid=bump-tick]')?.click())
  // tiny variable delay then hover out
  const delay = trial % 8 // 0..7 ms
  if (delay) await page.waitForTimeout(delay)
  await page.mouse.move(5, 5)
  await page.waitForTimeout(60)
  const out = await bg('stuck-rerender')
  if (out !== RED) {
    stuckCount++
    console.log(`  trial ${trial} delay=${delay}ms STUCK out=${out}`)
  }
}
console.log(`rerender-race: ${stuckCount}/40 stuck`)

// Also brute-force plain hover with re-render landing during the move-out
stuckCount = 0
for (let trial = 0; trial < 40; trial++) {
  const [cx, cy] = await center('stuck-instant')
  await page.mouse.move(5, 5)
  await page.waitForTimeout(40)
  await page.mouse.move(cx, cy)
  await page.waitForTimeout(trial % 5)
  // move out and bump in the same microtask-ish window
  await page.mouse.move(5, 5)
  await page.evaluate(() => document.querySelector('[data-testid=bump-tick]')?.click())
  await page.waitForTimeout(60)
  const out = await bg('stuck-instant')
  if (out !== RED) {
    stuckCount++
    console.log(`  trial ${trial} STUCK out=${out}`)
  }
}
console.log(`out-then-rerender: ${stuckCount}/40 stuck`)

await browser.close()
