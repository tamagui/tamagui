import { simpleHash } from '@tamagui/helpers'
import { getSetting } from '../config'
import { createVariable, isVariable } from '../createVariable'
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

// bare $name token references scan categories in this fixed, documented order.
// qualified $category.name references (specificTokens) never hit this path.
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

const cssVariablePrefix = process.env.TAMAGUI_CSS_VARIABLE_PREFIX || ''

// theme-key custom property reference, matching the declaration side in
// getThemeCSSRules (simpleHash(themeKey, 40))
const themeKeyVar = (key: string) => `var(--${cssVariablePrefix}${simpleHash(key, 40)})`

/**
 * Resolves one <Variables> value to a CSS value string.
 * References emit var() so they stay live in the cascade; literals serialize
 * with the same unit rule numeric style props use (px unless unitless key).
 * Returns undefined for unresolvable references (dev-warned, dropped).
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
  if (value[0] !== '$') {
    return value
  }

  const name = value.slice(1)

  // theme keys and config-declared custom variables
  if (getThemeKeySet(conf).has(name)) {
    return themeKeyVar(name)
  }

  // qualified token: $category.name
  const specific = conf.specificTokens[value] as Variable | undefined
  if (specific) {
    return specific.variable
  }

  // bare token name, fixed category order
  let found: string | undefined
  for (const category of tokenCategoryOrder) {
    const token = conf.tokensParsed[category]?.[value] as Variable | undefined
    if (token) {
      if (found === undefined) {
        found = token.variable
        if (process.env.NODE_ENV !== 'development') break
      } else {
        warnOnce(
          `ambiguous:${value}`,
          `Variables: "${value}" exists in multiple token categories, using "${tokenCategoryOrder.find((c) => conf.tokensParsed[c]?.[value])}". Use the qualified form ($category.name) to disambiguate.`
        )
        break
      }
    }
  }
  if (found !== undefined) {
    return found
  }

  warnOnce(
    `missing:${value}`,
    `Variables: reference "${value}" doesn't match any theme key, custom variable, or token — dropping.`
  )
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

// sibling references that form a cycle compute to invalid CSS in the browser
// and are unresolvable in the native fixed-point resolver. contract
// (plans/variables.md): a key whose reference chain reaches a cycle in EITHER
// scheme-effective map ({...values, ...light} / {...values, ...dark}) is
// dropped from all emission, in every mode, so web and native stay identical
// regardless of the active scheme.
const getCycleDroppedKeys = (props: VariablesProps): Set<string> | null => {
  const values = props.values as Record<string, VariableValIn> | undefined
  const light = props.light as Record<string, VariableValIn> | undefined
  const dark = props.dark as Record<string, VariableValIn> | undefined

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
        if (typeof value !== 'string' || value[0] !== '$') break
        const next = value.slice(1)
        if (!(next in map)) break
        current = next
      }
    }
  }

  check({ ...values, ...light })
  check({ ...values, ...dark })

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
 * Scheme scoping supports two levels of light/dark inversion, matching the
 * theme system's own selector strategy (getThemeCSSRules).
 */
export function getVariablesCSSRules(
  props: VariablesProps,
  conf: TamaguiInternalConfig
): VariablesCSS | null {
  const cycleDropped = getCycleDroppedKeys(props)

  const base = resolveDeclarations(props.values, conf, cycleDropped)
  const dark = resolveDeclarations(props.dark, conf, cycleDropped)
  const light = resolveDeclarations(props.light, conf, cycleDropped)

  if (!base.length && !dark.length && !light.length) {
    return null
  }

  const prefersColorThemes = !!getSetting('shouldAddPrefersColorThemes')
  const payload = JSON.stringify([base, dark, light, prefersColorThemes])

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
  rulesCache.set(payload, result)
  return result
}

// ---- inline theme layer (<Variables> on native + JS theme readers on web) ----

type InlineValues = Pick<VariablesProps, 'values' | 'dark' | 'light'>

// non-enumerable marker on merged theme objects: cache key for idempotency,
// overridden key set, and literal light/dark pairs for the iOS fast-scheme path
export const inlineLayerKey = '_tmgInlineLayer'

export type InlineLayerInfo = {
  key: string
  overridden: Set<string>
  pairs: Record<string, { light: string | number; dark: string | number }>
}

const serializeBucket = (bucket: VariablesProps['values']): string => {
  if (!bucket) return ''
  const map = bucket as Record<string, VariableValIn>
  return Object.keys(map)
    .sort()
    .map((key) => {
      const value = map[key]
      if (value && typeof value === 'object') return `${key}:px${value.val}`
      return `${key}:${value}`
    })
    .join(',')
}

export const getInlineValuesKey = (inline: InlineValues): string =>
  `${serializeBucket(inline.values)};${serializeBucket(inline.dark)};${serializeBucket(inline.light)}`

const mergedThemeCache = new WeakMap<object, Map<string, Record<string, Variable>>>()

/**
 * Builds the merged theme for a <Variables> layer: parent theme spread plus
 * overridden keys as Variables, resolved per the shared contract (effective
 * scheme map, fixed-point references, cycle-involved keys dropped in both
 * schemes). Returns the parent theme unchanged when nothing applies.
 * Identity-stable per (parentTheme, values, scheme) so snapshot bailouts and
 * proxy caches hold.
 */
export function getMergedInlineTheme(
  parentTheme: Record<string, Variable>,
  inline: InlineValues,
  scheme: 'light' | 'dark' | undefined,
  conf: TamaguiInternalConfig
): Record<string, Variable> {
  const activeScheme = scheme === 'dark' ? 'dark' : 'light'
  const cacheKey = `${getInlineValuesKey(inline)}|${activeScheme}`

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
  const light = (inline.light || {}) as Record<string, VariableValIn>
  const dark = (inline.dark || {}) as Record<string, VariableValIn>
  const effective = { ...values, ...(activeScheme === 'dark' ? dark : light) }
  const opposite = { ...values, ...(activeScheme === 'dark' ? light : dark) }
  const dropped = getCycleDroppedKeys(inline)
  const keySet = getThemeKeySet(conf)

  // resolve one key within an effective map to a raw value (fixed-point over
  // sibling refs, then parent theme, then tokens); undefined = drop
  const resolveRaw = (keyIn: string, map: Record<string, VariableValIn>): unknown => {
    let key = keyIn
    let value: VariableValIn | undefined = map[key]
    while (typeof value === 'string' && value[0] === '$') {
      const name = value.slice(1)
      if (name in map && !dropped?.has(name)) {
        key = name
        value = map[name]
        continue
      }
      const themeValue = parentTheme[name]
      if (themeValue !== undefined) {
        return isVariable(themeValue) ? themeValue.val : themeValue
      }
      const specific = conf.specificTokens[value] as Variable | undefined
      if (specific) return specific.val
      for (const category of tokenCategoryOrder) {
        const token = conf.tokensParsed[category]?.[value] as Variable | undefined
        if (token) return token.val
      }
      warnOnce(
        `missing:${value}`,
        `Variables: reference "${value}" doesn't match any theme key, custom variable, or token — dropping.`
      )
      return
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
      (typeof v === 'string' && v[0] !== '$') || typeof v === 'number'
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

  if (!didOverride && !existingInfo) {
    return parentTheme
  }

  Object.defineProperty(merged, inlineLayerKey, {
    value: info,
    enumerable: false,
  })

  byKey ||= new Map()
  mergedThemeCache.set(parentTheme, byKey)
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
  specificTokens: Record<string, Variable>,
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
    if (typeof value === 'string' && value[0] === '$') {
      const name = value.slice(1)
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
      const specific = specificTokens[value]
      if (specific) return specific.val
      for (const category of tokenCategoryOrder) {
        const token = tokensParsed[category]?.[value] as Variable | undefined
        if (token) return token.val
      }
      warnOnce(
        `config-missing:${value}`,
        `createTamagui variables: reference "${value}" for "${key}" doesn't match any theme key, variable, or token — dropping.`
      )
      return
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
