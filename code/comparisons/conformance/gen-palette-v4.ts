// generate the v6 Tailwind palette from Tailwind v4's colors. v4 colors are OKLCH; we rasterize
// each via a chromium canvas to get the exact sRGB hex the browser renders (so tamagui matches the
// v4 oracle on web, and has a real hex for native where RN has no oklch()).
// run: bun code/comparisons/conformance/gen-palette-v4.ts
import colors from 'tailwindcss/colors'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKIP = new Set(['inherit', 'current', 'transparent', 'black', 'white'])

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent('<canvas id="c" width="1" height="1"></canvas>')

const out: Record<string, string> = {
  $white: '#ffffff',
  $black: '#000000',
  $transparent: 'transparent',
}

for (const [hue, shades] of Object.entries(colors as Record<string, any>)) {
  if (SKIP.has(hue) || typeof shades !== 'object' || shades === null) continue
  for (const [shade, val] of Object.entries(shades as Record<string, string>)) {
    if (typeof val !== 'string') continue
    const hex = await page.evaluate((v) => {
      const cv = document.getElementById('c') as HTMLCanvasElement
      const ctx = cv.getContext('2d')!
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = v
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')
    }, val)
    if (hex && hex !== '#000000') out[`$${hue}-${shade}`] = hex
  }
}
await browser.close()

const body = `// AUTO-GENERATED from Tailwind v4 (oklch → sRGB via chromium canvas) by gen-palette-v4.ts — do not edit.
export const tailwindColors: Record<string, string> = ${JSON.stringify(out, null, 2)}
`
writeFileSync(join(HERE, '../../core/config/src/v6-tailwind-palette.ts'), body)
console.log(`wrote ${Object.keys(out).length} v4 colors`)
