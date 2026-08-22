/**
 * Fabric's C++ prop parser cannot take colors as CSS strings, so every color
 * prop must be converted before props reach the engine. The compiler mappings
 * and runtime-mode pushes both use this exact runtime processor before props
 * cross into the engine.
 *
 * Colors go over as `{ space: 'srgb', r, g, b, a }` with each channel a float
 * in 0..1. That shape is the only one both prop parsers a themed view can reach
 * will accept:
 *
 *  - C++ `fromRawValueShared` reads it through its `space` branch. The packed
 *    ARGB int `processColor` returns is misread here: an opaque grey
 *    `0xFFE3E3E3` rendered as `rgb(254, 229, 229)`, taking `0xFF` as red and
 *    the real red as alpha, so every themed surface came out tinted pink.
 *  - Android additionally mounts some of these props through Java
 *    `SurfaceMountingManager.updateProps` -> `ColorPropConverter`, which takes
 *    a number or a map and throws `ColorValue: the value must be a number or
 *    Object` on anything else. A plain `[r, g, b, a]` array satisfies the C++
 *    parser but not this one, and the throw kills the mount-item dispatch and
 *    tears the whole React surface down.
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
    if (!COLOR_PROPS.has(key)) continue
    const value = props[key]
    // a style may already carry the packed int form RN accepts (`processColor`
    // output written straight into a style), and that form is misread the same
    // way, so it converts here too rather than only css strings
    const processed = typeof value === 'string' ? processColor(value) : value
    if (typeof processed === 'number') {
      out ??= { ...props }
      // processColor packs ARGB, and is signed on Android, hence >>>
      out[key] = {
        space: 'srgb',
        r: ((processed >>> 16) & 0xff) / 255,
        g: ((processed >>> 8) & 0xff) / 255,
        b: (processed & 0xff) / 255,
        a: ((processed >>> 24) & 0xff) / 255,
      }
    } else if (typeof value === 'string' && processed != null) {
      // a platform color resolves to an opaque object rather than a number, and
      // Fabric unpacks that shape itself, so it goes over untouched
      out ??= { ...props }
      out[key] = processed
    }
  }
  return out ?? props
}
