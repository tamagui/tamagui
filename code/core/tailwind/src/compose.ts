// Tailwind-only multi-class token mapper.
//
// Translates composed utility candidates (ring, gradient, filter, shadow,
// transform, text-shadow) into variant props (__ring, __gradient*, __filter_*,
// __transform_*, etc.) that are composed by `composedResolver`.
//
// Fully stateless: no mutable bags or WeakMaps.

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

const transformOrder = [
  'perspective',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
] as const
const transformProps = new Set<string>(transformOrder)

const nativeTarget = !isWeb || process.env.TAMAGUI_TARGET === 'native'

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

const dropShadowPresets = {
  xs: { geometry: '0 1px 1px', defaultColor: 'rgb(0 0 0 / 0.05)' },
  sm: { geometry: '0 1px 2px', defaultColor: 'rgb(0 0 0 / 0.15)' },
  md: { geometry: '0 3px 3px', defaultColor: 'rgb(0 0 0 / 0.12)' },
  lg: { geometry: '0 4px 4px', defaultColor: 'rgb(0 0 0 / 0.15)' },
  xl: { geometry: '0 9px 7px', defaultColor: 'rgb(0 0 0 / 0.1)' },
  '2xl': { geometry: '0 25px 25px', defaultColor: 'rgb(0 0 0 / 0.15)' },
  none: { geometry: '0 0 0', defaultColor: 'transparent' },
} as const

const textShadowPresets = {
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

const insetShadowPresets = {
  '2xs': { geometry: 'inset 0 1px 0', defaultColor: 'rgb(0 0 0 / 0.05)' },
  xs: { geometry: 'inset 0 1px 1px', defaultColor: 'rgb(0 0 0 / 0.05)' },
  sm: { geometry: 'inset 0 2px 4px', defaultColor: 'rgb(0 0 0 / 0.05)' },
  none: { geometry: '', defaultColor: 'transparent' },
} as const

const filterPropMap: Record<string, string> = {
  blur: '__filter_blur',
  brightness: '__filter_brightness',
  contrast: '__filter_contrast',
  grayscale: '__filter_grayscale',
  'hue-rotate': '__filter_hueRotate',
  invert: '__filter_invert',
  saturate: '__filter_saturate',
  sepia: '__filter_sepia',
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
):
  | 'from'
  | 'via'
  | 'to'
  | 'image'
  | 'ring'
  | 'inset-ring'
  | 'inset-shadow'
  | 'filter'
  | 'drop-shadow'
  | 'text-shadow'
  | null {
  const first = core.charCodeAt(0)
  if (first === 100) return core.startsWith('drop-shadow-') ? 'drop-shadow' : null
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
    return core.startsWith('inset-ring')
      ? 'inset-ring'
      : core.startsWith('inset-shadow-')
        ? 'inset-shadow'
        : core === 'invert' || core.startsWith('invert-')
          ? 'filter'
          : null
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
  const payload = plainValueToPayload(value, property) ?? (value as any)
  if (payload === null) return
  let condition = modifiers[0]
  for (let index = 1; index < modifiers.length; index++) {
    condition += `:${modifiers[index]}`
  }
  sink([property, payload, condition, modifiers])
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
 * Claim a from/via/to, bg-linear-to-*, filter, ring, inset, or drop-shadow candidate.
 * Emits variant props to the sink so `composedResolver` can compose them.
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

  if (kind === 'filter') {
    const part = filterPart(core)
    if (!part) return true
    if (nativeTarget && part[0] !== 'brightness' && !isAndroid) return null
    const prop = filterPropMap[part[0]]
    if (prop) emit(sink, prop, part[1], modifiers)
    return false
  }

  if (kind === 'drop-shadow') {
    if (nativeTarget && !isAndroid) return null
    const raw = core.slice('drop-shadow-'.length)
    const shadow = dropShadowPresets[raw as keyof typeof dropShadowPresets]
    if (shadow) {
      emit(sink, '__dropShadowGeometry', shadow.geometry, modifiers)
      emit(sink, '__dropShadowDefaultColor', shadow.defaultColor, modifiers)
    } else {
      const color = resolveColor(raw, config)
      if (color == null) return undefined
      emit(sink, '__dropShadowColor', color, modifiers)
    }
    return false
  }

  if (kind === 'text-shadow') {
    const raw = core.slice('text-shadow-'.length)
    const geometry = textShadowPresets[raw as keyof typeof textShadowPresets]
    if (geometry) {
      if (modifiers.length > 0) return nativeTarget ? null : undefined
      emit(sink, '__textShadow_preset', geometry, modifiers)
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
      emit(sink, '__textShadow_color', color, modifiers)
    }
    return false
  }

  if (kind === 'inset-ring') {
    const raw = core === 'inset-ring' ? '' : core.slice('inset-ring-'.length)
    const width = raw === '' ? '1px' : ringWidth(raw)
    if (width != null) {
      emit(sink, '__insetRingWidth', width, modifiers)
    } else {
      const color = resolveColor(raw, config)
      if (color == null) return undefined
      emit(sink, '__insetRingColor', color, modifiers)
    }
    return false
  }

  if (kind === 'inset-shadow') {
    const raw = core.slice('inset-shadow-'.length)
    const shadow = insetShadowPresets[raw as keyof typeof insetShadowPresets]
    if (shadow) {
      emit(sink, '__insetShadowGeometry', shadow.geometry, modifiers)
      emit(sink, '__insetShadowDefaultColor', shadow.defaultColor, modifiers)
    } else {
      const color = resolveColor(raw, config)
      if (color == null) return undefined
      emit(sink, '__insetShadowColor', color, modifiers)
    }
    return false
  }

  if (kind === 'image') {
    const dir = linearTo[core.slice('bg-linear-to-'.length)]
    if (!dir) return true
    emit(sink, '__gradientDirection', dir, modifiers)
    return false
  }

  if (kind === 'from' || kind === 'via' || kind === 'to') {
    const color = resolveColor(core.slice(kind.length + 1), config)
    if (color == null) return true
    const prop =
      kind === 'from'
        ? '__gradientFrom'
        : kind === 'via'
          ? '__gradientVia'
          : '__gradientTo'
    emit(sink, prop, color, modifiers)
    return false
  }

  if (core === 'ring') {
    emit(sink, '__ring', '1px', modifiers)
    return false
  }
  if (core === 'ring-inset') {
    emit(sink, '__ringInset', true, modifiers)
    return false
  }
  const raw = core.slice('ring-'.length)
  const width = ringWidth(raw)
  if (width != null) {
    emit(sink, '__ring', width, modifiers)
    return false
  }
  const color = resolveColor(raw, config)
  if (color == null) return true
  emit(sink, '__ringColor', color, modifiers)
  return false
}

/** Record transform properties as variant props for composedResolver. */
export function noteTailwindTransform(
  sink: FrontendClassSink,
  entry: FrontendClassPlanEntry
): boolean {
  if (!transformProps.has(entry[0])) return false
  emit(sink, `__transform_${entry[0]}`, entry[1], entry[3] || [])
  return true
}

/** Record a claimed boxShadow so composedResolver can stack ring + shadow. */
export function noteBoxShadow(
  sink: FrontendClassSink,
  value: unknown,
  modifiers: readonly string[] = []
): boolean {
  if (typeof value !== 'string' || value === 'unset') return false
  if (value.indexOf(' ') === -1 && value !== 'none' && !value.startsWith('inset')) {
    return false
  }
  emit(sink, '__shadow', value === 'none' ? 'none' : value, modifiers)
  return false
}
