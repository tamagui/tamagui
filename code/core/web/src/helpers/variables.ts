import { simpleHash } from '@tamagui/helpers'
import {
  grammarPlatformNames,
  isRootThemeName,
  parseValue,
  type ModifierRegistryView,
} from '@tamagui/style-grammar/runtime'
import { getSetting } from '../config'
import { createVariable, isVariable } from '../createVariable'
import { platformMatches } from './directStyle'
import type {
  GenericVariables,
  TamaguiInternalConfig,
  TokensParsed,
  Variable,
  VariablesProps,
  VariableValIn,
} from '../types'

// keys whose numeric values stay unitless on web. audited against RN numeric
// style keys: opacity, zIndex, flex/flexGrow/flexShrink, aspectRatio, scale*,
// fontWeight, elevation, shadowOpacity all end in one of these suffixes.
// dimensional keys (radius, width, gap, size...) default to px.
const unitlessSuffixes = [
  'opacity',
  'scale',
  'zindex',
  'weight',
  'flex',
  'grow',
  'shrink',
  'ratio',
  'elevation',
]

export const isUnitlessVariableKey = (key: string): boolean => {
  const lower = key.toLowerCase()
  return unitlessSuffixes.some((suffix) => lower.endsWith(suffix))
}

// Property-less variable references scan token categories in this fixed order.
const tokenCategoryOrder = ['color', 'space', 'size', 'radius', 'zIndex'] as const

const themeKeySets = new WeakMap<object, Set<string>>()

export const getThemeKeySet = (conf: TamaguiInternalConfig): Set<string> => {
  const existing = themeKeySets.get(conf.themes)
  if (existing) return existing
  const set = new Set<string>()
  for (const themeName in conf.themes) {
    for (const key in conf.themes[themeName]) {
      set.add(key)
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // <Theme> reads every non-reserved prop as a theme key, so a theme key or
    // config variable sharing a name with one of Theme's own props could never
    // be set inline. Caught once per config, at the source.
    for (const key of set) {
      if (reservedThemeProps[key]) {
        console.error(
          `[tamagui] theme key "${key}" collides with a <Theme> prop, so it can never be set inline (<Theme ${key}="...">). Rename it.`
        )
      }
    }
  }
  themeKeySets.set(conf.themes, set)
  return set
}

const warned = new Set<string>()
const warnOnce = (key: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    if (!warned.has(key)) {
      warned.add(key)
      console.warn(`[tamagui] ${message}`)
    }
  }
}

const findToken = (tokensParsed: TokensParsed, name: string): Variable | undefined => {
  let found: Variable | undefined
  let foundCategory: string | undefined
  for (const category of tokenCategoryOrder) {
    const token = tokensParsed[category]?.[name] as Variable | undefined
    if (!token) continue
    if (!found) {
      found = token
      foundCategory = category
      if (process.env.NODE_ENV !== 'development') break
    } else {
      warnOnce(
        `ambiguous:${name}`,
        `Variables: "${name}" exists in multiple token categories; using "${foundCategory}". Rename one of the colliding tokens.`
      )
      break
    }
  }
  return found
}

const cssVariablePrefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''

// theme-key custom property reference, matching the declaration side in
// getThemeCSSRules (simpleHash(themeKey, 40))
const themeKeyVar = (key: string) => `var(--${cssVariablePrefix}${simpleHash(key, 40)})`

/**
 * Resolves one <Variables> value to a CSS value string.
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

  const token = findToken(conf.tokensParsed, name)
  if (token) {
    return token.variable
  }
  return value
}

export type VariablesCSS = {
  identifier: string
  rules: string[]
}

type ResolvedDeclarations = [key: string, cssValue: string][]

const resolveDeclarations = (
  valuesIn: VariablesProps['values'],
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
        `Variables: "${key}" is not a theme key or config-declared variable (createTamagui({ variables })) — dropping. Native can't resolve undeclared keys, so declaring them keeps platforms in sync.`
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

const isSchemeName = (name: string) => name === 'light' || name === 'dark'

const bucketMatchesThemeName = (bucketName: string, themeName: string): boolean => {
  const base = themeName.replace(schemePrefix, '')
  return base === bucketName || base.startsWith(`${bucketName}_`)
}

// non-scheme bucket names of a themes map, sorted so prefix chains apply
// least-specific first (blue before blue_surface1) — the same order the CSS
// rules are emitted in, where the later equal-specificity rule wins
const getThemedBucketNames = (themes: VariablesProps['themes']): string[] => {
  if (!themes) return []
  const names: string[] = []
  for (const name in themes) {
    if (!isSchemeName(name) && themes[name]) {
      names.push(name)
    }
  }
  return names.sort()
}

// the names a theme bucket can ever match: every '_'-joined prefix of every
// scheme-stripped theme name in the config. broader than the style grammar's
// theme modifiers, which require a top-level conf.themes key and so can't
// target a `blue` that only exists as `dark_blue`/`light_blue`
const themeBucketNameSets = new WeakMap<object, Set<string>>()

const getThemeBucketNames = (conf: TamaguiInternalConfig): Set<string> => {
  let set = themeBucketNameSets.get(conf.themes)
  if (!set) {
    set = new Set()
    for (const themeName in conf.themes) {
      const parts = themeName.replace(schemePrefix, '').split('_')
      for (let i = 1; i <= parts.length; i++) {
        set.add(parts.slice(0, i).join('_'))
      }
    }
    themeBucketNameSets.set(conf.themes, set)
  }
  return set
}

const warnOnUnknownThemeBucket = (name: string, conf: TamaguiInternalConfig) => {
  if (!getThemeBucketNames(conf).has(name)) {
    warnOnce(
      `unknown-theme:${name}`,
      `Variables: themes["${name}"] doesn't match any theme name in your config — it will never apply.`
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

  checkWithSchemes({ ...values })

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
    warnOnce(
      `cycle:${[...dropped].join(',')}`,
      `Variables: reference cycle involving "${[...dropped].join('", "')}" — dropping these keys (they cannot resolve on either platform).`
    )
  }

  return dropped
}

const rulesCache = new Map<string, VariablesCSS | null>()

/**
 * Builds the deterministic identifier + CSS rules for a <Variables> node.
 * Identifier is a pure function of the resolved declarations so SSR and
 * client agree, and a build-time extractor can precompute it.
 *
 * The themes map emits each bucket under its theme-class scope. dark/light
 * buckets keep the scheme strategy (two levels of light/dark inversion plus
 * the prefers-color-scheme fallback, matching getThemeCSSRules); other names
 * scope by plain theme class.
 */
export function getVariablesCSSRules(
  props: VariablesProps,
  conf: TamaguiInternalConfig
): VariablesCSS | null {
  const cycleDropped = getCycleDroppedKeys(props)
  const themes = props.themes as
    | Record<string, VariablesProps['values'] | undefined>
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
  if (cached !== undefined) {
    return cached
  }

  const identifier = `tvar_${simpleHash(payload, 'strict')}`
  const cls = `.${identifier}`
  const rules: string[] = []

  if (base.length) {
    rules.push(`:root ${cls} {${toDeclarationBlock(base)}}`)
  }

  // non-scheme theme buckets: plain theme-class scoping (0,3,0). the class can
  // sit on :root itself (addThemeClassName 'html') or below it, so emit both
  // shapes. nested inversion is a scheme concept and doesn't apply here.
  // emitted before the scheme rules so scheme buckets win overlapping keys —
  // required for consistency, since the scheme inversion selector (0,4,0)
  // outranks these regardless of order.
  for (const [name, declarations] of themed) {
    rules.push(
      `:root .t_${name} ${cls}, :root.t_${name} ${cls} {${toDeclarationBlock(declarations)}}`
    )
  }

  // explicit scheme classes: one level (0,3,0) then the two-level inversion
  // override (0,4,0). the scheme class can sit on :root itself (addThemeClassName
  // 'html') or below it, so emit both shapes. deeper alternation is undefined,
  // same two-level limit as getThemeCSSRules.
  const schemeRule = (scheme: 'dark' | 'light', declarations: ResolvedDeclarations) => {
    const opposite = scheme === 'dark' ? 'light' : 'dark'
    const selectors = [
      `:root .t_${scheme} ${cls}`,
      `:root.t_${scheme} ${cls}`,
      `:root .t_${opposite} .t_${scheme} ${cls}`,
      `:root.t_${opposite} .t_${scheme} ${cls}`,
    ]
    return `${selectors.join(', ')} {${toDeclarationBlock(declarations)}}`
  }

  if (light.length) {
    rules.push(schemeRule('light', light))
  }
  if (dark.length) {
    rules.push(schemeRule('dark', dark))
  }

  // when the app relies on prefers-color-scheme with no explicit root class,
  // scheme values apply via media query at base-rule specificity (0,2,0),
  // after the base rule so they win the tie; explicit classes (0,3,0+) win over
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

// ---- inline theme layer (<Variables> on native + JS theme readers on web) ----

export type InlineValues = Pick<VariablesProps, 'values' | 'themes'>

// non-enumerable marker on merged theme objects: cache key for idempotency,
// overridden key set, and literal light/dark pairs for the iOS fast-scheme path
export const inlineLayerKey = '_tmgInlineLayer'

export type InlineLayerInfo = {
  key: string
  overridden: Set<string>
  pairs: Record<string, { light: string | number; dark: string | number }>
}

const serializeInlineValue = (value: VariableValIn): string =>
  value && typeof value === 'object'
    ? `object:px${value.val}`
    : `${typeof value}:${String(value)}`

const serializeBucket = (bucket: VariablesProps['values']): string => {
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
// per render (getPropsKey calls it on every render of every <Theme>)
const inlineKeys = new WeakMap<InlineValues, string>()

export const getInlineValuesKey = (inline: InlineValues): string => {
  const cached = inlineKeys.get(inline)
  if (cached !== undefined) return cached
  let key = serializeBucket(inline.values)
  if (inline.themes) {
    const themes = inline.themes as Record<string, VariablesProps['values']>
    for (const name of Object.keys(themes).sort()) {
      key += `;${name}=${serializeBucket(themes[name])}`
    }
  }
  inlineKeys.set(inline, key)
  return key
}

// ---- flat theme-value props: <Theme background-hover="blue4 dark:blue2"> ----

/**
 * The props <Theme> owns. Every other prop is read as a theme key, so these
 * names can't be used as theme keys or config variables. development builds
 * report a collision instead of silently dropping the value.
 */
export const reservedThemeProps: Record<string, true> = {
  _isRoot: true,
  children: true,
  className: true,
  contain: true,
  debug: true,
  deopt: true,
  disable: true,
  'disable-child-theme': true,
  forceClassName: true,
  inlineClassName: true,
  inlineValues: true,
  name: true,
  nativeUpdate: true,
  needsUpdate: true,
  passThrough: true,
  reset: true,
  shallow: true,
}

const registryViews = new WeakMap<object, ModifierRegistryView>()

/**
 * Theme and platform are the only modifiers a subtree-wide value can honor.
 * Everything else still parses as a modifier so it can be rejected by name
 * below, rather than coming back as a generic "unregistered modifier".
 */
const getModifierRegistry = (conf: TamaguiInternalConfig): ModifierRegistryView => {
  let view = registryViews.get(conf.themes)
  if (!view) {
    view = {
      get(name: string) {
        if (grammarPlatformNames.has(name)) return 'platform'
        if (isRootThemeName(name) && getThemeBucketNames(conf).has(name)) return 'theme'
        return 'state'
      },
    }
    registryViews.set(conf.themes, view)
  }
  return view
}

type FlatBuckets = {
  values: Record<string, VariableValIn>
  themes: Record<string, Record<string, VariableValIn>> | null
}

const parsedInlineValues = new WeakMap<
  object,
  Map<string, ReturnType<typeof parseValue>>
>()

const addFlatValue = (
  out: FlatBuckets,
  key: string,
  raw: VariableValIn,
  conf: TamaguiInternalConfig
) => {
  if (typeof raw !== 'string') {
    out.values[key] = raw
    return
  }

  let configValues = parsedInlineValues.get(conf.themes)
  if (!configValues) {
    configValues = new Map()
    parsedInlineValues.set(conf.themes, configValues)
  }

  let parsed = configValues.get(raw)
  if (!parsed) {
    parsed = parseValue(raw, getModifierRegistry(conf))
    if (configValues.size >= 10_000) {
      configValues.clear()
    }
    configValues.set(raw, parsed)
  }

  if (!parsed.ok) {
    warnOnce(
      `parse:${key}:${raw}`,
      `<Theme ${key}="${raw}">: ${parsed.errors[0].message}. Dropping.`
    )
    return
  }

  const { base, clauses } = parsed.value
  if (base !== null) {
    out.values[key] = base
  }

  for (const clause of clauses) {
    let themeName: string | undefined
    let applies = true

    for (const modifier of clause.modifiers) {
      if (grammarPlatformNames.has(modifier)) {
        // platform is fixed for the process, so this resolves once per value
        applies &&= platformMatches(modifier)
        continue
      }
      if (isRootThemeName(modifier) && getThemeBucketNames(conf).has(modifier)) {
        if (themeName !== undefined) {
          warnOnce(
            `two-themes:${key}:${raw}`,
            `<Theme ${key}="${raw}">: "${themeName}:${modifier}:" targets two themes at once, which a subtree value can't express. Name the composed theme instead. Dropping the clause.`
          )
          applies = false
          break
        }
        themeName = modifier
        continue
      }
      warnOnce(
        `unsupported-modifier:${modifier}`,
        `<Theme ${key}="${raw}">: "${modifier}:" isn't supported here. Theme values apply to a whole subtree, so only theme (dark:) and platform (ios:) modifiers work. Dropping the clause.`
      )
      applies = false
      break
    }

    if (!applies) continue
    if (themeName === undefined) {
      out.values[key] = clause.payload
    } else {
      ;((out.themes ||= {})[themeName] ||= {})[key] = clause.payload
    }
  }
}

// keyed by config and raw prop values, so repeat renders of the same <Theme>
// reuse one layer object. downstream identity caches and snapshot bailouts key
// off this object. each config cache is bounded with the same clear-on-limit
// pattern as simpleHash's string cache.
const flatLayers = new WeakMap<object, Map<string, InlineValues>>()

/**
 * Reads theme-key props off a <Theme> into the inline layer shape the rest of
 * the system already consumes. Returns null when the element carries no theme
 * key props at all, which is one loop over its props (two entries for a plain
 * `<Theme name="dark">`) and no allocation.
 *
 * A key that is present but currently undefined still produces an empty
 * layer. Presence, not value, is what makes an element a theme-updating
 * one (the same rule `hasThemeUpdatingProps` applies to `name`), and it is
 * what keeps `<Theme background={on ? 'red' : undefined}>` rendering the same
 * tree in both states instead of remounting its subtree when a value appears.
 */
export function getInlineValuesFromProps(
  props: Record<string, any>,
  conf: TamaguiInternalConfig
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

  let configLayers = flatLayers.get(conf.themes)
  if (!configLayers) {
    configLayers = new Map()
    flatLayers.set(conf.themes, configLayers)
  }

  const cached = configLayers.get(cacheKey)
  if (cached) return cached

  const out: FlatBuckets = { values: {}, themes: null }
  for (const key in props) {
    if (reservedThemeProps[key]) continue
    const value = props[key]
    if (value == null) continue
    addFlatValue(out, key, value, conf)
  }

  const layer: InlineValues = {
    values: out.values as InlineValues['values'],
    themes: (out.themes || undefined) as InlineValues['themes'],
  }
  if (configLayers.size >= 10_000) {
    configLayers.clear()
  }
  configLayers.set(cacheKey, layer)
  return layer
}

const mergedThemeCache = new WeakMap<object, Map<string, Record<string, Variable>>>()

/**
 * Builds the merged theme for a <Variables> layer: parent theme spread plus
 * overridden keys as Variables, resolved per the shared contract (effective
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
  const name = themeName || 'light'
  const activeScheme = name.split('_')[0] === 'dark' ? 'dark' : 'light'

  const bucketNames = getThemedBucketNames(inline.themes)
  let matched: string[] | undefined
  for (const bucketName of bucketNames) {
    if (process.env.NODE_ENV === 'development') {
      warnOnUnknownThemeBucket(bucketName, conf)
    }
    if (bucketMatchesThemeName(bucketName, name)) {
      matched ||= []
      matched.push(bucketName)
    }
  }

  const cacheKey = `${getInlineValuesKey(inline)}|${activeScheme}|${matched ? matched.join(',') : ''}`

  // idempotency: re-applying the same layer to its own output is a no-op
  const existingInfo = (parentTheme as any)[inlineLayerKey] as InlineLayerInfo | undefined
  if (existingInfo?.key === cacheKey) {
    return parentTheme
  }

  let byKey = mergedThemeCache.get(parentTheme)
  if (byKey?.has(cacheKey)) {
    return byKey.get(cacheKey)!
  }

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
      const token = findToken(conf.tokensParsed, name)
      if (token) return token.val
      return value
    }
    if (value && typeof value === 'object') {
      return (value as { val: number }).val
    }
    return value
  }

  const info: InlineLayerInfo = {
    key: cacheKey,
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
        `Variables: "${key}" is not a theme key or config-declared variable (createTamagui({ variables })) — dropping. Native can't resolve undeclared keys, so declaring them keeps platforms in sync.`
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
        !findToken(conf.tokensParsed, v)) ||
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

  Object.defineProperty(merged, inlineLayerKey, {
    value: info,
    enumerable: false,
  })

  byKey ||= new Map()
  mergedThemeCache.set(parentTheme, byKey)
  if (byKey.size >= 10_000) {
    byKey.clear()
  }
  byKey.set(cacheKey, merged)
  return merged
}

/**
 * Config-level custom variables: merged into every base theme at createTamagui
 * time so they behave exactly like theme keys in every existing code path.
 * References resolve per-theme at parse time; sub-themes inherit through
 * proxyThemesToParents (native) and the cascade (web).
 */
export function mergeConfigVariablesIntoTheme(
  theme: Record<string, Variable>,
  themeName: string,
  variables: GenericVariables,
  tokensParsed: TokensParsed
) {
  const scheme = themeName.startsWith('dark') ? 'dark' : 'light'
  const resolving = new Set<string>()

  const resolveRawValue = (key: string, value: unknown): unknown => {
    if (typeof value === 'object' && value !== null) {
      if (isVariable(value)) return value.val
      if ('needsPx' in value) return value
      if ('light' in value || 'dark' in value) {
        return resolveRawValue(key, (value as any)[scheme] ?? (value as any).light)
      }
      return
    }
    if (typeof value === 'string') {
      const name = value
      // other config variables first (chains allowed, cycles dropped)
      if (name in variables && !(name in theme)) {
        if (resolving.has(name)) {
          warnOnce(
            `config-cycle:${name}`,
            `createTamagui variables: reference cycle at "${name}" — dropping.`
          )
          return
        }
        resolving.add(name)
        const res = resolveRawValue(name, variables[name])
        resolving.delete(name)
        return res
      }
      const themeValue = theme[name]
      if (themeValue !== undefined) {
        return isVariable(themeValue) ? themeValue.val : themeValue
      }
      const token = findToken(tokensParsed, name)
      return token ? token.val : value
    }
    return value
  }

  for (const key in variables) {
    // an explicit theme value always wins over a config variable default
    if (key in theme) continue
    let raw = resolveRawValue(key, variables[key])
    if (raw === undefined) continue
    let needsPx = typeof raw === 'number' && !isUnitlessVariableKey(key)
    if (typeof raw === 'object' && raw !== null && 'needsPx' in raw) {
      needsPx = true
      raw = (raw as unknown as { val: number }).val
    }
    const variable = createVariable({ key, name: key, val: raw as any })
    if (needsPx) {
      variable.needsPx = true
    }
    theme[key] = variable
  }
}
