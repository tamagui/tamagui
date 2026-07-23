import type { GrammarConfigView } from './candidate'
import type { TokenCategory } from './registry'

type Names = readonly string[] | ReadonlySet<string> | Readonly<Record<string, unknown>>

type GrammarFontConfig = {
  size?: Readonly<Record<string, unknown>>
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

function addNames(target: Set<string>, source: Names | undefined): void {
  if (!source) return
  if (Array.isArray(source)) {
    for (const key of source) target.add(stripTokenPrefix(key))
    return
  }
  if (source instanceof Set) {
    for (const key of source) target.add(stripTokenPrefix(key))
    return
  }
  for (const key in source) target.add(stripTokenPrefix(key))
}

function stripTokenPrefix(name: string): string {
  return name[0] === '$' ? name.slice(1) : name
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
    tokenNames.fontFamily.add(stripTokenPrefix(familyName))
    const font = config.fontsParsed[familyName]
    addNames(tokenNames.fontSize, font?.size)
    addNames(tokenNames.lineHeight, font?.lineHeight)
    addNames(tokenNames.letterSpacing, font?.letterSpacing)
  }

  return {
    shorthands: config.shorthands,
    mediaNames: config.media,
    themeNames: config.themes,
    platformNames: options.platformNames ?? grammarPlatformNames,
    tokenNames,
  }
}
