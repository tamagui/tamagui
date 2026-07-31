// The resolver view adapter: one createTamagui config to everything the flat
// value grammar needs (lane W4).
//
// See plans/dom-tailwind-flat-values.md — "the resolver's mechanical contract"
// and decision 18. Nothing here is wired into components yet; W1 constructs this
// once per config and hands the pieces to the cache, the lowering, and the native
// evaluator.
//
// Three rules this file exists to keep:
//
// - identifier lookup is property-scoped, because token names collide across
//   categories: `4` is a space token for `padding` and a size token for `width`.
//   Bindings come from the same tables the `$token` path already uses;
// - variable names are never constructed here. Every reference carries the
//   `Variable` the config already built, so web emits exactly the `var(--x)`
//   text the theme system emits today;
// - the config revision is derived from config content, not a call counter, so
//   server and client stamp the same revision and the program hash stays
//   deterministic across the two.

import { simpleHash, tokenCategories } from '@tamagui/helpers'
import {
  createGrammarConfigView,
  createModifierRegistry,
  resolveCandidateTarget,
  type ModifierRegistryView,
  type ReferenceKind,
  type ResolvedReference,
} from '@tamagui/style-grammar'
import { isVariable } from '../createVariable'
import type { TamaguiInternalConfig, ThemeParsed, Variable } from '../types'
import { mediaObjectToString } from './mediaObjectToString'
import { defaultTokenCategories } from './propMapper'
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable'

/** the token categories a bare name can resolve against */
type TokenCategoryName = 'color' | 'space' | 'size' | 'radius' | 'zIndex'

/** `fontsParsed` read structurally: family -> sub-map -> name -> Variable */
type FontMaps = Record<string, Record<string, unknown> | undefined>

/** font sub-maps are keyed per family, so they resolve on a separate axis */
type FontCategoryName = 'font'

const tokenCategoryNames: readonly TokenCategoryName[] = [
  'color',
  'space',
  'size',
  'radius',
  'zIndex',
]

// numeric-looking names ('4', '1.5', '-2', '10px') are always literal CSS on a
// property whose bound category does not define them (design: bare numbers
// resolve config-first only for bound numeric categories)
function isNumericName(name: string): boolean {
  const code = name.charCodeAt(0)
  return (code >= 48 && code <= 57) || code === 45 || code === 46
}

const warnedMismatches = new Set<string>()
function warnMismatchOnce(key: string, message: string) {
  if (!warnedMismatches.has(key)) {
    if (warnedMismatches.size > 1000) warnedMismatches.clear()
    warnedMismatches.add(key)
    console.warn(message)
  }
}

/**
 * Props whose token lives in a font's sub-map rather than in `tokens`. Mirrors
 * the fontSize/lineHeight/letterSpacing/fontWeight branch in `getTokenForKey`,
 * including its sub-map names.
 */
const fontSubMapByProp: Readonly<Record<string, string>> = {
  fontSize: 'size',
  lineHeight: 'lineHeight',
  letterSpacing: 'letterSpacing',
  fontWeight: 'weight',
}

/** categories whose names are numbers, so a bare number may resolve */
const numericCategories: ReadonlySet<string> = new Set([
  'space',
  'size',
  'radius',
  'zIndex',
  'font',
])

export interface GrammarRuntimeContext {
  /** every modifier the config registers, plus parameterized group and container forms */
  registry: ModifierRegistryView
  /** collision diagnostics from registry construction, for development logging */
  modifierDiagnostics: readonly string[]
  /** content-derived stamp; part of the program hash and the cache generation */
  configRevision: string
  /** media key -> `@media` condition text */
  mediaQueries: Readonly<Record<string, string>>
  /** container size -> `@container` condition text; size keys only */
  containerQueries: Readonly<Record<string, string>>
  /** the media keys that measure a size, and so have an `@` form */
  containerSizes: readonly string[]
  /** color token names, for the background family split */
  colorTokens: ReadonlySet<string>
  /**
   * the lookup for `resolvePayload`, scoped to one property. `fontFamily` is the
   * active font token and only matters for font-scoped props; it falls back to
   * the config default font exactly as `getTokenForKey` does.
   */
  getLookup(
    property: string,
    fontFamily?: string
  ): (name: string) => ResolvedReference | undefined
  /** whether bare numbers resolve for this property */
  resolvesNumbers(property: string): boolean
  /** web: the `var(--x)` text for a reference name */
  toVar(name: string): string
  /**
   * native: the value for a reference name, resolved against one theme. Theme
   * values differ per theme, so this is built per render from the active theme,
   * not once per config.
   */
  createNativeValueGetter(theme?: ThemeParsed): (name: string) => string | number
}

export interface CreateGrammarRuntimeContextOptions {
  /**
   * Overrides the derived container query table. Every size-measuring media key
   * must be present, and extra keys are allowed for sizes the derivation misses.
   * A missing size is a config-time error, never a lowering-time throw.
   */
  containerQueries?: Readonly<Record<string, string>>
}

const contexts = new WeakMap<TamaguiInternalConfig, GrammarRuntimeContext>()

export function createGrammarRuntimeContext(
  config: TamaguiInternalConfig,
  options: CreateGrammarRuntimeContextOptions = {}
): GrammarRuntimeContext {
  const existing = contexts.get(config)
  if (existing && !options.containerQueries) return existing

  const mediaQueries: Record<string, string> = {}
  const media = (config.media ?? {}) as Record<string, Record<string, unknown>>
  for (const key in media) {
    mediaQueries[key] = mediaObjectToString(media[key] as any)
  }

  const { containerQueries, containerSizes } = resolveContainerQueries(
    mediaQueries,
    options.containerQueries
  )

  const view = createGrammarConfigView(config)
  // only size-measuring media keys get an `@` form, so `@hoverNone:` stays an
  // unregistered modifier rather than lowering to a meaningless container query
  const { registry, diagnostics } = createModifierRegistry(view, {
    containerSizeNames: containerSizes,
  })

  // reference name -> the Variable the config already built. Keyed by the
  // variable's own name, which is unique per token because it is hashed from the
  // category path (`space-4` and `size-4` differ), so nothing collides.
  const byVarName = new Map<string, Variable>()
  const tokensByCategory = new Map<TokenCategoryName, Map<string, Variable>>()
  const themeVariables = new Map<string, Variable>()
  const themeKeyByVarName = new Map<string, string>()

  const tokens = (config.tokens ?? {}) as Record<string, Record<string, unknown>>
  for (const category of tokenCategoryNames) {
    const byName = new Map<string, Variable>()
    tokensByCategory.set(category, byName)
    const categoryTokens = tokens[category]
    if (!categoryTokens) continue
    for (const name in categoryTokens) {
      const variable = categoryTokens[name]
      if (!isVariable(variable)) continue
      byName.set(name, variable)
      byVarName.set(variable.name, variable)
    }
  }

  // theme keys are the variables namespace: uniform across a config's themes, and
  // every theme spells one key's variable identically because the name is hashed
  // from the key itself. Values differ per theme, which is why native resolution
  // takes the active theme.
  const themes = (config.themes ?? {}) as Record<string, Record<string, unknown>>
  for (const themeName in themes) {
    const theme = themes[themeName]
    if (!theme || typeof theme !== 'object') continue
    for (const key in theme) {
      if (themeVariables.has(key)) continue
      const variable = theme[key]
      if (!isVariable(variable)) continue
      themeVariables.set(key, variable)
      byVarName.set(variable.name, variable)
      themeKeyByVarName.set(variable.name, key)
    }
  }

  // fonts hold one Variable per size/lineHeight/letterSpacing/weight entry, plus
  // a `family` that is a Variable rather than a sub-map, so each level is guarded
  const fonts = (config.fontsParsed ?? {}) as FontMaps
  for (const family in fonts) {
    const font = fonts[family]
    if (!font) continue
    for (const subMap in font) {
      const entries = font[subMap]
      if (!entries || typeof entries !== 'object' || isVariable(entries)) continue
      for (const name in entries as Record<string, unknown>) {
        const variable = (entries as Record<string, unknown>)[name]
        if (isVariable(variable)) byVarName.set(variable.name, variable)
      }
    }
  }

  const colorTokens: ReadonlySet<string> = new Set([
    ...(tokensByCategory.get('color')?.keys() ?? []),
    ...themeVariables.keys(),
  ])

  const lookupCache = new Map<string, (name: string) => ResolvedReference | undefined>()

  // name -> the categories defining it, built on the first bound-category miss
  // for an identifier-shaped name. contribution entries carry the category
  // name, which reads correctly in the mismatch diagnostic ('"xl" contributes
  // to "size", not "color"'). only consulted for properties with a bound
  // category — an unbound property legitimately reads the unified namespace
  let tokenNameOwners: Map<string, { property: string }[]> | null = null
  const siblingCategoriesFor = (name: string): { property: string }[] | null => {
    if (!tokenNameOwners) {
      tokenNameOwners = new Map()
      for (const [categoryName, byName] of tokensByCategory) {
        for (const tokenName of byName.keys()) {
          let owners = tokenNameOwners.get(tokenName)
          if (!owners) tokenNameOwners.set(tokenName, (owners = []))
          owners.push({ property: categoryName })
        }
      }
    }
    return tokenNameOwners.get(name) ?? null
  }

  const context: GrammarRuntimeContext = {
    registry,
    modifierDiagnostics: diagnostics,
    configRevision: getConfigRevision(config, mediaQueries, themeVariables, tokens),
    mediaQueries,
    containerQueries,
    containerSizes,
    colorTokens,

    getLookup(property, fontFamily) {
      const cacheKey = fontFamily ? `${property}\0${fontFamily}` : property
      const cached = lookupCache.get(cacheKey)
      if (cached) return cached

      const category = categoryForProperty(property)
      const kind = kindForCategory(category)
      const tokenNames =
        category && category !== 'font' ? tokensByCategory.get(category) : undefined
      const fontMap =
        category === 'font'
          ? getFontSubMap(fonts, config, property, fontFamily)
          : undefined

      const lookup = (name: string): ResolvedReference | undefined => {
        // the property's bound category first
        const token = tokenNames?.get(name) ?? fontMap?.[`$${name}`]
        if (isVariable(token)) return { name: token.name, kind }
        if (kind === 'length' && resolveSafeAreaVariable(name) !== undefined) {
          return { name, kind }
        }
        // an identifier-shaped name that lives in a SIBLING category is an
        // overloaded-family mismatch (`fontSize="red-500"`): diagnose and miss
        // rather than silently binding another category's value or shipping
        // literal CSS. bare numbers stay literal on unbound properties by
        // design, so they never reach this check
        if (category !== undefined && !isNumericName(name)) {
          const owners = siblingCategoriesFor(name)
          if (owners) {
            if (process.env.NODE_ENV === 'development') {
              const verdict = resolveCandidateTarget(property, name, owners)
              if (!verdict.ok) {
                warnMismatchOnce(
                  `${property}\0${name}`,
                  `[tamagui] ${verdict.diagnostic.message}`
                )
              }
            }
            return undefined
          }
        }
        // then the variables namespace
        const themeVariable = themeVariables.get(name)
        if (themeVariable) return { name: themeVariable.name, kind }
        return undefined
      }
      lookupCache.set(cacheKey, lookup)
      return lookup
    },

    resolvesNumbers(property) {
      const category = categoryForProperty(property)
      return category !== undefined && numericCategories.has(category)
    },

    toVar(name) {
      const safeAreaValue = resolveSafeAreaVariable(name)
      if (safeAreaValue !== undefined) return safeAreaValue
      const variable = byVarName.get(name)
      if (!variable) {
        throw new Error(
          `@tamagui/web: no variable named "${name}" in the active config. Reference names come from getLookup, so this is a resolver/serializer mismatch.`
        )
      }
      // never constructed here: this is the text the config already carries
      return variable.variable ?? ''
    },

    createNativeValueGetter(theme) {
      return (name) => {
        const safeAreaValue = resolveSafeAreaVariable(name)
        if (safeAreaValue !== undefined) return safeAreaValue
        const themeKey = themeKeyByVarName.get(name)
        if (themeKey !== undefined && theme) {
          const themeValue = (theme as Record<string, unknown>)[themeKey]
          if (themeValue !== undefined) {
            return isVariable(themeValue)
              ? (themeValue.val as string | number)
              : (themeValue as string | number)
          }
        }
        const variable = byVarName.get(name)
        if (!variable) {
          throw new Error(
            `@tamagui/web: no variable named "${name}" in the active config. Reference names come from getLookup, so this is a resolver/serializer mismatch.`
          )
        }
        return variable.val as string | number
      }
    },
  }

  if (!options.containerQueries) contexts.set(config, context)
  return context
}

/**
 * The transform family's axis custom properties inherit x/y's space binding
 * (x/y themselves bind through `defaultTokenCategories`).
 */
const flatValueCategories: Readonly<Record<string, TokenCategoryName>> = {
  '--t-x': 'space',
  '--t-y': 'space',
}

function categoryForProperty(
  property: string
): TokenCategoryName | FontCategoryName | undefined {
  const flatValueCategory = flatValueCategories[property]
  if (flatValueCategory) return flatValueCategory
  if (property in tokenCategories.color) return 'color'
  if (property in fontSubMapByProp) return 'font'
  const fromDefaults = defaultTokenCategories[property]
  if (fromDefaults === undefined) return undefined
  if (fromDefaults === 'fontSize') return 'font'
  return fromDefaults
}

function kindForCategory(
  category: TokenCategoryName | FontCategoryName | undefined
): ReferenceKind {
  if (category === 'color') return 'color'
  if (category === 'zIndex') return 'number'
  if (category === undefined) return 'other'
  return 'length'
}

function getFontSubMap(
  fonts: FontMaps,
  config: TamaguiInternalConfig,
  property: string,
  fontFamily: string | undefined
): Record<string, unknown> | undefined {
  // same fallback as getTokenForKey: the passed family, then the config default
  const family = fontFamily ?? config.defaultFontToken
  const font =
    (family ? (fonts[family] ?? fonts[`$${family}`]) : undefined) ??
    fonts[config.defaultFontToken]
  const entries = font?.[fontSubMapByProp[property]]
  return entries && typeof entries === 'object'
    ? (entries as Record<string, unknown>)
    : undefined
}

/**
 * Container sizes are the media keys that measure a size. A `hover` or `pointer`
 * media key measures nothing a container has, so it gets no `@` form at all.
 *
 * `@sm:` applies the same condition the media key describes, measured against the
 * container instead of the viewport, so the derived text is the config's own query
 * text — which is also what createMediaStyle already emits after `@container`. A
 * caller may override the table, including adding a size the heuristic misses
 * (`aspect-ratio`, say), and every size must end up with query text: decision 18
 * makes that a config-creation error rather than a lowering-time throw.
 */
function resolveContainerQueries(
  mediaQueries: Readonly<Record<string, string>>,
  override: Readonly<Record<string, string>> | undefined
): {
  containerQueries: Readonly<Record<string, string>>
  containerSizes: readonly string[]
} {
  const derived: Record<string, string> = {}
  for (const key in mediaQueries) {
    if (isSizeQuery(mediaQueries[key])) derived[key] = mediaQueries[key]
  }

  const containerQueries: Record<string, string> = override ? { ...override } : derived

  const incomplete = [
    ...new Set([...Object.keys(derived), ...Object.keys(containerQueries)]),
  ].filter((key) => !containerQueries[key])
  if (incomplete.length > 0) {
    throw new Error(
      `@tamagui/web: createTamagui is missing container queries for media ${incomplete
        .map((key) => `"${key}"`)
        .join(
          ', '
        )}. Every container size needs query text, so a size that cannot derive it is a config error (see plan decision 18).`
    )
  }

  return { containerQueries, containerSizes: Object.keys(containerQueries) }
}

function isSizeQuery(query: string): boolean {
  return (
    query.includes('width') ||
    query.includes('height') ||
    query.includes('inline-size') ||
    query.includes('block-size')
  )
}

const revisions = new WeakMap<TamaguiInternalConfig, string>()

/**
 * A content hash, not a counter, so the same config stamps the same revision in
 * every process. Names are enough: web resolution emits `var()` references, so a
 * token's value never reaches a class name, and the parse cache holds
 * pre-resolution data. Sorted so key insertion order cannot move the hash.
 */
function getConfigRevision(
  config: TamaguiInternalConfig,
  mediaQueries: Readonly<Record<string, string>>,
  themeVariables: ReadonlyMap<string, Variable>,
  tokens: Record<string, Record<string, unknown>>
): string {
  const cached = revisions.get(config)
  if (cached) return cached

  const parts: string[] = []
  for (const key of Object.keys(mediaQueries).sort()) {
    parts.push(`m:${key}=${mediaQueries[key]}`)
  }
  parts.push(
    `t:${Object.keys(config.themes ?? {})
      .sort()
      .join(',')}`
  )
  parts.push(`v:${[...themeVariables.keys()].sort().join(',')}`)
  for (const category of tokenCategoryNames) {
    const categoryTokens = tokens[category]
    parts.push(
      `${category}:${categoryTokens ? Object.keys(categoryTokens).sort().join(',') : ''}`
    )
  }
  for (const family of Object.keys(config.fontsParsed ?? {}).sort()) {
    const font = (config.fontsParsed as Record<string, Record<string, unknown>>)[family]
    parts.push(`f:${family}=${font ? Object.keys(font).sort().join(',') : ''}`)
  }
  const shorthands = config.shorthands ?? {}
  parts.push(
    `s:${Object.keys(shorthands)
      .sort()
      .map((key) => `${key}>${shorthands[key]}`)
      .join(',')}`
  )

  const revision = simpleHash(parts.join('|'), 'strict') || '0'
  revisions.set(config, revision)
  return revision
}
