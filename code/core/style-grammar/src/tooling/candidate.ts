import { namedCssColors } from '../runtime/namedCssColors'
import {
  grammarEntries,
  fontWeightNames,
  insetAxisProps,
  prefixToEntries,
  propToGrammarEntry,
  radiusCornerProps,
  sizeUtilityProps,
  standaloneValueProps,
  textAlignKeywords,
  wholeClassConveniences,
  wholeClassUtilities,
  type GrammarEntry,
  type TokenCategory,
} from './registry'
import {
  canonicalClauseModifier,
  containerModifierSizeEnd,
  parseGroupModifier,
} from '../runtime/clauseIdentity'
import {
  compileModifierVocabulary,
  modifierKindMedia,
  type CompiledModifierVocabulary,
} from '../runtime/modifierVocabulary'
import { splitColorOpacitySuffix } from '../runtime/colorOpacity'
import { getSafeAreaEdge } from '../runtime/safeAreaVariables'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export interface GrammarConfigView {
  shorthands?: Readonly<Record<string, string>>
  mediaNames?: Names
  themeNames?: Names
  platformNames?: Names
  tokenNames?: Partial<Record<TokenCategory, Names>>
  /**
   * the media keys that measure a size, so `@key:` is a meaningful container
   * query. derived by createGrammarConfigView when the media input carries
   * query information; absent means UNKNOWN, and the modifier registry then
   * refuses container claims with a diagnostic rather than over-claiming
   */
  containerSizeNames?: readonly string[]
}

export interface ParsedCandidate {
  candidate: string
  base: string
  modifiers: readonly string[]
  negative: boolean
  kind: 'utility' | 'dynamic'
  valueKind: 'token' | 'arbitrary' | 'enum' | 'convenience'
  properties?: Readonly<Record<string, string | number>>
  entry?: GrammarEntry
  prefix?: string
  rawValue?: string
  arbitrary?: boolean
  convenience?: string
}

export type CandidateClassification =
  | { kind: 'tamagui'; parsed: ParsedCandidate }
  | { kind: 'passthrough'; reason: string }

const sizingConveniences = new Set(['full', 'auto', 'screen', 'min', 'max', 'fit'])
const fontGenerics = new Set(['sans', 'serif', 'mono'])
const numericPattern = /^\d+(?:\.\d+)?$/
const extraPrefixes = [
  'border-x',
  'border-y',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-s',
  'rounded-e',
  'inset-x',
  'inset-y',
  'size',
  'translate',
]
const negativeTokenProps = new Set([
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlockStart',
  'marginBlockEnd',
  'marginHorizontal',
  'marginVertical',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'insetInlineStart',
  'insetInlineEnd',
  'insetBlockStart',
  'insetBlockEnd',
  'start',
  'end',
  'x',
  'y',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'skewX',
  'skewY',
  'order',
  'scale',
  'scaleX',
  'scaleY',
  'letterSpacing',
  'outlineOffset',
])
const positionSpaceProps = new Set([
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'insetInlineStart',
  'insetInlineEnd',
  'insetBlockStart',
  'insetBlockEnd',
  'start',
  'end',
])
const borderWidthKeywords = new Set(['thin', 'medium', 'thick'])
const ambiguousCssKeywords = new Set([
  'auto',
  'dashed',
  'dotted',
  'double',
  'groove',
  'hidden',
  'inherit',
  'initial',
  'inset',
  'none',
  'outset',
  'revert',
  'revert-layer',
  'ridge',
  'solid',
  'unset',
])
const cssLengthUnits =
  '(?:px|em|rem|ex|ch|cap|ic|lh|rlh|vw|vh|vmin|vmax|svw|svh|svmin|svmax|lvw|lvh|lvmin|lvmax|dvw|dvh|dvmin|dvmax|cm|mm|q|in|pt|pc)'
const cssLengthPattern = new RegExp(`^-?(?:\\d+|\\d*\\.\\d+)${cssLengthUnits}$`, 'i')

function hasName(names: Names | undefined, name: string): boolean {
  if (!names) return false
  if (Array.isArray(names)) return names.includes(name)
  if (names instanceof Set) return names.has(name)
  return name in names
}

function splitCandidate(candidate: string): { modifiers: string[]; base: string } | null {
  const parts: string[] = []
  let current = ''
  let bracketDepth = 0
  let escaped = false
  for (const char of candidate) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }
    if (char === '\\') {
      current += char
      escaped = true
      continue
    }
    if (char === '[') bracketDepth++
    if (char === ']') bracketDepth--
    if (char === ':' && bracketDepth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  if (!current || bracketDepth !== 0) return null
  return { modifiers: parts, base: current }
}

const modifierVocabularyCache = new WeakMap<
  GrammarConfigView,
  CompiledModifierVocabulary
>()
const modifierKindGroup = 5
const modifierKindContainer = 6

function getModifierVocabulary(config: GrammarConfigView): CompiledModifierVocabulary {
  let vocabulary = modifierVocabularyCache.get(config)
  if (!vocabulary) {
    vocabulary = compileModifierVocabulary(config)
    modifierVocabularyCache.set(config, vocabulary)
  }
  return vocabulary
}

function modifierKindCode(modifier: string, config: GrammarConfigView): number {
  const vocabulary = getModifierVocabulary(config)
  const exact = vocabulary[modifier]
  if (exact !== undefined) return exact & 7
  if (parseGroupModifier(modifier)) return modifierKindGroup
  const sizeEnd = containerModifierSizeEnd(modifier)
  if (sizeEnd === -1) return 0
  const size = modifier.slice(1, sizeEnd)
  return (vocabulary[size] & 7) === modifierKindMedia &&
    (config.containerSizeNames === undefined || hasName(config.containerSizeNames, size))
    ? modifierKindContainer
    : 0
}

function normalizeModifiers(
  modifiers: readonly string[],
  config: GrammarConfigView
): string[] | null {
  const normalized: string[] = []
  const seen = new Set<number>()
  for (const modifier of modifiers) {
    const canonical = canonicalClauseModifier(modifier)
    const kind = modifierKindCode(canonical, config)
    if (!kind || seen.has(kind)) return null
    seen.add(kind)
    normalized.push(canonical)
  }
  return normalized
}

function hasTokenDomain(config: GrammarConfigView, category: TokenCategory): boolean {
  return config.tokenNames?.[category] !== undefined
}

export function hasTokenName(
  config: GrammarConfigView,
  category: TokenCategory,
  name: string
): boolean {
  return resolveTokenName(config, category, name) !== null
}

// Tailwind spells half-steps as `0.5`; some Tamagui configs use `0-5`.
export function decimalHalfTokenAlias(name: string): string | null {
  const match = /^(-?\d+)\.5$/.exec(name)
  return match ? `${match[1]}-5` : null
}

export function resolveTokenName(
  config: GrammarConfigView,
  category: TokenCategory,
  name: string
): string | null {
  if (hasName(config.tokenNames?.[category], name)) return name
  const alias = decimalHalfTokenAlias(name)
  return alias !== null && hasName(config.tokenNames?.[category], alias) ? alias : null
}

function entriesForProps(props: readonly string[]): GrammarEntry[] {
  const byProp = new Map(grammarEntries.map((entry) => [entry.prop, entry]))
  const out: GrammarEntry[] = []
  for (const prop of props) {
    const entry = byProp.get(prop)
    if (entry) out.push(entry)
  }
  return out
}

function resolveEntries(
  prefix: string,
  config: GrammarConfigView
): readonly GrammarEntry[] {
  const registered = prefixToEntries[prefix]
  if (prefix === 'text') {
    return entriesForProps(['fontSize', 'textAlign', 'color'])
  }
  if (registered) return registered
  if (prefix === 'border-x' || prefix === 'border-y') {
    const sides = prefix === 'border-x' ? ['Left', 'Right'] : ['Top', 'Bottom']
    return entriesForProps(
      sides.flatMap((side) => [`border${side}Width`, `border${side}Color`])
    )
  }
  if (prefix === 'size') {
    return entriesForProps(sizeUtilityProps)
  }
  if (prefix === 'inset-x' || prefix === 'inset-y') {
    return entriesForProps(insetAxisProps[prefix.slice('inset-'.length)])
  }
  if (prefix === 'translate') {
    return entriesForProps(['x', 'y'])
  }
  if (prefix.startsWith('rounded-')) {
    const props = radiusCornerProps[prefix.slice('rounded-'.length)]
    return props ? entriesForProps(props) : []
  }
  const expanded = config.shorthands?.[prefix]
  if (!expanded) return []
  return grammarEntries.filter((entry) => entry.prop === expanded)
}

function findPrefix(base: string, config: GrammarConfigView): string | null {
  const prefixes = new Set(Object.keys(prefixToEntries))
  for (const prefix of extraPrefixes) prefixes.add(prefix)
  for (const shorthand in config.shorthands) prefixes.add(shorthand)
  let found: string | null = null
  for (const prefix of prefixes) {
    if (base.startsWith(`${prefix}-`) && (!found || prefix.length > found.length)) {
      found = prefix
    }
  }
  return found
}

function arbitraryInner(rawValue: string): string | null {
  if (rawValue.length <= 2 || rawValue[0] !== '[' || rawValue.at(-1) !== ']') {
    return null
  }
  const inner = rawValue.slice(1, -1)
  return arbitraryValueIsBalanced(decodeArbitrary(inner)) ? inner : null
}

function arbitraryValueIsBalanced(value: string): boolean {
  const opening = new Set(['(', '[', '{'])
  const matching: Readonly<Record<string, string>> = { ')': '(', ']': '[', '}': '{' }
  const stack: string[] = []
  let quote = ''
  let escaped = false
  for (const char of value) {
    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\') {
      escaped = true
      continue
    }
    if (quote) {
      if (char === quote) quote = ''
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (opening.has(char)) {
      stack.push(char)
      continue
    }
    const expected = matching[char]
    if (expected && stack.pop() !== expected) return false
  }
  return !escaped && !quote && stack.length === 0
}

function fractionIsValid(value: string): boolean {
  const fraction = /^(\d+)\/(\d+)$/.exec(value)
  return !!fraction && Number(fraction[2]) !== 0
}

function arbitraryTextKind(value: string): 'fontSize' | 'color' | null {
  if (/^-?(?:\d+|\d*\.\d+)$/.test(value)) return 'fontSize'
  if (cssLengthPattern.test(value) || /^(?:calc|min|max|clamp)\(/.test(value)) {
    return 'fontSize'
  }
  if (ambiguousCssKeywords.has(value) || value.startsWith('var(')) return null
  if (
    value.startsWith('#') ||
    /^(?:rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/.test(value) ||
    namedCssColors.has(value.toLowerCase())
  ) {
    return 'color'
  }
  // any other bare word is a font size the way Tailwind reads `text-[...]`: a
  // raw fontSize value the converter could not match to a token round-trips
  // here (`fontSize="body"` -> `text-[body]`)
  if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)) return 'fontSize'
  return null
}

function isWidthColorPrefix(prefix: string): boolean {
  return prefix.startsWith('border') || prefix === 'outline'
}

function arbitraryBorderKind(value: string): 'width' | 'color' | null {
  if (/^-?(?:\d+|\d*\.\d+)$/.test(value)) return 'width'
  if (cssLengthPattern.test(value) || borderWidthKeywords.has(value)) return 'width'
  if (/^(?:calc|min|max|clamp)\(/.test(value)) return 'width'
  if (ambiguousCssKeywords.has(value) || value.startsWith('var(')) return null
  if (
    value.startsWith('#') ||
    /^(?:rgb|hsl|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/.test(value) ||
    /^[a-zA-Z][a-zA-Z0-9-]*$/.test(value)
  ) {
    return 'color'
  }
  return null
}

function tokenLookupName(category: TokenCategory, value: string): string {
  if (category !== 'color') return value
  const suffix = splitColorOpacitySuffix(value)
  return suffix.kind === 'none' ? value : suffix.name
}

function chooseEntry(
  entries: readonly GrammarEntry[],
  prefix: string,
  rawValue: string,
  negative: boolean,
  config: GrammarConfigView
): {
  entry: GrammarEntry
  valueKind: ParsedCandidate['valueKind']
  convenience?: string
} | null {
  if (getSafeAreaEdge(rawValue)) {
    const entry = entries.find(
      ({ tokenCategory }) =>
        tokenCategory === 'space' ||
        tokenCategory === 'size' ||
        tokenCategory === 'radius' ||
        tokenCategory === 'fontSize' ||
        tokenCategory === 'lineHeight' ||
        tokenCategory === 'letterSpacing'
    )
    if (entry) {
      return { entry, valueKind: 'convenience', convenience: 'safe-area' }
    }
  }

  const arbitrary = arbitraryInner(rawValue)
  if (arbitrary !== null) {
    if (!arbitrary) return null
    if (isWidthColorPrefix(prefix)) {
      const width = entries.find((entry) => entry.prop.endsWith('Width'))
      const color = entries.find((entry) => entry.prop.endsWith('Color'))
      const kind = arbitraryBorderKind(decodeArbitrary(arbitrary))
      if (!kind || !width || !color) return null
      return {
        entry: kind === 'width' ? width : color,
        valueKind: 'arbitrary',
      }
    }
    if (prefix === 'text') {
      const kind = arbitraryTextKind(decodeArbitrary(arbitrary))
      const fontSize = entries.find((entry) => entry.prop === 'fontSize')
      const color = entries.find((entry) => entry.prop === 'color')
      if (kind === 'fontSize' && fontSize) {
        return { entry: fontSize, valueKind: 'arbitrary' }
      }
      if (kind === 'color' && color) {
        return { entry: color, valueKind: 'arbitrary' }
      }
      return null
    }
    if (prefix === 'font') {
      return {
        entry: entries.find((entry) => entry.prop === 'fontFamily')!,
        valueKind: 'arbitrary',
      }
    }
    return { entry: entries[0], valueKind: 'arbitrary' }
  }

  if (prefix === 'text') {
    const fontSize = entries.find((entry) => entry.prop === 'fontSize')
    if (fontSize && hasTokenName(config, 'fontSize', rawValue)) {
      return { entry: fontSize, valueKind: 'token' }
    }
    if (textAlignKeywords.has(rawValue)) {
      return {
        entry: entries.find((entry) => entry.prop === 'textAlign')!,
        valueKind: 'enum',
      }
    }
    const color = entries.find((entry) => entry.prop === 'color')
    if (color && rawValue === 'transparent') {
      return { entry: color, valueKind: 'enum' }
    }
    const colorName = tokenLookupName('color', rawValue)
    if (color && hasTokenName(config, 'color', colorName)) {
      return { entry: color, valueKind: 'token' }
    }
    return null
  }

  if (prefix === 'font') {
    const fontFamily = entries.find((entry) => entry.prop === 'fontFamily')
    const fontWeight = entries.find((entry) => entry.prop === 'fontWeight')
    if (!fontFamily) return null
    const matchesFamily = hasTokenName(config, 'fontFamily', rawValue)
    const matchesWeight = fontWeight && hasTokenName(config, 'fontWeight', rawValue)
    // a name configured as both a family and a weight is ambiguous, like the
    // border width/color rule above
    if (matchesFamily && matchesWeight) return null
    if (matchesFamily) {
      return { entry: fontFamily, valueKind: 'token' }
    }
    if (matchesWeight) {
      return { entry: fontWeight, valueKind: 'token' }
    }
    return fontGenerics.has(rawValue)
      ? { entry: fontFamily, valueKind: 'convenience', convenience: 'font-generic' }
      : null
  }

  if (isWidthColorPrefix(prefix)) {
    const width = entries.find((entry) => entry.prop.endsWith('Width'))
    const color = entries.find((entry) => entry.prop.endsWith('Color'))
    const token = negative ? `-${rawValue}` : rawValue
    const widthCategory = width?.tokenCategory || 'space'
    const matchesWidth = width && hasTokenName(config, widthCategory, token)
    const colorName = tokenLookupName('color', rawValue)
    const matchesColor = color && hasTokenName(config, 'color', colorName)
    if (matchesWidth && matchesColor) return null
    if (matchesWidth) {
      return { entry: width, valueKind: 'token' }
    }
    if (matchesColor) {
      return { entry: color, valueKind: 'token' }
    }
    if (color && rawValue === 'transparent') {
      return { entry: color, valueKind: 'enum' }
    }
    return null
  }

  if (numericPattern.test(rawValue)) {
    const angle = entries.find((entry) => entry.conveniences?.includes('angle'))
    if (angle) {
      return { entry: angle, valueKind: 'convenience', convenience: 'angle' }
    }
    if (prefix === 'flex') {
      const flex = entries.find((entry) => entry.prop === 'flex')
      if (flex)
        return { entry: flex, valueKind: 'convenience', convenience: 'flex-bundle' }
    }
    if (prefix === 'grow') {
      const grow = entries.find((entry) => entry.prop === 'flexGrow')
      if (grow) return { entry: grow, valueKind: 'convenience', convenience: 'integer' }
    }
    if (prefix === 'shrink') {
      const shrink = entries.find((entry) => entry.prop === 'flexShrink')
      if (shrink)
        return { entry: shrink, valueKind: 'convenience', convenience: 'integer' }
    }
    if (prefix === 'line-clamp') {
      const clamp = entries.find((entry) => entry.prop === 'numberOfLines')
      if (clamp) return { entry: clamp, valueKind: 'convenience', convenience: 'integer' }
    }
    // grid utilities: grid-cols-3, col-span-2, col-start-1, row-span-3, etc.
    if (
      prefix === 'grid-cols' ||
      prefix === 'col-span' ||
      prefix === 'col-start' ||
      prefix === 'col-end' ||
      prefix === 'row-span' ||
      prefix === 'row-start' ||
      prefix === 'row-end'
    ) {
      const entry = entries[0]
      if (entry) return { entry, valueKind: 'convenience', convenience: 'integer' }
    }
  }

  for (const entry of entries) {
    if (entry.tokenCategory) {
      if (entry.tokenCategory === 'color' && rawValue === 'transparent') {
        return { entry, valueKind: 'enum' }
      }
      if (entry.tokenCategory === 'radius' && rawValue === 'none') {
        return { entry, valueKind: 'convenience', convenience: 'zero' }
      }
      const name = negative ? `-${rawValue}` : rawValue
      const tokenName = tokenLookupName(entry.tokenCategory, name)
      if (hasTokenName(config, entry.tokenCategory, tokenName)) {
        return { entry, valueKind: 'token' }
      }
      if (
        entry.tokenCategory === 'size' &&
        (sizingConveniences.has(rawValue) || fractionIsValid(rawValue))
      ) {
        return { entry, valueKind: 'convenience', convenience: 'sizing-keyword' }
      }
      if (
        positionSpaceProps.has(entry.prop) &&
        (rawValue === 'full' || rawValue === 'auto' || fractionIsValid(rawValue))
      ) {
        return { entry, valueKind: 'convenience', convenience: 'sizing-keyword' }
      }
      if (entry.tokenCategory === 'zIndex' && numericPattern.test(rawValue)) {
        return { entry, valueKind: 'convenience', convenience: 'integer' }
      }
      continue
    }
    if (
      prefix === 'opacity' ||
      prefix === 'scale' ||
      prefix === 'scale-x' ||
      prefix === 'scale-y'
    ) {
      if (numericPattern.test(rawValue)) {
        return { entry, valueKind: 'convenience', convenience: 'percentage' }
      }
      continue
    }
    if (entry.prop === 'zIndex' && numericPattern.test(rawValue)) {
      return { entry, valueKind: 'convenience', convenience: 'integer' }
    }
    if (entry.conveniences?.includes('integer') && numericPattern.test(rawValue)) {
      return { entry, valueKind: 'convenience', convenience: 'integer' }
    }
  }
  return null
}

export function parseCandidate(
  candidate: string,
  config: GrammarConfigView
): ParsedCandidate | null {
  const split = splitCandidate(candidate)
  if (!split) return null
  const modifiers = normalizeModifiers(split.modifiers, config)
  if (!modifiers) return null

  const negative = split.base[0] === '-'
  const core = negative ? split.base.slice(1) : split.base
  const prefix = findPrefix(core, config)
  let dynamic:
    | {
        prefix: string
        rawValue: string
        selected: NonNullable<ReturnType<typeof chooseEntry>>
      }
    | undefined
  if (prefix) {
    const rawValue = core.slice(prefix.length + 1)
    if (rawValue) {
      const entries = resolveEntries(prefix, config)
      const selected = chooseEntry(entries, prefix, rawValue, negative, config)
      if (
        selected &&
        (!negative ||
          (negativeTokenProps.has(selected.entry.prop) &&
            (selected.valueKind === 'token' ||
              selected.convenience === 'angle' ||
              selected.convenience === 'percentage' ||
              selected.convenience === 'integer')))
      ) {
        dynamic = { prefix, rawValue, selected }
        // An exact configured token owns its spelling before a reserved whole utility. Other
        // dynamic forms defer to the whole utility and are used only when no whole form exists.
        if (selected.valueKind === 'token') {
          return {
            candidate,
            base: split.base,
            modifiers,
            negative,
            kind: 'dynamic',
            prefix,
            rawValue,
            arbitrary: arbitraryInner(rawValue) !== null,
            entry: selected.entry,
            valueKind: selected.valueKind,
            convenience: selected.convenience,
          }
        }
      }
    }
  }

  const direct = wholeClassUtilities[split.base]
  if (
    !negative &&
    direct &&
    (split.base !== 'shadow' || hasTokenName(config, 'boxShadow', 'sm'))
  ) {
    const convenience = wholeClassConveniences[split.base]
    return {
      candidate,
      base: split.base,
      modifiers,
      kind: 'utility',
      valueKind: convenience ? 'convenience' : 'enum',
      properties: direct,
      convenience,
      negative: false,
    }
  }
  if (dynamic) {
    return {
      candidate,
      base: split.base,
      modifiers,
      negative,
      kind: 'dynamic',
      prefix: dynamic.prefix,
      rawValue: dynamic.rawValue,
      arbitrary: arbitraryInner(dynamic.rawValue) !== null,
      entry: dynamic.selected.entry,
      valueKind: dynamic.selected.valueKind,
      convenience: dynamic.selected.convenience,
    }
  }
  return null
}

export function classifyCandidate(
  candidate: string,
  config: GrammarConfigView
): CandidateClassification {
  const parsed = parseCandidate(candidate, config)
  return parsed
    ? { kind: 'tamagui', parsed }
    : { kind: 'passthrough', reason: 'not in the configured Tamagui grammar' }
}

export interface FormatCandidateInput {
  prop: string
  value: string
  valueKind: ParsedCandidate['valueKind']
  modifiers?: readonly string[]
}

function tokenValidationConfig(
  entry: GrammarEntry,
  value: string,
  config: GrammarConfigView | undefined
): GrammarConfigView {
  const tokenNames: Partial<Record<TokenCategory, Names>> = {
    ...config?.tokenNames,
  }
  const category = entry.tokenCategory!
  if (tokenNames[category] === undefined) {
    tokenNames[category] = [tokenLookupName(category, value)]
  }
  for (const other of prefixToEntries[entry.prefix] || []) {
    if (other.tokenCategory && tokenNames[other.tokenCategory] === undefined) {
      tokenNames[other.tokenCategory] = []
    }
  }
  return { ...config, tokenNames }
}

export function formatCandidate(
  { prop, value, valueKind, modifiers = [] }: FormatCandidateInput,
  config?: GrammarConfigView
): string | null {
  const entry = propToGrammarEntry[prop]
  if (!entry) return null
  if (valueKind === 'arbitrary' && value === '') return null
  const normalizedModifiers = normalizeModifiers(modifiers, config || {})
  if (!normalizedModifiers) return null

  if (valueKind === 'enum') {
    const whole = standaloneValueProps[prop]?.[value]
    if (whole) {
      const candidate = normalizedModifiers.length
        ? `${normalizedModifiers.join(':')}:${whole}`
        : whole
      if (config) {
        const parsed = parseCandidate(candidate, config)
        if (!parsed?.properties || parsed.properties[prop] !== value) return null
      }
      return candidate
    }
    if (prop === 'fontWeight') {
      const name = fontWeightNames[value]
      if (!name) return null
      const core = `font-${name}`
      if (String(wholeClassUtilities[core]?.fontWeight) !== value) return null
      const candidate = normalizedModifiers.length
        ? `${normalizedModifiers.join(':')}:${core}`
        : core
      if (config) {
        const parsed = parseCandidate(candidate, config)
        if (!parsed?.properties || String(parsed.properties.fontWeight) !== value) {
          return null
        }
      }
      return candidate
    }
  }
  if (!entry.prefix) return null
  if (valueKind === 'token') {
    if (!entry.tokenCategory) return null
    const sourceDomainKnown = !!config && hasTokenDomain(config, entry.tokenCategory)
    const lookupName = tokenLookupName(entry.tokenCategory, value)
    if (sourceDomainKnown && !hasTokenName(config!, entry.tokenCategory, lookupName))
      return null
    const colliding = prefixToEntries[entry.prefix].filter(
      (other) => other.prop !== prop && other.tokenCategory
    )
    if (colliding.length) {
      if (!config || !sourceDomainKnown) return null
      for (const other of colliding) {
        if (!hasTokenDomain(config, other.tokenCategory!)) return null
        if (hasTokenName(config, other.tokenCategory!, value)) return null
      }
    }
  }
  const formattedValue = valueKind === 'arbitrary' ? `[${encodeArbitrary(value)}]` : value
  const core =
    formattedValue[0] === '-' && formattedValue[1] !== '['
      ? `-${entry.prefix}-${formattedValue.slice(1)}`
      : formattedValue
        ? `${entry.prefix}-${formattedValue}`
        : entry.prefix
  const candidate = normalizedModifiers.length
    ? `${normalizedModifiers.join(':')}:${core}`
    : core
  const whole = wholeClassUtilities[core]
  if (whole) {
    if (valueKind === 'token') {
      if (!config || !hasTokenDomain(config, entry.tokenCategory!)) return null
    } else if (config) {
      const parsed = parseCandidate(candidate, config)
      if (parsed?.kind === 'utility') {
        return parsed.properties &&
          prop in parsed.properties &&
          String(parsed.properties[prop]) === value
          ? candidate
          : null
      }
      return parsed?.entry?.prop === prop && parsed.valueKind === valueKind
        ? candidate
        : null
    } else if (prop in whole && String(whole[prop]) === value) {
      return candidate
    } else {
      return null
    }
  }
  if (valueKind === 'token') {
    if (
      !hasTokenDomain(config || {}, entry.tokenCategory!) &&
      parseCandidate(candidate, config || {})
    ) {
      return null
    }
    const parsed = parseCandidate(candidate, tokenValidationConfig(entry, value, config))
    const parsedValue = parsed?.rawValue
      ? `${parsed.negative ? '-' : ''}${parsed.rawValue}`
      : null
    if (
      parsed?.kind !== 'dynamic' ||
      parsed.entry?.prop !== prop ||
      parsed.valueKind !== 'token' ||
      parsedValue !== value
    ) {
      return null
    }
    return candidate
  }
  const parsed = parseCandidate(candidate, config || {})
  if (!parsed || parsed.entry?.prop !== prop || parsed.valueKind !== valueKind)
    return null
  return candidate
}

export function encodeArbitrary(value: string): string {
  let encoded = ''
  for (const char of value) {
    if (char === '\\' || char === '_' || char === '[' || char === ']') {
      encoded += `\\${char}`
    } else if (/\s/.test(char)) {
      encoded += '_'
    } else {
      encoded += char
    }
  }
  return encoded
}

export function decodeArbitrary(value: string): string {
  let decoded = ''
  for (let index = 0; index < value.length; index++) {
    const char = value[index]
    if (char === '\\' && index + 1 < value.length) {
      decoded += value[++index]
    } else {
      decoded += char === '_' ? ' ' : char
    }
  }
  return decoded
}
