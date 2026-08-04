/**
 * Fabric's C++ prop parser takes colors as ARGB ints, not CSS strings, so
 * every color prop must be converted before props reach the engine. The
 * compiler does this at build time; this runtime version exists for
 * hand-written slots (spike harness, tests, manual usage).
 */
import { processColor } from 'react-native'

const COLOR_PROPS = new Set([
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderEndColor',
  'borderBlockColor',
  'borderBlockStartColor',
  'borderBlockEndColor',
  'shadowColor',
  'textShadowColor',
  'textDecorationColor',
  'tintColor',
  'overlayColor',
])

export function processStyleColors(
  props: Record<string, unknown>
): Record<string, unknown> {
  let out: Record<string, unknown> | null = null
  for (const key in props) {
    const value = props[key]
    if (COLOR_PROPS.has(key) && typeof value === 'string') {
      out ??= { ...props }
      const processed = processColor(value)
      if (processed != null) out[key] = processed
    }
  }
  return out ?? props
}
