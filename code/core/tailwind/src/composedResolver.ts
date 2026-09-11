/**
 * Composes the N-to-1 Tailwind utilities into single style values.
 *
 * The class walk emits each part under a `__`-prefixed key and the frontend
 * descriptor's `compose` hook calls this once, with only those keys, right after
 * the walk. It is pure: same bag in, same styles out, no props and no env.
 *
 *   - ring + inset-ring + inset-shadow + shadow → boxShadow
 *   - bg-linear-to-* + from/via/to → backgroundImage
 *   - blur + brightness + contrast + … + drop-shadow → filter
 *   - perspective + rotateX/Y/Z + skewX/Y → transform
 *   - text-shadow presets + colors → textShadow*
 *
 * A part authored with modifiers (`hover:ring-4`) arrives as a condition object,
 * so every composed value is built once per condition the parts mention.
 */

/** reads one part at a condition; the scalar form when nothing was conditional */
type At = (key: string) => any

/**
 * Build one composed value from the parts named by `keys`. When no part carried
 * modifiers this is a single `build` call; otherwise it is one call per condition
 * any part mentions, and the result is the condition object the shared renderer
 * layers.
 */
function compose(
  props: Record<string, any>,
  keys: readonly string[],
  build: (at: At) => string | null
): any {
  let conditions: Set<string> | null = null
  let present = false
  for (let index = 0; index < keys.length; index++) {
    const value = props[keys[index]]
    if (value == null) continue
    present = true
    if (typeof value === 'object' && !Array.isArray(value)) {
      conditions ||= new Set()
      for (const condition in value) conditions.add(condition)
    }
  }
  if (!present) return null
  if (!conditions) return build((key) => props[key])
  conditions.add('default')
  const result: Record<string, any> = {}
  for (const condition of conditions) {
    const value = build((key) => {
      const raw = props[key]
      return raw && typeof raw === 'object' && !Array.isArray(raw)
        ? (raw[condition] ?? raw.default)
        : raw
    })
    if (value) result[condition] = value
  }
  return Object.keys(result).length > 0 ? result : null
}

// ── Gradients ─────────────────────────────────────────────────────────

const gradientKeys = [
  '__gradientDirection',
  '__gradientFrom',
  '__gradientVia',
  '__gradientTo',
] as const

function buildGradient(at: At): string | null {
  const dir = at('__gradientDirection')
  const from = at('__gradientFrom')
  const via = at('__gradientVia')
  const to = at('__gradientTo')
  if (!dir || (!from && !via && !to)) return null
  const start = from || 'transparent'
  const end = to || 'transparent'
  return via
    ? `linear-gradient(${dir}, ${start}, ${via}, ${end})`
    : `linear-gradient(${dir}, ${start}, ${end})`
}

// ── Box Shadows (ring, inset-ring, inset-shadow, shadow) ──────────────

const boxShadowKeys = [
  '__ring',
  '__ringColor',
  '__ringInset',
  '__insetRingWidth',
  '__insetRingColor',
  '__insetShadowGeometry',
  '__insetShadowDefaultColor',
  '__insetShadowColor',
  '__shadow',
] as const

function buildBoxShadow(at: At): string | null {
  const shadows: string[] = []
  const insetShadowGeometry = at('__insetShadowGeometry')
  if (insetShadowGeometry) {
    const color =
      at('__insetShadowColor') || at('__insetShadowDefaultColor') || 'rgb(0 0 0 / 0.05)'
    shadows.push(`${insetShadowGeometry} ${color}`.trim())
  }
  const insetRingWidth = at('__insetRingWidth')
  if (insetRingWidth != null) {
    shadows.push(
      `inset 0 0 0 ${insetRingWidth} ${at('__insetRingColor') || 'currentColor'}`
    )
  }
  const ring = at('__ring')
  if (ring != null) {
    const inset = at('__ringInset') ? 'inset ' : ''
    shadows.push(`${inset}0 0 0 ${ring} ${at('__ringColor') || 'currentColor'}`)
  }
  const shadow = at('__shadow')
  if (shadow && shadow !== 'none') shadows.push(shadow)
  return shadows.length > 0 ? shadows.join(', ') : null
}

// ── Filters & Drop Shadow ─────────────────────────────────────────────

const filterFunctions = [
  ['__filter_blur', 'blur'],
  ['__filter_brightness', 'brightness'],
  ['__filter_contrast', 'contrast'],
  ['__filter_grayscale', 'grayscale'],
  ['__filter_hueRotate', 'hue-rotate'],
  ['__filter_invert', 'invert'],
  ['__filter_saturate', 'saturate'],
  ['__filter_sepia', 'sepia'],
] as const

const filterKeys = [
  '__filter_blur',
  '__filter_brightness',
  '__filter_contrast',
  '__filter_grayscale',
  '__filter_hueRotate',
  '__filter_invert',
  '__filter_saturate',
  '__filter_sepia',
  '__dropShadowGeometry',
  '__dropShadowDefaultColor',
  '__dropShadowColor',
] as const

function buildFilter(at: At): string | null {
  const parts: string[] = []
  for (let index = 0; index < filterFunctions.length; index++) {
    const [key, cssName] = filterFunctions[index]
    const value = at(key)
    if (value != null && value !== '') parts.push(`${cssName}(${value})`)
  }
  const geometry = at('__dropShadowGeometry')
  if (geometry) {
    const color =
      at('__dropShadowColor') || at('__dropShadowDefaultColor') || 'rgb(0 0 0 / 0.15)'
    parts.push(`drop-shadow(${geometry} ${color})`.trim())
  }
  return parts.length > 0 ? parts.join(' ') : null
}

// ── Transforms ────────────────────────────────────────────────────────

const transformFunctions = [
  ['__transform_perspective', 'perspective'],
  ['__transform_rotateX', 'rotateX'],
  ['__transform_rotateY', 'rotateY'],
  ['__transform_rotateZ', 'rotateZ'],
  ['__transform_skewX', 'skewX'],
  ['__transform_skewY', 'skewY'],
] as const

const transformKeys = transformFunctions.map(([key]) => key)

function buildTransform(at: At): string | null {
  const parts: string[] = []
  for (let index = 0; index < transformFunctions.length; index++) {
    const [key, cssName] = transformFunctions[index]
    const value = at(key)
    if (value != null && value !== '') parts.push(`${cssName}(${value})`)
  }
  return parts.length > 0 ? parts.join(' ') : null
}

// ── Master Resolver ───────────────────────────────────────────────────

export function composedResolver(props: Record<string, any>): Record<string, any> | null {
  let result: Record<string, any> | null = null

  const backgroundImage = compose(props, gradientKeys, buildGradient)
  if (backgroundImage) (result ??= {}).backgroundImage = backgroundImage

  // a plain `shadow-*` is already contributed directly by the class walk, which
  // keeps its token identity. only a ring or inset restacks it into one value.
  if (
    props.__ring != null ||
    props.__insetRingWidth != null ||
    props.__insetShadowGeometry != null
  ) {
    const boxShadow = compose(props, boxShadowKeys, buildBoxShadow)
    if (boxShadow) (result ??= {}).boxShadow = boxShadow
  }

  const filter = compose(props, filterKeys, buildFilter)
  if (filter) (result ??= {}).filter = filter

  const transform = compose(props, transformKeys, buildTransform)
  if (transform) (result ??= {}).transform = transform

  const preset = props.__textShadow_preset
  const color = props.__textShadow_color
  if (preset) {
    result ??= {}
    result.textShadowOffset = preset.offset
    result.textShadowRadius = preset.radius
    result.textShadowColor = color || preset.defaultColor
  } else if (color) {
    ;(result ??= {}).textShadowColor = color
  }

  return result
}
