import type { GrammarConfigView } from './candidate'
import type { TokenCategory } from './registry'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

type GrammarFontConfig = {
  size?: Readonly<Record<string, unknown>>
  weight?: Readonly<Record<string, unknown>>
  lineHeight?: Readonly<Record<string, unknown>>
  letterSpacing?: Readonly<Record<string, unknown>>
}

export type GrammarSourceConfig = {
  shorthands?: Readonly<Record<string, string>>
  media?: Names
  themes?: Readonly<Record<string, unknown>>
  tokensParsed?: Partial<
    Record<
      'space' | 'size' | 'radius' | 'zIndex' | 'color',
      Readonly<Record<string, unknown>>
    >
  >
  fontsParsed?: Readonly<Record<string, GrammarFontConfig | undefined>>
}

export type CreateGrammarConfigViewOptions = {
  platformNames?: Names
  /** overrides the derived container size set (the web adapter's resolved set) */
  containerSizeNames?: readonly string[]
}

/**
 * The one owner of "does this media query measure a size". A `hover` or
 * `pointer` key measures nothing a container has, so it gets no `@` form.
 * Accepts the query TEXT (`(min-width: 900px)`) or the config's media OBJECT
 * (`{ minWidth: 900 }`) — both spellings of the same fact.
 */
export function isContainerSizeQuery(query: unknown): boolean {
  if (typeof query === 'string') {
    return (
      query.includes('width') ||
      query.includes('height') ||
      query.includes('inline-size') ||
      query.includes('block-size')
    )
  }
  if (query && typeof query === 'object') {
    for (const key in query as Readonly<Record<string, unknown>>) {
      if (/width|height|size/i.test(key)) return true
    }
  }
  return false
}

export const grammarPlatformNames: ReadonlySet<string> = new Set([
  'web',
  'native',
  'android',
  'ios',
  'tv',
  'androidtv',
  'tvos',
])

export const grammarPlatformGroups: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ['native', new Set(['android', 'ios', 'androidtv', 'tvos'])],
  ['tv', new Set(['androidtv', 'tvos'])],
  // react-native-tvos reports Platform.OS 'android'/'ios' on TV devices, so the
  // base platform contains its TV variant (matches runtime platformMatches)
  ['android', new Set(['androidtv'])],
  ['ios', new Set(['tvos'])],
])

/**
 * Platform clause specificity, mirroring the runtime directStyle ranks: a TV
 * variant beats its base platform, which beats `native`, independent of
 * authored order. Non-platform modifiers never rank.
 */
export function grammarPlatformRank(modifier: string): number {
  return modifier === 'native'
    ? 1
    : modifier === 'androidtv' || modifier === 'tvos'
      ? 3
      : 2
}

function addNames(target: Set<string>, source: Names | undefined): void {
  if (!source) return
  if (Array.isArray(source)) {
    for (const key of source) target.add(key)
    return
  }
  if (source instanceof Set) {
    for (const key of source) target.add(key)
    return
  }
  for (const key in source) target.add(key)
}

/**
 * Creates the dependency-free config projection consumed by the shared style grammar.
 * Runtime and compiler integrations must classify candidates through this same view so
 * a candidate cannot be claimed by one side and emitted by the other.
 */
export function createGrammarConfigView(
  config: GrammarSourceConfig,
  options: CreateGrammarConfigViewOptions = {}
): GrammarConfigView {
  const tokenNames: Record<TokenCategory, Set<string>> = {
    space: new Set(),
    size: new Set(),
    radius: new Set(),
    zIndex: new Set(),
    color: new Set(),
    fontFamily: new Set(),
    fontSize: new Set(),
    fontWeight: new Set(),
    lineHeight: new Set(),
    letterSpacing: new Set(),
  }

  for (const category of ['space', 'size', 'radius', 'zIndex', 'color'] as const) {
    addNames(tokenNames[category], config.tokensParsed?.[category])
  }

  for (const themeName in config.themes) {
    const theme = config.themes[themeName]
    if (theme && typeof theme === 'object' && !Array.isArray(theme)) {
      addNames(tokenNames.color, theme as Readonly<Record<string, unknown>>)
    }
  }

  for (const familyName in config.fontsParsed) {
    tokenNames.fontFamily.add(familyName)
    const font = config.fontsParsed[familyName]
    addNames(tokenNames.fontSize, font?.size)
    addNames(tokenNames.fontWeight, font?.weight)
    addNames(tokenNames.lineHeight, font?.lineHeight)
    addNames(tokenNames.letterSpacing, font?.letterSpacing)
  }

  // container size derivation needs query information, which only the
  // record form of `media` carries (values are media objects or query text).
  // a bare name list stays undefined = unknown, and the modifier registry
  // refuses container claims for it rather than guessing
  let containerSizeNames = options.containerSizeNames
  if (
    containerSizeNames === undefined &&
    config.media &&
    !Array.isArray(config.media) &&
    !(config.media instanceof Set)
  ) {
    const derived: string[] = []
    const media = config.media as Readonly<Record<string, unknown>>
    for (const key in media) {
      if (isContainerSizeQuery(media[key])) derived.push(key)
    }
    containerSizeNames = derived
  }

  return {
    shorthands: config.shorthands,
    mediaNames: config.media,
    themeNames: config.themes,
    platformNames: options.platformNames ?? grammarPlatformNames,
    tokenNames,
    containerSizeNames,
  }
}
