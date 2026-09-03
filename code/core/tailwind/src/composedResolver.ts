/**
 * Composed resolver for variant-driven Tailwind utilities.
 *
 * This replaces the imperative compose.ts ring/gradient/filter/shadow/transform
 * logic with a single, pure, declarative resolver function that runs after
 * all className-resolved variant props are collected.
 *
 * It composes N-to-1 mappings:
 *   - ring + inset-ring + inset-shadow + shadow → boxShadow
 *   - bg-linear-to-* + from/via/to → backgroundImage
 *   - blur + brightness + contrast + ... + drop-shadow → filter
 *   - perspective + rotateX/Y/Z + skewX/Y → transform
 *   - text-shadow presets + colors → textShadow*
 *
 * Supports both scalar values and conditional modifier objects ({ default, hover, ... }).
 */

function hasConditions(...values: any[]): boolean {
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (v && typeof v === 'object' && !Array.isArray(v)) return true
  }
  return false
}

function getConditions(...values: any[]): string[] {
  const set = new Set<string>()
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const k in v) set.add(k)
    }
  }
  if (set.size > 0) set.add('default')
  return [...set]
}

function getAtCondition(value: any, condition: string): any {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[condition] ?? value.default
  }
  return value
}

// ── Gradients ─────────────────────────────────────────────────────────

function buildGradient(
  dir?: string,
  from?: string,
  via?: string,
  to?: string
): string | null {
  if (!dir || (!from && !via && !to)) return null
  const f = from || 'transparent'
  const t = to || 'transparent'
  return via
    ? `linear-gradient(${dir}, ${f}, ${via}, ${t})`
    : `linear-gradient(${dir}, ${f}, ${t})`
}

function resolveGradient(props: Record<string, any>): any {
  const dir = props.__gradientDirection
  const from = props.__gradientFrom ?? props.from
  const via = props.__gradientVia ?? props.via
  const to = props.__gradientTo ?? props.to

  if (!dir && !from && !via && !to) return undefined
  if (!dir || (!from && !via && !to)) return undefined

  if (!hasConditions(dir, from, via, to)) {
    return buildGradient(dir, from, via, to)
  }

  const conditions = getConditions(dir, from, via, to)
  const result: Record<string, any> = {}
  for (const cond of conditions) {
    const g = buildGradient(
      getAtCondition(dir, cond),
      getAtCondition(from, cond),
      getAtCondition(via, cond),
      getAtCondition(to, cond)
    )
    if (g) result[cond] = g
  }
  return Object.keys(result).length > 0 ? result : undefined
}

// ── Box Shadows (ring, inset-ring, inset-shadow, shadow) ──────────────

function buildBoxShadow(p: {
  ring?: string
  ringColor?: string
  ringInset?: boolean
  insetRingWidth?: string
  insetRingColor?: string
  insetShadowGeom?: string
  insetShadowDefColor?: string
  insetShadowColor?: string
  shadow?: string
}): string | null {
  const shadows: string[] = []
  if (p.insetShadowGeom) {
    const color = p.insetShadowColor || p.insetShadowDefColor || 'rgb(0 0 0 / 0.05)'
    shadows.push(`${p.insetShadowGeom} ${color}`.trim())
  }
  if (p.insetRingWidth != null) {
    const color = p.insetRingColor || 'currentColor'
    shadows.push(`inset 0 0 0 ${p.insetRingWidth} ${color}`)
  }
  if (p.ring != null) {
    const inset = p.ringInset ? 'inset ' : ''
    const color = p.ringColor || 'currentColor'
    shadows.push(`${inset}0 0 0 ${p.ring} ${color}`)
  }
  if (p.shadow && p.shadow !== 'none') {
    shadows.push(p.shadow)
  }
  return shadows.length > 0 ? shadows.join(', ') : null
}

function resolveBoxShadow(props: Record<string, any>): any {
  const ring =
    props.__ring ??
    (props.ring != null
      ? typeof props.ring === 'number'
        ? `${props.ring}px`
        : props.ring
      : undefined)
  const ringColor = props.__ringColor ?? props.ringColor
  const ringInset = props.__ringInset ?? props.ringInset
  const insetRingWidth = props.__insetRingWidth
  const insetRingColor = props.__insetRingColor
  const insetShadowGeom = props.__insetShadowGeometry
  const insetShadowDefColor = props.__insetShadowDefaultColor
  const insetShadowColor = props.__insetShadowColor
  const shadow = props.__shadow ?? props.__existingShadow ?? props.boxShadow

  if (ring == null && insetRingWidth == null && insetShadowGeom == null) {
    return undefined
  }

  const allVals = [
    ring,
    ringColor,
    ringInset,
    insetRingWidth,
    insetRingColor,
    insetShadowGeom,
    insetShadowColor,
    shadow,
  ]

  if (!hasConditions(...allVals)) {
    return buildBoxShadow({
      ring,
      ringColor,
      ringInset,
      insetRingWidth,
      insetRingColor,
      insetShadowGeom,
      insetShadowDefColor,
      insetShadowColor,
      shadow,
    })
  }

  const conditions = getConditions(...allVals)
  const result: Record<string, any> = {}
  for (const cond of conditions) {
    const s = buildBoxShadow({
      ring: getAtCondition(ring, cond),
      ringColor: getAtCondition(ringColor, cond),
      ringInset: getAtCondition(ringInset, cond),
      insetRingWidth: getAtCondition(insetRingWidth, cond),
      insetRingColor: getAtCondition(insetRingColor, cond),
      insetShadowGeom: getAtCondition(insetShadowGeom, cond),
      insetShadowDefColor: getAtCondition(insetShadowDefColor, cond),
      insetShadowColor: getAtCondition(insetShadowColor, cond),
      shadow: getAtCondition(shadow, cond),
    })
    if (s) result[cond] = s
  }
  return Object.keys(result).length > 0 ? result : undefined
}

// ── Filters & Drop Shadow ─────────────────────────────────────────────

const filterOrderList = [
  ['__filter_blur', 'blur'],
  ['__filter_brightness', 'brightness'],
  ['__filter_contrast', 'contrast'],
  ['__filter_grayscale', 'grayscale'],
  ['__filter_hueRotate', 'hue-rotate'],
  ['__filter_invert', 'invert'],
  ['__filter_saturate', 'saturate'],
  ['__filter_sepia', 'sepia'],
] as const

const filterPropList = [
  '__filter_blur',
  '__filter_brightness',
  '__filter_contrast',
  '__filter_grayscale',
  '__filter_hueRotate',
  '__filter_invert',
  '__filter_saturate',
  '__filter_sepia',
  '__dropShadowGeometry',
  '__dropShadowColor',
] as const

function buildFilter(p: Record<string, any>): string | null {
  const parts: string[] = []
  for (const [propKey, cssName] of filterOrderList) {
    const val = p[propKey]
    if (val != null && val !== '') {
      parts.push(`${cssName}(${val})`)
    }
  }
  if (p.__dropShadowGeometry) {
    const color = p.__dropShadowColor || p.__dropShadowDefaultColor || 'rgb(0 0 0 / 0.15)'
    parts.push(`drop-shadow(${p.__dropShadowGeometry} ${color})`.trim())
  }
  return parts.length > 0 ? parts.join(' ') : null
}

function resolveFilter(props: Record<string, any>): any {
  const vals = filterPropList.map((k) => props[k])
  if (!vals.some((v) => v != null)) return undefined

  if (!hasConditions(...vals)) {
    return buildFilter(props)
  }

  const conditions = getConditions(...vals)
  const result: Record<string, any> = {}
  for (const cond of conditions) {
    const scopedProps: Record<string, any> = {}
    for (const k of filterPropList) {
      scopedProps[k] = getAtCondition(props[k], cond)
    }
    scopedProps.__dropShadowDefaultColor = props.__dropShadowDefaultColor
    const f = buildFilter(scopedProps)
    if (f) result[cond] = f
  }
  return Object.keys(result).length > 0 ? result : undefined
}

// ── Transforms ────────────────────────────────────────────────────────

const transformOrderList = [
  ['__transform_perspective', 'perspective'],
  ['__transform_rotateX', 'rotateX'],
  ['__transform_rotateY', 'rotateY'],
  ['__transform_rotateZ', 'rotateZ'],
  ['__transform_skewX', 'skewX'],
  ['__transform_skewY', 'skewY'],
] as const

const transformPropList = [
  '__transform_perspective',
  '__transform_rotateX',
  '__transform_rotateY',
  '__transform_rotateZ',
  '__transform_skewX',
  '__transform_skewY',
] as const

function buildTransform(p: Record<string, any>): string | null {
  const parts: string[] = []
  for (const [propKey, cssName] of transformOrderList) {
    const val = p[propKey]
    if (val != null && val !== '') {
      parts.push(`${cssName}(${val})`)
    }
  }
  return parts.length > 0 ? parts.join(' ') : null
}

function resolveTransform(props: Record<string, any>): any {
  const vals = transformPropList.map((k) => props[k])
  if (!vals.some((v) => v != null)) return undefined

  if (!hasConditions(...vals)) {
    return buildTransform(props)
  }

  const conditions = getConditions(...vals)
  const result: Record<string, any> = {}
  for (const cond of conditions) {
    const scopedProps: Record<string, any> = {}
    for (const k of transformPropList) {
      scopedProps[k] = getAtCondition(props[k], cond)
    }
    const t = buildTransform(scopedProps)
    if (t) result[cond] = t
  }
  return Object.keys(result).length > 0 ? result : undefined
}

// ── Text Shadows ──────────────────────────────────────────────────────

function resolveTextShadow(props: Record<string, any>): Record<string, any> | undefined {
  const preset = props.__textShadow_preset
  const color = props.__textShadow_color
  if (!preset && !color) return undefined

  const res: Record<string, any> = {}
  if (preset) {
    res.textShadowOffset = preset.offset
    res.textShadowRadius = preset.radius
    res.textShadowColor = color || preset.defaultColor
  } else if (color) {
    res.textShadowColor = color
  }
  return res
}

// ── Master Resolver ───────────────────────────────────────────────────

export function composedResolver(
  props: Record<string, any>,
  _env?: any
): Record<string, any> | null | undefined {
  let result: Record<string, any> | null = null

  const bg = resolveGradient(props)
  if (bg != null) (result ??= {}).backgroundImage = bg

  const shadow = resolveBoxShadow(props)
  if (shadow != null) (result ??= {}).boxShadow = shadow

  const filter = resolveFilter(props)
  if (filter != null) (result ??= {}).filter = filter

  const transform = resolveTransform(props)
  if (transform != null) (result ??= {}).transform = transform

  const textShadow = resolveTextShadow(props)
  if (textShadow != null) Object.assign((result ??= {}), textShadow)

  return result
}
