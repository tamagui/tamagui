/**
 * exact token → pixel resolution for pixel-fidelity conversion.
 *
 * WHY: tamagui's space/size/radius scales are NOT Tailwind's ×4 scale. e.g. the v5/v6
 * space token `$4` = 18px (not 16), `$5` = 24px (not 20), `$6` = 32px (not 24); radius
 * `$8` = 22px (not 8). so converting `p="$4"` → `p-4` (which the runtime parses on the
 * Tailwind ×4 scale → 16px) CHANGES the pixel value. that silent drift is what the audit
 * caught: token → class was not pixel-equal to the source prop.
 *
 * FIX: resolve a `$N` token on a spacing/sizing/radius prop to its exact pixel value at
 * convert time and emit an arbitrary `[Npx]` class. the runtime parser passes arbitrary
 * `[Npx]` through verbatim (no scaling), so the converted value is pixel-identical to the
 * source prop. color tokens ($color5, $shadow6) stay token NAMES — they're theme-dependent
 * and resolve through the theme var system at runtime, so they must not be baked to px here.
 *
 * the token values come from `@tamagui/themes/v5`, which is the token set the app template's
 * `@tamagui/config/v5` (and v6, which layers the Tailwind palette/radii on the same v5
 * space/size) uses. the converter is app-template tooling; if a config swaps token scales,
 * this map is the single place to point at the new tokens.
 */

// lazily required so the transform stays usable if the themes package can't be resolved
// (mirrors the shorthands lazy-require in transform.ts).
let tokensCache: { space?: any; size?: any; radius?: any } | null = null
function getTokens() {
  if (tokensCache) return tokensCache
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { tokens } = require('@tamagui/themes/v5')
    tokensCache = tokens ?? {}
  } catch {
    tokensCache = {}
  }
  return tokensCache!
}

// props resolved against the SPACE scale (padding/margin/gap/position)
const spaceScaleProps = new Set([
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginHorizontal',
  'marginVertical',
  'gap',
  'rowGap',
  'columnGap',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
])

// props resolved against the SIZE scale (width/height)
const sizeScaleProps = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'flexBasis',
])

// props resolved against the RADIUS scale
const radiusScaleProps = new Set([
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
])

function readVal(v: any): number | null {
  if (typeof v === 'number') return v
  if (v && typeof v === 'object' && typeof v.val === 'number') return v.val
  return null
}

/**
 * resolve a `$N` tamagui token to its exact pixel value for `prop`'s token category.
 * returns null when the prop isn't a spacing/sizing/radius prop, or the token isn't found
 * (caller then falls back to stripping `$` — correct for color tokens etc).
 */
export function resolveTokenPx(prop: string, token: string): number | null {
  const tokens = getTokens()
  let cat: Record<string, any> | undefined
  if (spaceScaleProps.has(prop)) cat = tokens.space
  else if (sizeScaleProps.has(prop)) cat = tokens.size
  else if (radiusScaleProps.has(prop)) cat = tokens.radius
  else return null
  if (!cat) return null
  // space/size store keys WITH the `$` (`$4`); radius stores them WITHOUT (`8`); negative
  // space tokens store WITHOUT (`-4`). try the raw token then the `$`-stripped form.
  let v = cat[token]
  if (v == null) v = cat[token.slice(1)]
  return readVal(v)
}
