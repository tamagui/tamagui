/**
 * exact token → value resolution for pixel-fidelity conversion.
 *
 * WHY: tamagui's token scales are NOT Tailwind's ×4 scale. e.g. the default v5/v6 space token
 * `$4` = 18px (not 16), radius `$8` = 22px (not 8), zIndex `$4` = 400 (not 4). so converting
 * `p="$4"` → `p-4` (which the runtime parses on the Tailwind ×4 scale → 16px) CHANGES the
 * value. that silent drift is what the audit caught: token → class was not equal to the source
 * prop.
 *
 * FIX: resolve a `$N` token to its exact value at convert time and emit an arbitrary class
 * (`p-[18px]`, `z-[400]`). the runtime parser passes arbitrary values through verbatim (no
 * scaling), so the converted value is identical to the source prop.
 *
 * CATEGORY RULE — MIRRORS THE RUNTIME (getTokenForKey). the runtime picks a token category
 * from `tokenCategories` (radius / size / zIndex / color) via a flat prop→category map, with
 * SPACE as the fallback for every other prop. we key off the SAME map so a tokenized
 * borderWidth falls through to SPACE (like the runtime), zIndex uses the zIndex scale, etc.
 * COLORS and FONTS are theme/font-dependent (resolved dynamically at runtime through the theme
 * and font systems) and must NOT be baked to a px value here — they stay token NAMES.
 *
 * CONFIG-AWARE: the converter is a GENERAL tool run on arbitrary apps, so the scale values MUST
 * come from the app's ACTUAL config (an app may set space.$4 = 20, zIndex.$4 = 40). the caller
 * passes the config token scales; the bundled `@tamagui/themes/v5` values are used ONLY as an
 * explicit fallback when no config tokens are supplied.
 */

import { tokenCategories } from '@tamagui/helpers/tokenCategories'
// CANONICAL default scales — a STATIC import of the source-of-truth token data. this is a
// DECLARED dependency (package.json), so it resolves in a packed/published install, and a
// static `import` compiles correctly to BOTH esm and cjs (the earlier bug was an UNDECLARED
// bare `require()`, which is `undefined` in ESM → silently empty tokens → the ×4 scale). there
// is exactly ONE owner of these numbers (no hand-copied duplicate that can drift).
import { tokens as canonicalDefaultTokens } from '@tamagui/themes/v5'

// { space?, size?, radius?, zIndex? } — the numeric token scales from the app config.
export interface TokenScales {
  space?: Record<string, any>
  size?: Record<string, any>
  radius?: Record<string, any>
  zIndex?: Record<string, any>
}

// flat prop → category map, exactly the runtime's (getTokenForKey builds the same from
// tokenCategories). categories present: radius, size, zIndex, color. everything NOT here
// falls through to 'space' (padding/margin/gap/inset/borderWidth/...).
const tokenCategoryByKey: Record<string, string> = {}
for (const cat in tokenCategories) {
  for (const k in (tokenCategories as any)[cat]) tokenCategoryByKey[k] = cat
}

// font props resolve through the font system at runtime (fontSize→text-*, leading, tracking),
// not the px scale — keep them token NAMES so the runtime font resolution applies.
const fontProps = new Set([
  'fontFamily',
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'fontWeight',
])

// exposed for the packed-consumer + parity tests (must equal the runtime default tokens).
export const defaultTokenScales: TokenScales = canonicalDefaultTokens as TokenScales

/**
 * does `prop` resolve against a NUMERIC token scale (space/size/radius/zIndex)? true for those;
 * false for color/font props (whose `$token` is resolved by NAME at runtime). used to decide
 * data-loss retention: an unresolved `$token` on a numeric-scale prop would emit a dead class,
 * so the converter RETAINS the source prop instead — while an unresolved color/font token is
 * fine to pass through by name.
 */
export function isTokenScaleProp(prop: string): boolean {
  if (fontProps.has(prop)) return false
  return (tokenCategoryByKey[prop] ?? 'space') !== 'color'
}

// read a token's underlying value — a number, a string (e.g. "10%"), or a Variable wrapping
// either. returns undefined when the token is absent/unreadable.
function readVal(v: any): number | string | undefined {
  if (typeof v === 'number' || typeof v === 'string') return v
  if (
    v &&
    typeof v === 'object' &&
    (typeof v.val === 'number' || typeof v.val === 'string')
  ) {
    return v.val
  }
  return undefined
}

/**
 * resolve a `$N` tamagui token to the INNER value of an arbitrary class ("18px", "400"),
 * using the caller-supplied token scales (falling back to the bundled default). returns null
 * when the prop is a color/font (stays a token name, resolved dynamically), or the token isn't
 * found (caller then strips `$`). the unit follows the category: dimensional categories
 * (space/size/radius) are px; zIndex is unitless.
 */
export function resolveTokenArbitrary(
  prop: string,
  token: string,
  tokens?: TokenScales
): string | null {
  if (fontProps.has(prop)) return null // font-resolved, dynamic
  const cat = tokenCategoryByKey[prop] ?? 'space'
  if (cat === 'color') return null // theme-resolved, dynamic
  const scales = tokens ?? (canonicalDefaultTokens as TokenScales)
  const scale = (scales as any)[cat] as Record<string, any> | undefined
  if (!scale) return null
  // space/size/zIndex store keys WITH `$` (`$4`); radius stores them WITHOUT (`8`); negative
  // space tokens store WITHOUT (`-4`). try the raw token then the `$`-stripped form.
  const val = readVal(token in scale ? scale[token] : scale[token.slice(1)])
  if (val === undefined) return null
  // a STRING-valued token (e.g. space.fluid = "10%") is an EXACT CSS value → use verbatim
  // (p-[10%]); a NUMBER is px on dimensional scales, unitless on zIndex.
  if (typeof val === 'string') return val
  return cat === 'zIndex' ? String(val) : `${val}px`
}
