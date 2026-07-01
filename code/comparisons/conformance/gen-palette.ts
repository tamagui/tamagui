// generate the v6 Tailwind color palette from tailwindcss's own colors (guaranteed exact match
// with the oracle). run: bun code/comparisons/conformance/gen-palette.ts
import colors from 'tailwindcss/colors'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

const out: Record<string, string> = {
  $white: '#ffffff',
  $black: '#000000',
  $transparent: 'transparent',
}
// skip non-palette keys and deprecated aliases (they emit console warnings)
const SKIP = new Set([
  'inherit',
  'current',
  'transparent',
  'black',
  'white',
  'lightBlue',
  'warmGray',
  'trueGray',
  'coolGray',
  'blueGray',
])

for (const [hue, shades] of Object.entries(colors as Record<string, any>)) {
  if (SKIP.has(hue) || typeof shades !== 'object' || shades === null) continue
  for (const [shade, hex] of Object.entries(shades as Record<string, string>)) {
    out[`$${hue}-${shade}`] = hex
  }
}

const body = `// AUTO-GENERATED from tailwindcss/colors by gen-palette.ts — do not edit by hand.
export const tailwindColors: Record<string, string> = ${JSON.stringify(out, null, 2)}
`
writeFileSync(join(HERE, '../../core/config/src/v6-tailwind-palette.ts'), body)
console.log(
  `wrote ${Object.keys(out).length} colors to code/core/config/src/v6-tailwind-palette.ts`
)
