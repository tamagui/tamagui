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
 *
 * Every other style first goes through React Native's own processor for its
 * key, as React's style diff does for a rendered view: Fabric reads only the
 * processed form, so a gradient keeps its angle and stops, and Android's view
 * manager gets the array it casts `transformOrigin` to instead of throwing on
 * the authored string. Some processors throw on their own output, so a value
 * crosses this boundary once.
 */
import { processColor, type ColorValue } from 'react-native'
import ReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes'

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
  'outlineColor',
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
    let value = props[key]
    const process = COLOR_PROPS.has(key)
      ? undefined
      : ReactNativeStyleAttributes[key]?.process
    if (process && value != null) {
      value = process(value)
      out ??= { ...props }
      out[key] = value
    }
    if (key === 'dropShadow' && value != null && typeof value === 'object') {
      const processed = processStyleColors(value as Record<string, unknown>)
      if (processed !== value) {
        out ??= { ...props }
        out[key] = processed
      }
      continue
    }
    if (
      (key === 'boxShadow' ||
        key === 'filter' ||
        key === 'experimental_backgroundImage' ||
        key === 'colorStops') &&
      Array.isArray(value)
    ) {
      let changed = false
      const next: Record<string, unknown>[] = []
      for (const entry of value) {
        const processed = processStyleColors(entry)
        if (processed !== entry) changed = true
        next.push(processed)
      }
      if (changed) {
        out ??= { ...props }
        out[key] = next
      }
      continue
    }
    if (!COLOR_PROPS.has(key)) continue
    // a style may already carry the packed int form RN accepts (`processColor`
    // output written straight into a style), and that form is misread the same
    // way, so it converts here too rather than only css strings
    const processed =
      typeof value === 'string' || (typeof value === 'object' && value !== null)
        ? processColor(value as ColorValue)
        : value
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
    } else if (processed != null && typeof processed === 'object') {
      // platform and dynamic colors resolve to opaque objects. processColor
      // normalizes their color branches before Fabric unpacks the shape.
      out ??= { ...props }
      out[key] = processed
    }
  }
  return out ?? props
}
