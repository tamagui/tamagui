// Tailwind-only multi-class composers. Not a public API.
//
// from/via/to and ring-* are not CSS properties. They only make sense while
// walking a Tailwind className. Regular Tamagui never imports this file.
//
// Cost: one first-char check on a candidate with no colon (p-4, flex). A bag is
// allocated only when a composer or a boxShadow class is actually seen, keyed
// by the per-walk sink so nested getSplitStyles cannot clobber each other.

import {
  plainValueToPayload,
  type FrontendClassPlanEntry,
  type FrontendClassSink,
} from '@tamagui/core/internal-runtime'
import {
  canonicalClauseModifier,
  splitColorOpacitySuffix,
} from '@tamagui/style-grammar/runtime'
import {
  classifyCandidate,
  decodeArbitrary,
  hasTokenName,
  type GrammarConfigView,
} from '@tamagui/style-grammar/tooling/candidate'
import { isAndroid, isWeb } from '@tamagui/constants'

type Layer = {
  direction?: string
  from?: string
  via?: string
  to?: string
  ringWidth?: string
  ringColor?: string
  ringInset?: boolean
  shadow?: string
  textShadow?: {
    offset: { width: number; height: number }
    radius: number
    defaultColor: string
  }
  textShadowColor?: string
}

type ComposerBag = {
  base: Layer
  variants: Map<string, Layer>
  transforms: Map<string, Map<string, unknown>>
  transformModifiers: Map<string, readonly string[]>
  filters: Map<string, Map<string, string>>
  filterModifiers: Map<string, readonly string[]>
}

const transformOrder = [
  'perspective',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
] as const
const transformProps = new Set<string>(transformOrder)
const filterOrder = [
  'blur',
  'brightness',
  'contrast',
  'grayscale',
  'hue-rotate',
  'invert',
  'saturate',
  'sepia',
] as const
const nativeTarget = !isWeb || process.env.TAMAGUI_TARGET === 'native'

const bags = new WeakMap<FrontendClassSink, ComposerBag>()

const linearTo: Record<string, string> = {
  t: 'to top',
  tr: 'to top right',
  r: 'to right',
  br: 'to bottom right',
  b: 'to bottom',
  bl: 'to bottom left',
  l: 'to left',
  tl: 'to top left',
}

const colorKeywords: Record<string, string> = {
  transparent: 'transparent',
  current: 'currentColor',
  inherit: 'inherit',
  black: 'black',
  white: 'white',
}

function createBag(): ComposerBag {
  return {
    base: {},
    variants: new Map(),
    transforms: new Map(),
    transformModifiers: new Map(),
    filters: new Map(),
    filterModifiers: new Map(),
  }
}

function getBag(sink: FrontendClassSink): ComposerBag {
  let bag = bags.get(sink)
  if (!bag) {
    bag = createBag()
    bags.set(sink, bag)
  }
  return bag
}

function lastUnbracketedColon(candidate: string): number {
  let colon = -1
  let bracketDepth = 0
  let escaped = false
  for (let index = 0; index < candidate.length; index++) {
    const char = candidate[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '[') bracketDepth++
    else if (char === ']') bracketDepth--
    else if (char === ':' && bracketDepth === 0) colon = index
  }
  return bracketDepth !== 0 ? -2 : colon
}

function splitModifiers(candidate: string, colon: number): string[] {
  const modifiers: string[] = []
  let start = 0
  let bracketDepth = 0
  let escaped = false
  for (let index = 0; index < colon; index++) {
    const char = candidate[index]
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (char === '[') bracketDepth++
    else if (char === ']') bracketDepth--
    else if (char === ':' && bracketDepth === 0) {
      modifiers.push(canonicalClauseModifier(candidate.slice(start, index)))
      start = index + 1
    }
  }
  modifiers.push(canonicalClauseModifier(candidate.slice(start, colon)))
  return modifiers
}

function composerKind(
  core: string
): 'from' | 'via' | 'to' | 'image' | 'ring' | 'filter' | 'text-shadow' | null {
  const first = core.charCodeAt(0)
  if (first === 102) return core.startsWith('from-') ? 'from' : null
  if (first === 118) return core.startsWith('via-') ? 'via' : null
  if (first === 116) {
    if (core.startsWith('text-shadow-')) return 'text-shadow'
    return core.startsWith('to-') ? 'to' : null
  }
  if (first === 98) {
    if (core.startsWith('bg-linear-to-')) return 'image'
    return core.startsWith('blur-') || core.startsWith('brightness-') ? 'filter' : null
  }
  if (first === 114) return core === 'ring' || core.startsWith('ring-') ? 'ring' : null
  if (first === 99) return core.startsWith('contrast-') ? 'filter' : null
  if (first === 103)
    return core === 'grayscale' || core.startsWith('grayscale-') ? 'filter' : null
  if (first === 104) return core.startsWith('hue-rotate-') ? 'filter' : null
  if (first === 105)
    return core === 'invert' || core.startsWith('invert-') ? 'filter' : null
  if (first === 115) {
    return core.startsWith('saturate-') || core === 'sepia' || core.startsWith('sepia-')
      ? 'filter'
      : null
  }
  return null
}

function filterPart(core: string): [name: string, value: string] | null {
  if (core.startsWith('blur-')) {
    const value = (
      {
        none: 0,
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        '2xl': 40,
        '3xl': 64,
      } as const
    )[core.slice(5)]
    return value === undefined ? null : ['blur', `${value}px`]
  }
  for (const name of ['brightness', 'contrast', 'saturate'] as const) {
    if (!core.startsWith(`${name}-`)) continue
    const value = core.slice(name.length + 1)
    if (!/^\d+$/.test(value)) return null
    return [name, `${value}%`]
  }
  for (const name of ['grayscale', 'invert', 'sepia'] as const) {
    if (core === name) return [name, '100%']
    if (!core.startsWith(`${name}-`)) continue
    const value = core.slice(name.length + 1)
    if (!/^\d+$/.test(value)) return null
    return [name, `${value}%`]
  }
  if (core.startsWith('hue-rotate-')) {
    const value = core.slice('hue-rotate-'.length)
    if (!/^\d+$/.test(value)) return null
    return ['hue-rotate', `${value}deg`]
  }
  return null
}

function noteFilter(
  sink: FrontendClassSink,
  bag: ComposerBag,
  part: [name: string, value: string],
  modifiers: readonly string[]
): void {
  const key = conditionKey(modifiers)
  let layer = bag.filters.get(key)
  if (!layer) {
    layer = new Map()
    bag.filters.set(key, layer)
  }
  layer.set(part[0], part[1])
  bag.filterModifiers.set(key, modifiers)

  const base = bag.filters.get('')
  for (const [condition, conditional] of bag.filters) {
    const values = condition ? new Map(base) : new Map<string, string>()
    for (const [name, value] of conditional) values.set(name, value)
    const filter = filterOrder
      .filter((name) => values.has(name))
      .map((name) => `${name}(${values.get(name)})`)
      .join(' ')
    emit(sink, 'filter', filter, bag.filterModifiers.get(condition) || [])
  }
}

function resolveColor(raw: string, config: GrammarConfigView): string | null {
  if (raw.length > 1 && raw[0] === '[' && raw[raw.length - 1] === ']') {
    const inner = decodeArbitrary(raw.slice(1, -1))
    return inner || null
  }
  if (raw.endsWith('%')) return null
  const keyword = colorKeywords[raw]
  if (keyword) return keyword
  const suffix = splitColorOpacitySuffix(raw)
  const name = suffix.kind === 'none' ? raw : suffix.name
  if (!hasTokenName(config, 'color', name)) return null
  return raw
}

function emit(
  sink: FrontendClassSink,
  property: string,
  value: unknown,
  modifiers: readonly string[]
): void {
  if (modifiers.length === 0) {
    sink([property, value])
    return
  }
  const payload = plainValueToPayload(value, property)
  if (payload === null) return
  let condition = modifiers[0]
  for (let index = 1; index < modifiers.length; index++) {
    condition += `:${modifiers[index]}`
  }
  sink([property, payload, condition, modifiers])
}

function conditionKey(modifiers: readonly string[]): string {
  if (modifiers.length === 0) return ''
  let key = modifiers[0]
  for (let index = 1; index < modifiers.length; index++) key += `:${modifiers[index]}`
  return key
}

function layerOf(bag: ComposerBag, key: string): Layer {
  if (!key) return bag.base
  let layer = bag.variants.get(key)
  if (!layer) {
    layer = {}
    bag.variants.set(key, layer)
  }
  return layer
}

function merged(bag: ComposerBag, key: string): Layer {
  if (!key) return bag.base
  const variant = bag.variants.get(key)
  if (!variant) return bag.base
  return {
    direction: variant.direction ?? bag.base.direction,
    from: variant.from ?? bag.base.from,
    via: variant.via ?? bag.base.via,
    to: variant.to ?? bag.base.to,
    ringWidth: variant.ringWidth ?? bag.base.ringWidth,
    ringColor: variant.ringColor ?? bag.base.ringColor,
    ringInset: variant.ringInset ?? bag.base.ringInset,
    shadow: variant.shadow ?? bag.base.shadow,
    textShadow: variant.textShadow ?? bag.base.textShadow,
    textShadowColor: variant.textShadowColor ?? bag.base.textShadowColor,
  }
}

function gradientCss(layer: Layer): string | null {
  if (!layer.direction || !(layer.from || layer.via || layer.to)) return null
  const from = layer.from || 'transparent'
  const to = layer.to || 'transparent'
  if (layer.via)
    return `linear-gradient(${layer.direction}, ${from}, ${layer.via}, ${to})`
  return `linear-gradient(${layer.direction}, ${from}, ${to})`
}

function ringCss(layer: Layer): string | null {
  if (layer.ringWidth == null) return null
  const color = layer.ringColor || 'currentColor'
  const inset = layer.ringInset ? 'inset ' : ''
  return `${inset}0 0 0 ${layer.ringWidth} ${color}`
}

function boxShadowCss(layer: Layer): string | null {
  const ring = ringCss(layer)
  if (!ring) return layer.shadow || null
  return layer.shadow ? `${ring}, ${layer.shadow}` : ring
}

/** Re-emit Tailwind's CSS-variable transform family in its fixed matrix order. */
export function noteTailwindTransform(
  sink: FrontendClassSink,
  entry: FrontendClassPlanEntry
): boolean {
  if (!transformProps.has(entry[0])) return false
  const bag = getBag(sink)
  const key = entry[2] || ''
  let layer = bag.transforms.get(key)
  if (!layer) {
    layer = new Map()
    bag.transforms.set(key, layer)
  }
  layer.set(entry[0], entry[1])
  bag.transformModifiers.set(key, entry[3] || [])

  const base = bag.transforms.get('')
  for (const [condition, conditional] of bag.transforms) {
    const values = condition ? new Map(base) : new Map<string, unknown>()
    for (const [property, value] of conditional) values.set(property, value)
    const transform = transformOrder
      .filter((property) => values.has(property))
      .map((property) => {
        const value = values.get(property)
        return `${property}(${value})`
      })
      .join(' ')
    emit(sink, 'transform', transform, bag.transformModifiers.get(condition) || [])
  }
  return true
}

function flush(
  sink: FrontendClassSink,
  bag: ComposerBag,
  modifiers: readonly string[]
): void {
  const key = conditionKey(modifiers)
  const layer = merged(bag, key)
  const image = gradientCss(layer)
  if (image) emit(sink, 'backgroundImage', image, modifiers)
  const shadow = boxShadowCss(layer)
  if (shadow && layer.ringWidth != null) emit(sink, 'boxShadow', shadow, modifiers)
  if (layer.textShadow) {
    emit(sink, 'textShadowOffset', layer.textShadow.offset, modifiers)
    emit(sink, 'textShadowRadius', layer.textShadow.radius, modifiers)
    emit(
      sink,
      'textShadowColor',
      layer.textShadowColor || layer.textShadow.defaultColor,
      modifiers
    )
  } else if (layer.textShadowColor) {
    emit(sink, 'textShadowColor', layer.textShadowColor, modifiers)
  }
}

function flushDependents(sink: FrontendClassSink, bag: ComposerBag): void {
  for (const key of bag.variants.keys()) {
    flush(sink, bag, key.split(':'))
  }
}

function ringWidth(raw: string): string | null {
  if (raw === 'inset') return null
  if (/^\d+$/.test(raw)) return `${raw}px`
  if (raw.length > 1 && raw[0] === '[' && raw[raw.length - 1] === ']') {
    const inner = decodeArbitrary(raw.slice(1, -1))
    if (/^-?(?:\d+|\d*\.\d+)$/.test(inner)) return `${inner}px`
    if (/^-?(?:\d+|\d*\.\d+)px$/.test(inner)) return inner
    return null
  }
  return null
}

/**
 * Claim a from/via/to, bg-linear-to-*, or ring-* candidate. `undefined` means
 * this is not a composer (the existing class plan runs). A boolean is the same
 * preserveRaw signal as resolveClassName.
 */
export function tryCompose(
  candidate: string,
  config: GrammarConfigView,
  sink: FrontendClassSink
): boolean | null | undefined {
  const colon = candidate.indexOf(':') === -1 ? -1 : lastUnbracketedColon(candidate)
  if (colon === -2) return undefined
  const core = colon === -1 ? candidate : candidate.slice(colon + 1)
  if (!core) return undefined
  const kind = composerKind(core)
  if (kind == null) return undefined

  const modifiers = colon === -1 ? [] : splitModifiers(candidate, colon)
  const bag = getBag(sink)
  const layer = layerOf(bag, conditionKey(modifiers))

  if (kind === 'filter') {
    const part = filterPart(core)
    if (!part) return true
    // React Native 0.86 implements brightness on both native platforms. The
    // remaining CSS filter functions are Android-only, so iOS drops the class
    // explicitly instead of accepting a style that the host silently ignores.
    if (nativeTarget && part[0] !== 'brightness' && !isAndroid) return null
    noteFilter(sink, bag, part, modifiers)
    return false
  }

  if (kind === 'text-shadow') {
    const raw = core.slice('text-shadow-'.length)
    const geometry = (
      {
        '2xs': {
          offset: { width: 0, height: 1 },
          radius: 0,
          defaultColor: 'rgb(0 0 0 / 0.15)',
        },
        xs: {
          offset: { width: 0, height: 1 },
          radius: 1,
          defaultColor: 'rgb(0 0 0 / 0.2)',
        },
        none: {
          offset: { width: 0, height: 0 },
          radius: 0,
          defaultColor: 'transparent',
        },
      } as const
    )[raw as '2xs' | 'xs' | 'none']
    if (geometry) {
      // Conditional object-valued textShadowOffset cannot be represented by
      // the scalar native value program. Let Tailwind own web variants and
      // explicitly reject them on native instead of emitting a partial shadow.
      if (modifiers.length > 0) return nativeTarget ? null : undefined
      layer.textShadow = geometry
    } else {
      const resolved = resolveColor(raw, config)
      const classified = resolved == null ? classifyCandidate(core, config) : null
      const color =
        resolved ??
        (classified?.kind === 'tamagui' &&
        classified.parsed.entry?.prop === 'textShadowColor'
          ? raw
          : null)
      if (color == null) return undefined
      layer.textShadowColor = color
    }
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }

  if (kind === 'image') {
    const dir = linearTo[core.slice('bg-linear-to-'.length)]
    if (!dir) return true
    layer.direction = dir
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }

  if (kind === 'from' || kind === 'via' || kind === 'to') {
    const color = resolveColor(core.slice(kind.length + 1), config)
    if (color == null) return true
    layer[kind] = color
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }

  if (core === 'ring') {
    layer.ringWidth = '1px'
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }
  if (core === 'ring-inset') {
    layer.ringInset = true
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }
  const raw = core.slice('ring-'.length)
  const width = ringWidth(raw)
  if (width != null) {
    layer.ringWidth = width
    flush(sink, bag, modifiers)
    if (modifiers.length === 0) flushDependents(sink, bag)
    return false
  }
  const color = resolveColor(raw, config)
  if (color == null) return true
  layer.ringColor = color
  flush(sink, bag, modifiers)
  if (modifiers.length === 0) flushDependents(sink, bag)
  return false
}

/** Record a claimed boxShadow so a later ring can stack instead of clobbering. */
export function noteBoxShadow(
  sink: FrontendClassSink,
  value: unknown,
  modifiers: readonly string[] = []
): boolean {
  if (typeof value !== 'string' || value === 'unset') return false
  // Unresolved named tokens are identifiers and cannot be stacked into a CSS list.
  if (value.indexOf(' ') === -1 && value !== 'none' && !value.startsWith('inset')) {
    return false
  }
  const bag = getBag(sink)
  layerOf(bag, conditionKey(modifiers)).shadow = value === 'none' ? '' : value
  const layer = merged(bag, conditionKey(modifiers))
  if (layer.ringWidth == null) return false
  emit(sink, 'boxShadow', boxShadowCss(layer)!, modifiers)
  return true
}
