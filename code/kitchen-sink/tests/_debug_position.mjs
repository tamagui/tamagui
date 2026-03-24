import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(
  'http://localhost:9000/?test=PopoverHoverableScopedCase&animationDriver=motion&theme=light',
  { waitUntil: 'networkidle' }
)
await page.waitForTimeout(500)

const trigger = page.locator('#nav-trigger-about')
const tBox = await trigger.boundingBox()
console.log('trigger box:', JSON.stringify(tBox))
await trigger.hover()
await page.waitForTimeout(2000)

const content = page.locator('#nav-content')
const visible = await content.isVisible()
console.log('content visible:', visible)
if (visible) {
  const cBox = await content.boundingBox()
  console.log('content box:', JSON.stringify(cBox))

  const info = await page.evaluate(() => {
    const el = document.getElementById('nav-content')
    if (!el) return null
    // the PopperContent renders: outer TamaguiView > inner PopperContentFrame
    // nav-content is the PopperContent, which is the inner PopperContentFrame
    // let's walk up the DOM to find the position wrapper
    let node = el
    const results = []
    for (let i = 0; i < 5 && node; i++) {
      const cs = getComputedStyle(node)
      results.push({
        tag: node.tagName,
        id: node.id,
        className: node.className?.substring?.(0, 60),
        transform: cs.transform,
        opacity: cs.opacity,
        position: cs.position,
        top: cs.top,
        left: cs.left,
        display: cs.display,
      })
      node = node.parentElement
    }
    return results
  })
  console.log('DOM hierarchy:')
  info?.forEach((n, i) => console.log(`  ${i}:`, JSON.stringify(n)))
}
await browser.close()
