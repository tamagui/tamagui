/**
 * Fabric's C++ prop parser cannot take colors as CSS strings, so every color
 * prop must be converted before props reach the engine. The compiler mappings
 * and runtime-mode pushes both use this exact runtime processor before props
 * cross into the engine.
 *
 * Colors go over as `[r, g, b, a]` floats in 0..1, not as the packed ARGB int
 * `processColor` returns. Both forms are accepted by Fabric
 * (`fromRawValueShared`), but the int form is misread through this path: an
 * opaque grey `0xFFE3E3E3` rendered as `rgb(254, 229, 229)`, taking `0xFF` as
 * red and the real red as alpha, so every themed surface in an app came out
 * tinted pink. The float branch carries each channel in its own array slot, so
 * there is no packing for the parser to disagree about.
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
      // a platform color resolves to an opaque object rather than a number, and
      // Fabric unpacks that shape itself, so it goes over untouched
      if (typeof processed === 'number') {
        // processColor packs ARGB, and is signed on Android, hence >>>
        out[key] = [
          ((processed >>> 16) & 0xff) / 255,
          ((processed >>> 8) & 0xff) / 255,
          (processed & 0xff) / 255,
          ((processed >>> 24) & 0xff) / 255,
        ]
      } else if (processed != null) {
        out[key] = processed
      }
    }
  }
  return out ?? props
}
