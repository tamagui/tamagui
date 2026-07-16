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
  conf: TamaguiInternalConfig
): ResolvedDeclarations => {
  const out: ResolvedDeclarations = []
  if (!valuesIn) return out
  const values = valuesIn as Record<string, VariableValIn>
  const keySet = getThemeKeySet(conf)
  for (const key of Object.keys(values).sort()) {
    const value = values[key]
    if (value == null) continue
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

// dev-only: sibling references that form a cycle compute to invalid CSS in the
// browser; detect and warn so it's debuggable
const devCheckCycles = (props: VariablesProps) => {
  if (process.env.NODE_ENV !== 'development') return
  const buckets = [props.values, props.dark, props.light]
  for (const bucketIn of buckets) {
    if (!bucketIn) continue
    const bucket = bucketIn as Record<string, VariableValIn>
    for (const key in bucket) {
      const seen = new Set<string>()
      let current = key
      while (true) {
        const value = bucket[current]
        if (typeof value !== 'string' || value[0] !== '$') break
        const next = value.slice(1)
        if (seen.has(next)) {
          warnOnce(
            `cycle:${key}`,
            `Variables: reference cycle detected at "${key}" — these values will not resolve.`
          )
          return
        }
        seen.add(next)
        if (!(next in bucket)) break
        current = next
      }
    }
  }
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
  devCheckCycles(props)

  const base = resolveDeclarations(props.values, conf)
  const dark = resolveDeclarations(props.dark, conf)
  const light = resolveDeclarations(props.light, conf)

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
