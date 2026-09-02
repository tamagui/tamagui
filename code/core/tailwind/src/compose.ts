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
  type FrontendClassSink,
} from '@tamagui/core/internal-runtime'
import {
  canonicalClauseModifier,
  splitColorOpacitySuffix,
} from '@tamagui/style-grammar/runtime'
import {
  decodeArbitrary,
  hasTokenName,
  type GrammarConfigView,
} from '@tamagui/style-grammar/tooling/candidate'

type Layer = {
  direction?: string
  from?: string
  via?: string
  to?: string
  ringWidth?: string
  ringColor?: string
  ringInset?: boolean
  shadow?: string
}

type ComposerBag = {
  base: Layer
  variants: Map<string, Layer>
}

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
  return { base: {}, variants: new Map() }
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

function composerKind(core: string): 'from' | 'via' | 'to' | 'image' | 'ring' | null {
  const first = core.charCodeAt(0)
  if (first === 102) return core.startsWith('from-') ? 'from' : null
  if (first === 118) return core.startsWith('via-') ? 'via' : null
  if (first === 116) return core.startsWith('to-') ? 'to' : null
  if (first === 98) return core.startsWith('bg-linear-to-') ? 'image' : null
  if (first === 114) return core === 'ring' || core.startsWith('ring-') ? 'ring' : null
  return null
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
  value: string,
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
): boolean | undefined {
  const colon = candidate.indexOf(':') === -1 ? -1 : lastUnbracketedColon(candidate)
  if (colon === -2) return undefined
  const core = colon === -1 ? candidate : candidate.slice(colon + 1)
  if (!core) return undefined
  const kind = composerKind(core)
  if (kind == null) return undefined

  const modifiers = colon === -1 ? [] : splitModifiers(candidate, colon)
  const bag = getBag(sink)
  const layer = layerOf(bag, conditionKey(modifiers))

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
  // named tokens are idents; stacking them into a CSS list is invalid until
  // boxShadow tokens exist as CSS strings. Arbitrary shadows contain spaces.
  if (value.indexOf(' ') === -1 && value !== 'none' && !value.startsWith('inset')) {
    return false
  }
  const bag = getBag(sink)
  layerOf(bag, conditionKey(modifiers)).shadow = value
  const layer = merged(bag, conditionKey(modifiers))
  if (layer.ringWidth == null) return false
  emit(sink, 'boxShadow', boxShadowCss(layer)!, modifiers)
  return true
}
