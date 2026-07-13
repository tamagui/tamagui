import {
  grammarEntries,
  fontWeightNames,
  modifierAliases,
  prefixToEntries,
  pseudoToModifier,
  radiusCornerProps,
  standaloneValueProps,
  textAlignKeywords,
  wholeClassConveniences,
  wholeClassUtilities,
  type GrammarEntry,
  type TokenCategory,
} from './registry'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

export interface GrammarConfigView {
  shorthands?: Readonly<Record<string, string>>
  mediaNames?: Names
  themeNames?: Names
  platformNames?: Names
  tokenNames?: Partial<Record<TokenCategory, Names>>
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

const defaultModifiers = new Set(Object.values(pseudoToModifier))
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
]

function hasName(names: Names | undefined, name: string): boolean {
  if (!names) return false
  if (Array.isArray(names)) return names.includes(name)
  if (names instanceof Set) return names.has(name)
  return Object.prototype.hasOwnProperty.call(names, name)
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

type ModifierKind = 'pseudo' | 'media' | 'theme' | 'platform'

function modifierKind(modifier: string, config: GrammarConfigView): ModifierKind | null {
  const canonical = modifierAliases[modifier] || modifier
  if (defaultModifiers.has(canonical)) return 'pseudo'
  if (hasName(config.mediaNames, modifier)) return 'media'
  if (hasName(config.themeNames, modifier)) return 'theme'
  if (hasName(config.platformNames, modifier)) return 'platform'
  return null
}

function modifiersAreKnown(
  modifiers: readonly string[],
  config: GrammarConfigView
): boolean {
  const seen = new Set<ModifierKind>()
  for (const modifier of modifiers) {
    const kind = modifierKind(modifier, config)
    if (!kind || seen.has(kind)) return false
    seen.add(kind)
  }
  return true
}

function hasTokenDomain(config: GrammarConfigView, category: TokenCategory): boolean {
  return config.tokenNames?.[category] !== undefined
}

export function hasTokenName(
  config: GrammarConfigView,
  category: TokenCategory,
  name: string
): boolean {
  return hasName(config.tokenNames?.[category], name)
}

function resolveEntries(
  prefix: string,
  config: GrammarConfigView
): readonly GrammarEntry[] {
  const registered = prefixToEntries[prefix]
  if (registered) return registered
  if (prefix === 'border-x' || prefix === 'border-y') {
    const props =
      prefix === 'border-x'
        ? ['borderLeft', 'borderRight']
        : ['borderTop', 'borderBottom']
    return grammarEntries.filter((entry) =>
      props.some((prop) => entry.prop === `${prop}Width` || entry.prop === `${prop}Color`)
    )
  }
  if (prefix.startsWith('rounded-')) {
    const props = radiusCornerProps[prefix.slice('rounded-'.length)]
    return props ? grammarEntries.filter((entry) => props.includes(entry.prop)) : []
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
  const arbitrary = arbitraryInner(rawValue)
  if (arbitrary !== null) {
    if (!arbitrary) return null
    if (prefix.startsWith('border')) {
      const width = entries.find((entry) => entry.prop.endsWith('Width'))
      const color = entries.find((entry) => entry.prop.endsWith('Color'))
      return {
        entry: /^-?(?:\d+|\d*\.\d+)px$/.test(decodeArbitrary(arbitrary))
          ? width!
          : color!,
        valueKind: 'arbitrary',
      }
    }
    if (prefix === 'text') {
      return {
        entry: entries.find((entry) => entry.prop === 'fontSize')!,
        valueKind: 'arbitrary',
      }
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
    if (textAlignKeywords.has(rawValue)) {
      return {
        entry: entries.find((entry) => entry.prop === 'textAlign')!,
        valueKind: 'enum',
      }
    }
    const fontSize = entries.find((entry) => entry.prop === 'fontSize')
    return fontSize && hasTokenName(config, 'fontSize', rawValue)
      ? { entry: fontSize, valueKind: 'token' }
      : null
  }

  if (prefix === 'font') {
    const fontFamily = entries.find((entry) => entry.prop === 'fontFamily')
    if (!fontFamily) return null
    return fontGenerics.has(rawValue) || hasTokenName(config, 'fontFamily', rawValue)
      ? {
          entry: fontFamily,
          valueKind: fontGenerics.has(rawValue) ? 'convenience' : 'token',
          convenience: fontGenerics.has(rawValue) ? 'font-generic' : undefined,
        }
      : null
  }

  if (prefix.startsWith('border')) {
    const width = entries.find((entry) => entry.prop.endsWith('Width'))
    const color = entries.find((entry) => entry.prop.endsWith('Color'))
    const token = negative ? `-${rawValue}` : rawValue
    const matchesWidth = width && hasTokenName(config, 'space', token)
    const colorName = rawValue.replace(/\/\d+(?:\.\d+)?$/, '')
    const matchesColor = color && hasTokenName(config, 'color', colorName)
    if (matchesWidth && matchesColor) return null
    if (matchesWidth) {
      return { entry: width, valueKind: 'token' }
    }
    if (matchesColor) {
      return { entry: color, valueKind: 'token' }
    }
    return null
  }

  for (const entry of entries) {
    if (entry.tokenCategory) {
      const name = negative ? `-${rawValue}` : rawValue
      const tokenName =
        entry.tokenCategory === 'color' ? name.replace(/\/\d+(?:\.\d+)?$/, '') : name
      if (hasTokenName(config, entry.tokenCategory, tokenName)) {
        return { entry, valueKind: 'token' }
      }
      if (
        entry.tokenCategory === 'size' &&
        (sizingConveniences.has(rawValue) || /^\d+\/\d+$/.test(rawValue))
      ) {
        return { entry, valueKind: 'convenience', convenience: 'sizing-keyword' }
      }
      continue
    }
    if (prefix === 'opacity' || prefix === 'scale') {
      if (numericPattern.test(rawValue)) {
        return { entry, valueKind: 'convenience', convenience: 'percentage' }
      }
      continue
    }
  }
  return null
}

export function parseCandidate(
  candidate: string,
  config: GrammarConfigView
): ParsedCandidate | null {
  const split = splitCandidate(candidate)
  if (!split || !modifiersAreKnown(split.modifiers, config)) {
    return null
  }
  const modifiers = split.modifiers.map(
    (modifier) => modifierAliases[modifier] || modifier
  )

  const direct = wholeClassUtilities[split.base]
  if (direct) {
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

  const negative = split.base[0] === '-'
  const core = negative ? split.base.slice(1) : split.base
  const prefix = findPrefix(core, config)
  if (!prefix) return null
  const rawValue = core.slice(prefix.length + 1)
  if (!rawValue || rawValue.startsWith('$')) return null
  const entries = resolveEntries(prefix, config)
  const selected = chooseEntry(entries, prefix, rawValue, negative, config)
  if (!selected) return null
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

export function formatCandidate(
  { prop, value, valueKind, modifiers = [] }: FormatCandidateInput,
  config?: GrammarConfigView
): string | null {
  const entry = grammarEntries.find((candidate) => candidate.prop === prop)
  if (!entry) return null
  if (valueKind === 'arbitrary' && value === '') return null
  if (config && !modifiersAreKnown(modifiers, config)) return null
  const normalizedModifiers = modifiers.map(
    (modifier) => modifierAliases[modifier] || modifier
  )

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
      const candidate = `font-${name}`
      if (String(wholeClassUtilities[candidate]?.fontWeight) !== value) return null
      return normalizedModifiers.length
        ? `${normalizedModifiers.join(':')}:${candidate}`
        : candidate
    }
  }
  if (!entry.prefix) return null
  if (valueKind === 'token') {
    if (!entry.tokenCategory) return null
    const sourceDomainKnown = !!config && hasTokenDomain(config, entry.tokenCategory)
    if (sourceDomainKnown && !hasTokenName(config!, entry.tokenCategory, value))
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
    if (valueKind === 'token') return null
    if (
      Object.prototype.hasOwnProperty.call(whole, prop) &&
      String(whole[prop]) === value
    ) {
      return candidate
    }
    return null
  }
  const canValidateToken =
    valueKind !== 'token' ||
    (!!entry.tokenCategory && !!config && hasTokenDomain(config, entry.tokenCategory))
  if (config && canValidateToken) {
    const parsed = parseCandidate(candidate, config)
    if (!parsed || parsed.entry?.prop !== prop || parsed.valueKind !== valueKind)
      return null
  }
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
