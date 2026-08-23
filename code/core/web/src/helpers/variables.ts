import { reservedThemeProps, simpleHash } from '@tamagui/helpers'
import {
  grammarPlatformNames,
  isRootThemeName,
  modifierKindPlatform,
  modifierKindTheme,
  reduceFlatValueIdentity,
  type ClauseIdentityErrorCode,
  type ClauseIdentityHandler,
} from '@tamagui/style-grammar/runtime'
import { getSetting } from '../config'
import { createVariable, isVariable } from '../createVariable'
import { getConfigRevisionState, type ConfigRevisionState } from './grammarConfig'
import { themeUpdateStateKey, type ThemeUpdateLayerInfo } from './themeUpdateState'
import { platformMatches } from './directStyle'
import { findVariableToken, isUnitlessVariableKey } from './variableValue'
import { warnOnce } from './warnOnce'
import type {
  TamaguiInternalConfig,
  ThemeKeys,
  ThemeName,
  Variable,
  VariableValIn,
} from '../types'

export type InlineValues = {
  values?: { [Key in ThemeKeys]?: VariableValIn }
  themes?: {
    [Name in ThemeName]?: { [Key in ThemeKeys]?: VariableValIn }
  }
}

const themeKeySets = new WeakMap<ConfigRevisionState, Set<string>>()

export const getThemeKeySet = (conf: TamaguiInternalConfig): Set<string> => {
  const generation = getConfigRevisionState(conf)
  const existing = themeKeySets.get(generation)
  if (existing) return existing
  const set = new Set<string>()
  for (const themeName in conf.themes) {
    for (const key in conf.themes[themeName]) {
      set.add(key)
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // <ThemeUpdate> reads every non-reserved prop as a theme key, so a theme key or
    // config variable sharing a name with one of Theme's own props could never
    // be set inline. Caught once per config, at the source.
    for (const key of set) {
      if (reservedThemeProps[key]) {
        console.error(
          `[tamagui] theme key "${key}" collides with a reserved theme prop, so it cannot be set with <ThemeUpdate ${key}="...">. Rename it.`
        )
      }
    }
  }
  themeKeySets.set(generation, set)
  return set
}

const cssVariablePrefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''

// theme-key custom property reference, matching the declaration side in
// getThemeCSSRules (simpleHash(themeKey, 40))
const themeKeyVar = (key: string) => `var(--${cssVariablePrefix}${simpleHash(key, 40)})`

/**
 * Resolves one `<ThemeUpdate>` value to a CSS value string.
 * References emit var() so they stay live in the cascade; literals serialize
 * with the same unit rule numeric style props use (px unless unitless key).
 * Configured names resolve first; a lookup miss stays literal.
 */
export function resolveVariableValueToCSS(
  key: string,
  value: VariableValIn,
  conf: TamaguiInternalConfig
): string | undefined {
  if (typeof value === 'number') {
    return isUnitlessVariableKey(key) ? `${value}` : `${value}px`
  }
  if (typeof value === 'object' && value && 'needsPx' in value) {
    return `${value.val}px`
  }
  if (typeof value !== 'string') {
    return
  }
  const name = value

  // theme keys and config-declared custom variables
  if (getThemeKeySet(conf).has(name)) {
    return themeKeyVar(name)
  }

  const token = findVariableToken(conf.tokensParsed, name)
  if (token) {
    return token.variable
  }
  return value
}

type VariablesCSS = {
  identifier: string
  rules: string[]
}

type ResolvedDeclarations = [key: string, cssValue: string][]

const resolveDeclarations = (
  valuesIn: InlineValues['values'],
  conf: TamaguiInternalConfig,
  skip?: Set<string> | null
): ResolvedDeclarations => {
  const out: ResolvedDeclarations = []
  if (!valuesIn) return out
  const values = valuesIn as Record<string, VariableValIn>
  const keySet = getThemeKeySet(conf)
  for (const key of Object.keys(values).sort()) {
    const value = values[key]
    if (value == null) continue
    if (skip?.has(key)) continue
    if (!keySet.has(key)) {
      warnOnce(
        `unknown:${key}`,
        `Theme inline value: "${key}" is not a theme key or config-declared variable (createTamagui({ variables })) — dropping. Native can't resolve undeclared keys, so declaring it keeps platforms in sync.`
      )
      continue
    }
    const cssValue = resolveVariableValueToCSS(key, value, conf)
    if (cssValue !== undefined) {
      out.push([key, cssValue])
    }
  }
  return out
}

const toDeclarationBlock = (declarations: ResolvedDeclarations) =>
  declarations
    .map(([key, value]) => `--${cssVariablePrefix}${simpleHash(key, 40)}:${value};`)
    .join('')

// matches the theme-class scoping on web (Theme.tsx strips the scheme prefix
// before emitting t_ classes) and how theme nesting composes names: bucket
// "blue" applies under "dark_blue", "light_blue_surface1", or a top-level
// "blue" theme. scheme names never reach this (they resolve by scheme).
const schemePrefix = /^(light|dark)_/

// non-scheme bucket names of a themes map, sorted so prefix chains apply
// least-specific first (blue before blue_surface1) — the same order the CSS
// rules are emitted in, where the later equal-specificity rule wins
const getThemedBucketNames = (themes: InlineValues['themes']): string[] => {
  if (!themes) return []
  const names: string[] = []
  for (const name in themes) {
    if (name !== 'light' && name !== 'dark' && themes[name]) {
      names.push(name)
    }
  }
  return names.sort()
}

// the names a theme bucket can ever match: every '_'-joined prefix of every
// scheme-stripped theme name in the config. broader than the style grammar's
// theme modifiers, which require a top-level conf.themes key and so can't
// target a `blue` that only exists as `dark_blue`/`light_blue`
const themeBucketNameSets = new WeakMap<ConfigRevisionState, Set<string>>()

const getThemeBucketNames = (conf: TamaguiInternalConfig): Set<string> => {
  const generation = getConfigRevisionState(conf)
  let set = themeBucketNameSets.get(generation)
  if (!set) {
    set = new Set()
    for (const themeName in conf.themes) {
      const parts = themeName.replace(schemePrefix, '').split('_')
      for (let i = 1; i <= parts.length; i++) {
        set.add(parts.slice(0, i).join('_'))
      }
    }
    themeBucketNameSets.set(generation, set)
  }
  return set
}

const warnOnUnknownThemeBucket = (name: string, conf: TamaguiInternalConfig) => {
  if (!getThemeBucketNames(conf).has(name)) {
    warnOnce(
      `unknown-theme:${name}`,
      `Theme inline value: modifier "${name}:" doesn't match any theme name in your config, so it will never apply.`
    )
  }
}

// sibling references that form a cycle compute to invalid CSS in the browser
// and are unresolvable in the native fixed-point resolver. contract
// (plans/variables.md): a key whose reference chain reaches a cycle in ANY
// effective map that can occur at runtime ({...values, ...matched theme
// buckets, ...scheme bucket}) is dropped from all emission, in every mode, so
// web and native stay identical regardless of the active theme. buckets can
// only co-occur when their names form a prefix chain (blue, blue_surface1),
// plus at most one scheme bucket, so those are exactly the maps checked.
const getCycleDroppedKeys = (props: InlineValues): Set<string> | null => {
  const values = props.values as Record<string, VariableValIn> | undefined
  const themes = props.themes as
    | Record<string, Record<string, VariableValIn> | undefined>
    | undefined
  const light = themes?.light
  const dark = themes?.dark

  let dropped: Set<string> | null = null

  const check = (map: Record<string, VariableValIn>) => {
    for (const key in map) {
      const path: string[] = []
      const pathSet = new Set<string>()
      let current = key
      while (true) {
        if (pathSet.has(current)) {
          // everything from the cycle entry onward is unresolvable; the
          // earlier chain into it is too, so drop the whole walked path
          dropped ||= new Set()
          for (const k of path) dropped.add(k)
          break
        }
        path.push(current)
        pathSet.add(current)
        const value = map[current]
        if (typeof value !== 'string') break
        const next = value
        if (!(next in map)) break
        current = next
      }
    }
  }

  const checkWithSchemes = (base: Record<string, VariableValIn>) => {
    check({ ...base, ...light })
    check({ ...base, ...dark })
  }

  checkWithSchemes(values || {})

  const bucketNames = getThemedBucketNames(props.themes)
  for (const name of bucketNames) {
    // full prefix chain present in the map, least-specific first (sorted
    // order guarantees prefixes come before their extensions)
    const merged: Record<string, VariableValIn> = { ...values }
    for (const other of bucketNames) {
      if (other === name || name.startsWith(`${other}_`)) {
        Object.assign(merged, themes![other])
      }
    }
    checkWithSchemes(merged)
  }

  if (dropped && process.env.NODE_ENV === 'development') {
    const names = [...dropped]
    warnOnce(
      `cycle:${names.join(',')}`,
      `Theme inline values: reference cycle involving "${names.join('", "')}". These keys cannot resolve on either platform and are dropped.`
    )
  }

  return dropped
}

const rulesCache = new Map<string, VariablesCSS>()

/**
 * Builds the deterministic identifier and CSS rules for `<ThemeUpdate>` values.
 * Identifier is a pure function of the resolved declarations so SSR and
 * client agree, and a build-time extractor can precompute it.
 *
 * The themes map emits each bucket under its theme-class scope. dark/light
 * buckets keep the scheme strategy (two levels of light/dark inversion plus
 * the prefers-color-scheme fallback, matching getThemeCSSRules); other names
 * scope by plain theme class.
 */
export function getVariablesCSSRules(
  props: InlineValues,
  conf: TamaguiInternalConfig
): VariablesCSS | null {
  const cycleDropped = getCycleDroppedKeys(props)
  const themes = props.themes as
    | Record<string, InlineValues['values'] | undefined>
    | undefined

  const base = resolveDeclarations(props.values, conf, cycleDropped)
  const dark = resolveDeclarations(themes?.dark, conf, cycleDropped)
  const light = resolveDeclarations(themes?.light, conf, cycleDropped)

  // non-scheme buckets, sorted: later rules win equal-specificity ties, so
  // within a prefix chain (blue, blue_surface1) the more specific name wins
  const themed: [string, ResolvedDeclarations][] = []
  for (const name of getThemedBucketNames(props.themes)) {
    if (process.env.NODE_ENV === 'development') {
      warnOnUnknownThemeBucket(name, conf)
    }
    const declarations = resolveDeclarations(themes![name], conf, cycleDropped)
    if (declarations.length) {
      themed.push([name, declarations])
    }
  }

  if (!base.length && !dark.length && !light.length && !themed.length) {
    return null
  }

  const prefersColorThemes = !!getSetting('shouldAddPrefersColorThemes')
  const payload = JSON.stringify([base, themed, dark, light, prefersColorThemes])

  const cached = rulesCache.get(payload)
  if (cached) return cached

  const identifier = `tvar_${simpleHash(payload, 'strict')}`
  // inline values patch named themes, so their selector family must meet or
  // exceed the theme rules' id-anchored specificity. keeping the same
  // always-matching anchor on the inline class raises the whole ladder while
  // preserving its base, themed, and scheme ordering.
  const cls = `.${identifier}:not(#t_theme_full_name)`
  const rules: string[] = []

  if (base.length) {
    rules.push(`:root ${cls} {${toDeclarationBlock(base)}}`)
  }

  // non-scheme theme buckets: plain theme-class scoping (1,3,0). the class can
  // sit on :root itself (addThemeClassName 'html') or below it, so emit both
  // shapes. nested inversion is a scheme concept and doesn't apply here.
  // emitted before the scheme rules so scheme buckets win overlapping keys —
  // required for consistency, since the scheme inversion selector (1,4,0)
  // outranks these regardless of order.
  for (const [name, declarations] of themed) {
    rules.push(
      `:root .t_${name} ${cls}, :root.t_${name} ${cls} {${toDeclarationBlock(declarations)}}`
    )
  }

  // explicit scheme classes: one level (1,3,0) then the two-level inversion
  // override (1,4,0). the scheme class can sit on :root itself (addThemeClassName
  // 'html') or below it, so emit both shapes. deeper alternation is undefined,
  // same two-level limit as getThemeCSSRules.
  const schemeRule = (scheme: 'dark' | 'light') => {
    const opposite = scheme === 'dark' ? 'light' : 'dark'
    const declarations = scheme === 'light' ? light : dark
    return `:root .t_${scheme} ${cls}, :root.t_${scheme} ${cls}, :root .t_${opposite} .t_${scheme} ${cls}, :root.t_${opposite} .t_${scheme} ${cls} {${toDeclarationBlock(declarations)}}`
  }

  if (light.length) {
    rules.push(schemeRule('light'))
  }
  if (dark.length) {
    rules.push(schemeRule('dark'))
  }

  // when the app relies on prefers-color-scheme with no explicit root class,
  // scheme values apply via media query at base-rule specificity (1,2,0),
  // after the base rule so they win the tie; explicit classes (1,3,0+) win over
  // the media rule in both directions
  if (prefersColorThemes) {
    if (light.length) {
      rules.push(
        `@media (prefers-color-scheme:light){:root ${cls} {${toDeclarationBlock(light)}}}`
      )
    }
    if (dark.length) {
      rules.push(
        `@media (prefers-color-scheme:dark){:root ${cls} {${toDeclarationBlock(dark)}}}`
      )
    }
  }

  const result = { identifier, rules }
  if (rulesCache.size >= 10_000) {
    rulesCache.clear()
  }
  rulesCache.set(payload, result)
  return result
}

// ---- inline theme layer (native + JS theme readers on web) ----

// non-enumerable marker on merged theme objects: cache key for idempotency,
// overridden key set, and literal light/dark pairs for the iOS fast-scheme path
const serializeInlineValue = (value: VariableValIn): string =>
  value && typeof value === 'object'
    ? `object:px${value.val}`
    : `${typeof value}:${String(value)}`

const serializeBucket = (bucket: InlineValues['values']): string => {
  if (!bucket) return ''
  const map = bucket as Record<string, VariableValIn>
  return Object.keys(map)
    .sort()
    .map((key) => {
      const value = serializeInlineValue(map[key])
      return `${key.length}:${key}${value.length}:${value}`
    })
    .join('')
}

// memoized per layer object: the flat-props path hands back identity-stable
// layers, so this is one serialization per distinct value set instead of one
// per render (getPropsKey calls it on every render of every <ThemeUpdate>)
const inlineKeys = new WeakMap<InlineValues, string>()

export const getInlineValuesKey = (inline: InlineValues): string => {
  const cached = inlineKeys.get(inline)
  if (cached !== undefined) return cached
  let key = serializeBucket(inline.values)
  if (inline.themes) {
    const themes = inline.themes as Record<string, InlineValues['values']>
    for (const name of Object.keys(themes).sort()) {
      key += `;${name}=${serializeBucket(themes[name])}`
    }
  }
  inlineKeys.set(inline, key)
  return key
}

// ---- flat theme-value props: <ThemeUpdate background-hover="blue4 dark:blue2"> ----

/**
 * One authored theme-value clause the parser could not use. The runtime warns
 * and drops; zero-runtime turns each one into a rule 3 violation.
 */
export type InlineValueIssue = { key: string; raw: string; message: string }
export type InlineValueIssueSink = (issue: InlineValueIssue) => void

type FlatBuckets = {
  values: Record<string, VariableValIn>
  themes: Record<string, Record<string, VariableValIn>> | null
}

type FlatThemeModifier = [
  name: string,
  kind: 0 | typeof modifierKindPlatform | typeof modifierKindTheme,
]
type FlatThemeClause = [payload: string, modifiers: FlatThemeModifier[]]
type FlatThemeValue = {
  base: string | null
  clauses: FlatThemeClause[] | null
  error: string | null
}
type FlatThemeScanContext = {
  source: string
  themeBuckets: Set<string>
  out: FlatThemeValue
  pending: FlatThemeModifier[] | null
  chainStart: number
  chainEnd: number
}

const themeUpdateFlatHandler: ClauseIdentityHandler<FlatThemeScanContext> = {
  segment(ctx, start, end, isBase) {
    if (isBase) {
      ctx.out.base = start < end ? ctx.source.slice(start, end) : null
    }
  },

  chain(ctx, start, end) {
    ctx.pending = []
    ctx.chainStart = start
    ctx.chainEnd = end
  },

  modifier(ctx, start, end) {
    const name = ctx.source.slice(start, end)
    const kind =
      // theme updates intentionally keep their subtree-specific collision order:
      // platform, then theme, then every unsupported kind. direct styles use
      // the shared vocabulary's state/media/platform/theme order instead.
      grammarPlatformNames.has(name)
        ? modifierKindPlatform
        : isRootThemeName(name) && ctx.themeBuckets.has(name)
          ? modifierKindTheme
          : 0
    ctx.pending!.push([name, kind])
  },

  clause(ctx, _start, _chainEnd, start, end) {
    ;(ctx.out.clauses ||= []).push([ctx.source.slice(start, end), ctx.pending!])
  },

  error(ctx, code: ClauseIdentityErrorCode, index) {
    if (ctx.out.error !== null) return
    if (code === 'empty-modifier') {
      ctx.out.error = 'a modifier chain has an empty segment'
    } else if (code === 'empty-payload') {
      ctx.out.error = `the "${ctx.source.slice(ctx.chainStart, ctx.chainEnd)}:" clause has no value`
    } else if (code === 'invalid-character') {
      ctx.out.error = `"${ctx.source[index]}" cannot appear in a value: it would end the declaration or rule`
    } else if (code === 'unterminated-string') {
      ctx.out.error = `unterminated ${ctx.source[index]} string`
    } else if (code === 'unterminated-comment') {
      ctx.out.error =
        'unterminated "/*" comment: it would swallow the rules after this one'
    } else if (code === 'stray-comment-close') {
      ctx.out.error = 'stray "*/": it would close a comment opened somewhere else'
    } else {
      ctx.out.error = 'unterminated "(" in value'
    }
  },
}

const parsedInlineValues = new WeakMap<ConfigRevisionState, Map<string, FlatThemeValue>>()

const addFlatValue = (
  out: FlatBuckets,
  key: string,
  raw: VariableValIn,
  conf: TamaguiInternalConfig,
  onIssue?: InlineValueIssueSink
) => {
  // one authored value, one place that decides whether each clause is usable.
  // the runtime warns and says what it dropped; a build-time caller takes the
  // same diagnosis and makes it a hard error, where nothing is dropped because
  // nothing is built. so the disposition is the caller's and the diagnosis is
  // shared, and the two can never diverge on what is legal.
  const report = (once: string, message: string, dropped: string) => {
    const diagnosis = message.replace(/\.$/, '')
    if (onIssue) onIssue({ key, raw: String(raw), message: diagnosis })
    else warnOnce(once, `${diagnosis}. ${dropped}`)
  }
  if (typeof raw !== 'string') {
    out.values[key] = raw
    return
  }

  const generation = getConfigRevisionState(conf)
  let configValues = parsedInlineValues.get(generation)
  if (!configValues) {
    configValues = new Map()
    parsedInlineValues.set(generation, configValues)
  }

  let parsed = configValues.get(raw)
  if (!parsed) {
    parsed = { base: null, clauses: null, error: null }
    reduceFlatValueIdentity(raw, themeUpdateFlatHandler, {
      source: raw,
      themeBuckets: getThemeBucketNames(conf),
      out: parsed,
      pending: null,
      chainStart: 0,
      chainEnd: 0,
    })
    if (configValues.size >= 10_000) {
      configValues.clear()
    }
    configValues.set(raw, parsed)
  }

  if (parsed.error !== null) {
    report(
      `parse:${key}:${raw}`,
      `<ThemeUpdate ${key}="${raw}">: ${parsed.error}`,
      'Dropping.'
    )
    return
  }

  const { base, clauses } = parsed
  if (base !== null) {
    out.values[key] = base
  }

  if (!clauses) return
  for (const [payload, modifiers] of clauses) {
    let themeName: string | undefined
    let applies = true

    for (const [modifier, kind] of modifiers) {
      if (kind === modifierKindPlatform) {
        // platform is fixed for the process, so this resolves once per value
        applies &&= platformMatches(modifier)
        continue
      }
      if (kind === modifierKindTheme) {
        if (themeName !== undefined) {
          report(
            `two-themes:${key}:${raw}`,
            `<ThemeUpdate ${key}="${raw}">: "${themeName}:${modifier}:" targets two themes at once, which a subtree value can't express. Name the composed theme instead.`,
            'Dropping the clause.'
          )
          applies = false
          break
        }
        themeName = modifier
        continue
      }
      report(
        `unsupported-modifier:${modifier}`,
        `<ThemeUpdate ${key}="${raw}">: "${modifier}:" isn't supported here. Theme values apply to a whole subtree, so only theme (dark:) and platform (ios:) modifiers work.`,
        'Dropping the clause.'
      )
      applies = false
      break
    }

    if (!applies) continue
    if (themeName === undefined) {
      out.values[key] = payload
    } else {
      ;((out.themes ||= {})[themeName] ||= {})[key] = payload
    }
  }
}

// keyed by config and raw prop values, so repeat renders of the same <ThemeUpdate>
// reuse one layer object. downstream identity caches and snapshot bailouts key
// off this object. each config cache is bounded with the same clear-on-limit
// pattern as simpleHash's string cache.
const flatLayers = new WeakMap<ConfigRevisionState, Map<string, InlineValues>>()

/**
 * Reads theme-key props off a <ThemeUpdate> into the layer shape the rest of
 * the system already consumes. Returns null when the element carries no theme
 * key props at all, which is one loop over its props (two entries for a plain
 * `<ThemeUpdate>`) and no allocation.
 *
 * A key that is present but currently undefined still produces an empty
 * layer. Presence, not value, is what makes an element a theme-updating
 * one (the same rule `hasThemeUpdatingProps` applies to `name`), and it is
 * what keeps `<ThemeUpdate background={on ? 'red' : undefined}>` rendering the same
 * tree in both states instead of remounting its subtree when a value appears.
 */
export function getInlineValuesFromProps(
  props: Record<string, any>,
  conf: TamaguiInternalConfig,
  onIssue?: InlineValueIssueSink
): InlineValues | null {
  let hasKey = false
  let cacheKey = ''
  for (const key in props) {
    if (reservedThemeProps[key]) continue
    hasKey = true
    const value = props[key]
    if (value == null) continue
    const serialized = serializeInlineValue(value)
    cacheKey += `${key.length}:${key}${serialized.length}:${serialized}`
  }

  if (!hasKey) return null

  const generation = getConfigRevisionState(conf)
  let configLayers = flatLayers.get(generation)
  if (!configLayers) {
    configLayers = new Map()
    flatLayers.set(generation, configLayers)
  }

  // a caller that asked for issues has to see them for every call, and a cache
  // hit reports nothing. the render path never passes a sink, so it keeps the
  // memo; the compiler calls this once per authored element.
  const cached = onIssue ? undefined : configLayers.get(cacheKey)
  if (cached) return cached

  const out: FlatBuckets = { values: {}, themes: null }
  for (const key in props) {
    if (reservedThemeProps[key]) continue
    const value = props[key]
    if (value == null) continue
    addFlatValue(out, key, value, conf, onIssue)
  }

  const layer: InlineValues = {
    values: out.values as InlineValues['values'],
    themes: (out.themes || undefined) as InlineValues['themes'],
  }
  if (!onIssue) {
    if (configLayers.size >= 10_000) {
      configLayers.clear()
    }
    configLayers.set(cacheKey, layer)
  }
  return layer
}

const mergedThemeCache = new WeakMap<
  ConfigRevisionState,
  WeakMap<object, Map<string, Record<string, Variable>>>
>()

/**
 * Builds the merged theme for a `<ThemeUpdate>` layer: parent theme spread plus
 * overridden keys as variables, resolved per the shared contract (effective
 * map = values + matching non-scheme theme buckets + scheme bucket,
 * fixed-point references, cycle-involved keys dropped everywhere). Non-scheme
 * buckets match the subtree's resolved theme name by segment (bucket "blue"
 * under "dark_blue"), mirroring the theme-class scoping on web; dark/light
 * buckets resolve by the scheme derived from the theme name. Returns the
 * parent theme unchanged when nothing applies. Identity-stable per
 * (parentTheme, values, matched buckets, scheme) so snapshot bailouts and
 * proxy caches hold.
 */
export function getMergedInlineTheme(
  parentTheme: Record<string, Variable>,
  inline: InlineValues,
  themeName: string | undefined,
  conf: TamaguiInternalConfig
): Record<string, Variable> {
  const generation = getConfigRevisionState(conf)
  const name = themeName || 'light'
  const activeScheme = name === 'dark' || name.startsWith('dark_') ? 'dark' : 'light'

  const bucketNames = getThemedBucketNames(inline.themes)
  let matched: string[] | undefined
  if (bucketNames.length) {
    const baseName = name.replace(schemePrefix, '')
    for (const bucketName of bucketNames) {
      if (process.env.NODE_ENV === 'development') {
        warnOnUnknownThemeBucket(bucketName, conf)
      }
      if (baseName === bucketName || baseName.startsWith(`${bucketName}_`)) {
        matched ||= []
        matched.push(bucketName)
      }
    }
  }

  const cacheKey = `${getInlineValuesKey(inline)}|${activeScheme}|${matched ? matched.join(',') : ''}`

  // idempotency: re-applying the same layer to its own output is a no-op
  const existingInfo = (parentTheme as any)[themeUpdateStateKey] as
    | ThemeUpdateLayerInfo
    | undefined
  if (existingInfo?.generation === generation && existingInfo.key === cacheKey) {
    return parentTheme
  }

  let generationCache = mergedThemeCache.get(generation)
  let byKey = generationCache?.get(parentTheme)
  const cached = byKey?.get(cacheKey)
  if (cached) return cached

  const values = (inline.values || {}) as Record<string, VariableValIn>
  const themes = (inline.themes || {}) as Record<
    string,
    Record<string, VariableValIn> | undefined
  >
  const light = themes.light || {}
  const dark = themes.dark || {}
  const base = { ...values }
  if (matched) {
    for (const bucketName of matched) {
      Object.assign(base, themes[bucketName])
    }
  }
  const effective = { ...base, ...(activeScheme === 'dark' ? dark : light) }
  const opposite = { ...base, ...(activeScheme === 'dark' ? light : dark) }
  const dropped = getCycleDroppedKeys(inline)
  const keySet = getThemeKeySet(conf)

  // resolve one key within an effective map to a raw value (fixed-point over
  // sibling refs, then parent theme, then tokens); undefined = drop
  const resolveRaw = (keyIn: string, map: Record<string, VariableValIn>): unknown => {
    let key = keyIn
    let value: VariableValIn | undefined = map[key]
    while (typeof value === 'string') {
      const name = value
      if (name in map && !dropped?.has(name)) {
        key = name
        value = map[name]
        continue
      }
      const themeValue = parentTheme[name]
      if (themeValue !== undefined) {
        return isVariable(themeValue) ? themeValue.val : themeValue
      }
      const token = findVariableToken(conf.tokensParsed, name)
      if (token) return token.val
      return value
    }
    if (value && typeof value === 'object') {
      return (value as { val: number }).val
    }
    return value
  }

  const info: ThemeUpdateLayerInfo = {
    key: cacheKey,
    generation,
    // nested layers: carry the parent layer's overrides forward (its values
    // are plain enumerable entries after the spread, but the iOS pair info
    // would otherwise be lost)
    overridden: new Set(existingInfo?.overridden),
    pairs: { ...existingInfo?.pairs },
  }

  const merged: Record<string, Variable> = { ...parentTheme }
  let didOverride = false

  for (const key of Object.keys(effective).sort()) {
    if (dropped?.has(key)) continue
    if (effective[key] == null) continue
    if (!keySet.has(key)) {
      warnOnce(
        `unknown:${key}`,
        `Theme inline value: "${key}" is not a theme key or config-declared variable (createTamagui({ variables })) — dropping. Native can't resolve undeclared keys, so declaring it keeps platforms in sync.`
      )
      continue
    }
    const raw = resolveRaw(key, effective)
    if (raw === undefined) continue

    didOverride = true
    merged[key] = createVariable({ key, name: key, val: raw as any })
    info.overridden.add(key)
    delete info.pairs[key]

    // iOS fast-scheme pairs only when both scheme-effective values are
    // literals — references would need opposite-theme resolution, so those
    // keys deopt from DynamicColorIOS instead (tracked normally)
    const activeLiteral = effective[key]
    const oppositeLiteral = opposite[key]
    const isLiteral = (v: unknown) =>
      (typeof v === 'string' &&
        !(v in effective) &&
        !(v in parentTheme) &&
        !findVariableToken(conf.tokensParsed, v)) ||
      typeof v === 'number'
    if (isLiteral(activeLiteral) && isLiteral(oppositeLiteral)) {
      info.pairs[key] = {
        light: (activeScheme === 'light' ? activeLiteral : oppositeLiteral) as
          | string
          | number,
        dark: (activeScheme === 'dark' ? activeLiteral : oppositeLiteral) as
          | string
          | number,
      }
    }
  }

  // nothing applied: hand back the base unchanged (for a nested layer the
  // base is the outer merged theme, which is exactly right)
  if (!didOverride) {
    return parentTheme
  }

  Object.defineProperty(merged, themeUpdateStateKey, {
    value: info,
    enumerable: false,
  })

  byKey ||= new Map()
  if (!generationCache) {
    generationCache = new WeakMap()
    mergedThemeCache.set(generation, generationCache)
  }
  generationCache.set(parentTheme, byKey)
  if (byKey.size >= 10_000) {
    byKey.clear()
  }
  byKey.set(cacheKey, merged)
  return merged
}
