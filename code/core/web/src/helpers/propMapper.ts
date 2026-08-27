import { isAndroid } from '@tamagui/constants'
import { scanFlatValue, type FlatValueHandler } from '@tamagui/style-grammar/runtime'
import { isVariable } from '../createVariable'
import type {
  GetStyleState,
  PropMapper,
  SplitStyleProps,
  StyleResolver,
  TamaguiInternalConfig,
  Variable,
  VariantSpreadFunction,
} from '../types'
import { variantResolverNames } from '../types'
import { isConditionalStyleObject, resolveClauseChain } from './directStyle'
import { expandStyle } from './expandStyle'
import { resolveVariableValue } from './resolveVariableValue'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { normalizeStyle } from './normalizeStyle'
import { isRemValue, resolveRem } from './resolveRem'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'

// reduces a conditional variant clause back to a flat value the downstream
// parser applies: string form (`"20 sm:40"`) when both sides are
// string-representable, otherwise the flat object form, which carries array
// and structured payloads faithfully. returns undefined only for the one
// unrepresentable mix: a clause-bearing string joined by a structured payload
export function appendFlatClause(
  state: GetStyleState,
  prev: unknown,
  conditionSource: string,
  value: unknown
): string | Record<string, any> | undefined {
  if (typeof value === 'string' || typeof value === 'number') {
    if (prev == null) return `${conditionSource}:${value}`
    if (typeof prev === 'string' || typeof prev === 'number') {
      return `${prev} ${conditionSource}:${value}`
    }
  }
  if (prev == null) return { [conditionSource]: value }
  if (typeof prev === 'string' && prev.includes(':')) return
  if (
    typeof prev === 'object' &&
    !Array.isArray(prev) &&
    !isVariable(prev) &&
    isConditionalStyleObject(state, prev as Record<string, any>)
  ) {
    return { ...(prev as Record<string, any>), [conditionSource]: value }
  }
  return { default: prev, [conditionSource]: value }
}

// pass state, source, saw chain, then payload/chain offset quadruples. only
// numeric offsets survive while authored variant code runs.
type VariantScanContext = any[]

const propMapperHandler: FlatValueHandler<VariantScanContext> = {
  segment(ctx, start, end, isBase, valid, source, chainStart, chainEnd, chainValid) {
    if (isBase) {
      if (valid && start < end) ctx.push(start, end, -1, -1)
      return
    }
    if (!chainValid) return
    const condition = resolveClauseChain(ctx[0], source, chainStart, chainEnd)
    if (condition && valid && start < end) {
      ctx.push(start, end, chainStart, chainEnd)
    }
  },
  chain(ctx) {
    ctx[2] = true
    return true
  },
  error(ctx) {
    ctx[2] = true
  },
}

export const propMapper: PropMapper = (key, value, styleState, disabled, map) => {
  if (disabled) {
    return map(key, value)
  }

  if (process.env.TAMAGUI_TARGET === 'native' && !isAndroid) {
    // this shouldnt be necessary and handled in the outer loop
    if (key === 'elevationAndroid') return
  }

  const { conf, styleProps, staticConfig } = styleState
  const { variants } = staticConfig

  // "unset" is a CSS-wide keyword: valid CSS on web, but React Native
  // style props reject it (e.g. aspectRatio throws "must be a number, a
  // ratio string or `auto`"). On native, clear anything an earlier prop or
  // styled default already merged for this key — matching web, where unset
  // resets toward initial — then drop the value so RN never sees it.
  if (process.env.TAMAGUI_TARGET === 'native' && value === 'unset') {
    const expandedKey =
      (!styleProps.disableExpandShorthands && conf.shorthands[key]) || key
    const expanded = styleProps.noExpand
      ? null
      : expandStyle(expandedKey, value, conf.settings.styleCompat || 'web')
    if (styleState.style) {
      if (expanded) {
        for (const [nkey] of expanded) {
          delete styleState.style[nkey]
        }
      } else {
        delete styleState.style[expandedKey]
      }
    }
    return
  }

  if (!styleProps.noExpand) {
    if (variants && key in variants) {
      const variantValue = resolveVariants(key, value, styleProps, styleState, '')
      if (variantValue) {
        for (const entry of variantValue) {
          map(entry[0], entry[1], entry[2], entry[3])
        }
        return
      }
    }
  }

  // handle shorthands
  if (!styleProps.disableExpandShorthands) {
    if (key in conf.shorthands) {
      key = conf.shorthands[key]
    }
  }

  // Capture original value before resolution (for context prop tracking)
  const originalValue = value

  // "safe" value -> env(safe-area-inset-*) on web, numeric inset on native.
  // expands multi-edge props (padding, inset, marginHorizontal, ...) into
  // per-side keys so each side gets its own edge value.
  if (value === 'safe' && isSafeAreaKey(key)) {
    const expanded = expandSafeAreaValue(key)
    if (expanded) {
      for (let i = 0; i < expanded.length; i++) {
        const [nkey, nvalue] = expanded[i]
        map(nkey, nvalue, originalValue)
      }
      return
    }
  }

  if (value != null) {
    if (typeof value === 'string') {
      value = isRemValue(value) ? resolveRem(value) : value
    } else if (isVariable(value)) {
      value = resolveVariableValue(key, value, styleProps.resolveValues)
    } else if (isRemValue(value)) {
      value = resolveRem(value)
    }
  }

  // strings stay whole so the direct scanner can distinguish CSS components
  // from modifier clauses before it emits them.

  if (value != null) {
    if (key === 'fontFamily' && typeof originalValue === 'string') {
      if (originalValue in conf.fontsParsed) {
        styleState.fontFamily = originalValue
      }
    }

    // strings stay whole for the direct flat-value scanner
    const expanded =
      styleProps.noExpand || typeof value === 'string'
        ? null
        : expandStyle(key, value, conf.settings.styleCompat || 'web')

    if (expanded) {
      const max = expanded.length
      for (let i = 0; i < max; i++) {
        const [nkey, nvalue, noriginalValue] = expanded[i]
        map(nkey, nvalue, noriginalValue ?? originalValue)
      }
    } else {
      map(key, value, originalValue)
    }
  }
}

const resolveVariants: StyleResolver = (
  key,
  value,
  styleProps,
  styleState,
  parentVariantKey
) => {
  const variantDefinition = styleState.staticConfig.variants?.[key]
  if (
    typeof value === 'string' &&
    value.indexOf(':') !== -1 &&
    // a variant can define a literal colon key like "16:9" — an exact match
    // wins over clause parsing
    !(
      variantDefinition &&
      typeof variantDefinition === 'object' &&
      value in variantDefinition
    )
  ) {
    // `scanFlatValue` is the same lexer `contributeStyleString` and the
    // canonical `parseValue` run, and `resolveClauseChain` is the same modifier
    // resolver the style path uses. A refused chain invalidates only its own
    // payload, and the shared lexer continues to later clauses.
    const scan: VariantScanContext = [styleState, value, false]

    scanFlatValue(value, propMapperHandler, scan)

    if (scan[2]) {
      let entries: [string, any, any?, string?][] | undefined
      for (let index = 3; index < scan.length; index += 4) {
        const resolved = resolveVariantValue(
          key,
          value.slice(scan[index] as number, scan[index + 1] as number),
          styleProps,
          styleState,
          parentVariantKey
        )
        if (!resolved) continue
        entries ||= []
        const chainStart = scan[index + 2] as number
        const modifier =
          chainStart === -1
            ? undefined
            : value.slice(chainStart, scan[index + 3] as number)
        for (const entry of resolved) {
          if (modifier !== undefined) entry[3] = modifier
          entries.push(entry)
        }
      }
      return entries || []
    }
    // no clause structure found: the colon belongs to the value itself
  }

  // the object spelling of a conditional variant prop mirrors the clause
  // string: density={{ default: 'compact', sm: 'roomy' }}. a payload object
  // with no default and no modifier first key (a functional variant's own
  // argument shape) falls through whole
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isVariable(value) &&
    isConditionalStyleObject(styleState, value)
  ) {
    let entries: [string, any, any?, string?][] | undefined
    for (const objKey in value) {
      const payload = value[objKey]
      if (payload == null) continue
      const resolved = resolveVariantValue(
        key,
        payload,
        styleProps,
        styleState,
        parentVariantKey
      )
      if (!resolved) continue
      entries ||= []
      for (const entry of resolved) {
        if (objKey !== 'default') entry[3] = objKey
        entries.push(entry)
      }
    }
    return entries || []
  }

  return resolveVariantValue(key, value, styleProps, styleState, parentVariantKey)
}

const resolveVariantValue: StyleResolver = (
  key,
  value,
  styleProps,
  styleState,
  parentVariantKey
) => {
  const { staticConfig, conf, debug } = styleState
  const { variants } = staticConfig
  if (!variants) return

  const variant = variants[key]
  let variantValue = getVariantDefinition(variant, value, conf, styleState)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.groupCollapsed(`♦️♦️♦️ resolve variant ${key}`)
    console.info({
      key,
      value,
      variantValue,
      variants,
    })
    console.groupEnd()
  }

  if (!variantValue) {
    // variant at key exists, but no matching variant
    // disabling warnings, its fine to pass through, could re-enable later somehoiw
    if (process.env.TAMAGUI_WARN_ON_MISSING_VARIANT === '1') {
      // don't warn on missing booleans
      if (typeof value !== 'boolean') {
        const name = styleState.styleProps.displayName || '[UnnamedComponent]'
        console.warn(
          `No variant found: ${name} has variant "${key}", but no matching value "${value}"`
        )
      }
    }
    return
  }

  if (typeof variantValue === 'function') {
    const fn = variantValue as VariantSpreadFunction<any>
    const extras = getVariantExtras(styleState)
    variantValue = fn(value, extras)

    if (
      process.env.NODE_ENV === 'development' &&
      debug === 'verbose' &&
      process.env.TAMAGUI_TARGET !== 'native'
    ) {
      console.groupCollapsed('   expanded functional variant', key)
      console.info({ fn, variantValue, extras })
      console.groupEnd()
    }
  }

  let fontFamilyResult: any

  if (isObj(variantValue)) {
    const fontFamilyUpdate =
      variantValue.fontFamily || variantValue[conf.inverseShorthands.fontFamily]

    if (fontFamilyUpdate) {
      fontFamilyResult = getFontFamilyFromNameOrVariable(fontFamilyUpdate, conf)
      styleState.fontFamily = fontFamilyResult

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info(`   updating font family`, fontFamilyResult)
      }
    }

    variantValue = resolveTokensAndVariants(
      key,
      variantValue,
      styleProps,
      styleState,
      parentVariantKey
    )
  }

  if (variantValue) {
    const expanded = normalizeStyle(variantValue, !!styleProps.noNormalize)

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.info(`   expanding styles from `, variantValue, `to`, expanded)
    }
    const originalValues = styleOriginalValues.get(expanded)

    // store any changed font family (only support variables for now)
    const next: [string, any, any, string?][] = []
    for (const key in expanded) {
      next.push([key, expanded[key], originalValues?.[key]])
    }
    return next
  }
}

// handles finding and resolving the fontFamily to the token name
// this is used as `font_[name]` in className for nice css variable support
export function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig) {
  if (isVariable(input)) {
    const val = variableToFontNameCache.get(input)
    if (val) return val
    for (const key in conf.fontsParsed) {
      const familyVariable = conf.fontsParsed[key].family
      if (isVariable(familyVariable)) {
        variableToFontNameCache.set(familyVariable, key)
        if (familyVariable === input) {
          return key
        }
      }
    }
  } else if (typeof input === 'string' && input in conf.fontsParsed) {
    return input
  }
}

const variableToFontNameCache = new WeakMap<Variable, string>()

const resolveTokensAndVariants: StyleResolver<object> = (
  key, // we dont use key assume value is object instead
  value,
  styleProps,
  styleState,
  parentVariantKey
) => {
  const { conf, staticConfig, debug } = styleState
  const { variants } = staticConfig
  const res = {}
  let originalValues: Record<string, any> | undefined

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.info(`   - resolveTokensAndVariants`, key, value)
  }

  for (const _key in value) {
    const subKey = conf.shorthands[_key] || _key
    const val = value[_key]

    if (!styleProps.noSkip && subKey in skipProps) {
      continue
    }

    originalValues ||= {}
    originalValues[subKey] = val

    // Track context overrides for any key that's in context props (issues #3670, #3676)
    // Store the ORIGINAL token value (like '8') before resolution so that
    // children's functional variants can look up token values
    if (staticConfig) {
      const contextProps =
        staticConfig.context?.props || staticConfig.parentStaticConfig?.context?.props
      const inheritedContextPropKeys =
        !staticConfig.context ||
        staticConfig.context === staticConfig.parentStaticConfig?.context
          ? staticConfig.parentStaticConfig?.contextProps
          : undefined
      const contextPropKeys = staticConfig.contextProps || inheritedContextPropKeys
      const isContextProp =
        (contextProps && subKey in contextProps) ||
        contextPropKeys?.includes(subKey) ||
        staticConfig.context?.propKeys?.includes(subKey) ||
        staticConfig.parentStaticConfig?.context?.propKeys?.includes(subKey)
      if (isContextProp) {
        styleState.overriddenContextProps ||= {}
        styleState.overriddenContextProps[subKey] = val
        // Also track the original token value separately
        styleState.originalContextPropValues ||= {}
        styleState.originalContextPropValues[subKey] = val
      }
    }

    if (styleProps.noExpand) {
      res[subKey] = val
    } else {
      if (variants && subKey in variants) {
        // avoids infinite loop if variant is matching a style prop
        // eg: { variants: { flex: { true: { flex: 2 } } } }
        if (parentVariantKey && parentVariantKey === key) {
          res[subKey] = val
        } else {
          const variantOut = resolveVariants(subKey, val, styleProps, styleState, key)

          // apply variant output in authored order
          if (variantOut) {
            for (const [key, val, originalVal, conditionSource] of variantOut) {
              if (val == null) continue
              if (conditionSource !== undefined) {
                const appended = appendFlatClause(
                  styleState,
                  res[key],
                  conditionSource,
                  val
                )
                if (appended === undefined) {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn(
                      `[tamagui] conditional variant value for "${key}" cannot join the existing clause string; dropping the clause`
                    )
                  }
                  continue
                }
                res[key] = appended
                continue
              }
              res[key] = val
              if (originalVal !== undefined) {
                originalValues ||= {}
                originalValues[key] = originalVal
              }
            }
          }
        }
        continue
      }
    }

    if (isVariable(val)) {
      res[subKey] = resolveVariableValue(subKey, val, styleProps.resolveValues)

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info(`variable`, subKey, res[subKey])
      }
      continue
    }

    if (typeof val === 'string') {
      res[subKey] = isRemValue(val) ? resolveRem(val) : val
      continue
    }

    if (isObj(val)) {
      const subObject = resolveTokensAndVariants(subKey, val, styleProps, styleState, key)

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info(`object`, subKey, subObject)
      }

      // structured style values such as shadowOffset
      res[subKey] ??= {}
      Object.assign(res[subKey], subObject)
      const subOriginalValues = styleOriginalValues.get(subObject)
      if (subOriginalValues) {
        const existing = styleOriginalValues.get(res[subKey])
        if (existing) {
          Object.assign(existing, subOriginalValues)
        } else {
          styleOriginalValues.set(res[subKey], { ...subOriginalValues })
        }
      }
    } else {
      // nullish values cant be tokens, need no extra parsing
      res[subKey] = val
    }
  }

  if (originalValues) {
    styleOriginalValues.set(res, originalValues)
  }

  return res
}

// the prop -> token-category tables live in their own module; re-exported
// here because they have always been part of this module's public surface
export * from './tokenCategories'

// goes through specificity finding best matching variant function
function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
): any {
  if (!variant) return
  if (value === undefined) return
  if (typeof variant === 'function') {
    return variant
  }
  if (Object.prototype.hasOwnProperty.call(variant, value)) {
    return variant[value]
  }
  for (const { key, parts } of getCompiledVariantResolvers(variant)) {
    for (const part of parts) {
      if (matchesVariantResolver(part, value, conf, theme)) {
        return variant[key]
      }
    }
  }

  return
}

type VariantResolverName = (typeof variantResolverNames)[number]

const variantResolverNameSet = new Set<string>(variantResolverNames)

type CompiledVariantResolver = {
  key: string
  parts: VariantResolverName[]
}

const variantResolverCache = new WeakMap<object, readonly CompiledVariantResolver[]>()

function getCompiledVariantResolvers(variant: object) {
  let cached = variantResolverCache.get(variant)
  if (cached) {
    return cached
  }
  const compiled: CompiledVariantResolver[] = []
  for (const key of Object.keys(variant)) {
    const parts = parseVariantResolverKey(key)
    if (parts) {
      compiled.push({ key, parts })
    }
  }
  variantResolverCache.set(variant, compiled)
  return compiled
}

function parseVariantResolverKey(key: string): VariantResolverName[] | null {
  if (!key) return null
  const parts = key.split('|').map((part) => part.trim())
  if (!parts.length) return null
  for (const part of parts) {
    if (!variantResolverNameSet.has(part)) {
      return null
    }
  }
  return parts as VariantResolverName[]
}

const numberStringPattern =
  /[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?|[+-]?0[xX][\da-fA-F]+|[+-]?0[bB][01]+|[+-]?0[oO][0-7]+/
const remStringPattern = new RegExp(`^(?:${numberStringPattern.source})rem$`)
const viewportValuePattern = new RegExp(
  `^(?:${numberStringPattern.source})(vw|dvw|lvw|svw|vh|dvh|lvh|svh)$`
)

function isAllowedStyleValue(
  category: 'size' | 'space' | 'radius' | 'zIndex',
  value: any,
  conf: TamaguiInternalConfig,
  string: boolean,
  number: boolean,
  rem: boolean
) {
  const hasSetting = Object.prototype.hasOwnProperty.call(
    conf.settings,
    'allowedStyleValues'
  )
  const configured = conf.settings.allowedStyleValues
  const setting =
    configured && typeof configured === 'object' ? configured[category] : configured
  const web =
    value === 'unset' ||
    value === 'inherit' ||
    (string && /^var\(.*\)$/.test(value)) ||
    ((category === 'size' || category === 'space') &&
      (value === 'max-content' ||
        value === 'min-content' ||
        (string &&
          (viewportValuePattern.test(value) || /^(calc|min|max)\(.*\)$/.test(value)))))
  const somewhat =
    category === 'size' || category === 'space'
      ? value === 'auto' || number || rem || (string && value.endsWith('%'))
      : number
  if (setting === 'strict') return false
  if (setting === 'strict-web') return web
  if (setting === 'somewhat-strict') return somewhat
  if (setting === 'somewhat-strict-web') return somewhat || web
  return (
    number || (string && (category === 'size' || category === 'space' || !hasSetting))
  )
}

function matchesVariantResolver(
  resolverName: VariantResolverName,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
) {
  const string = typeof value === 'string'
  const number = typeof value === 'number'
  const rem = string && remStringPattern.test(value)

  switch (resolverName) {
    case 'Size':
    case 'Space':
    case 'Radius':
    case 'ZIndex': {
      const category =
        resolverName === 'ZIndex'
          ? 'zIndex'
          : (resolverName.toLowerCase() as 'size' | 'space' | 'radius')
      return (
        value === true ||
        (value != null && value in conf.tokensParsed[category]) ||
        ((resolverName === 'Space' ||
          resolverName === 'Radius' ||
          resolverName === 'ZIndex') &&
          isVariable(value)) ||
        ((resolverName === 'Radius' || resolverName === 'ZIndex') && (number || rem)) ||
        isAllowedStyleValue(category, value, conf, string, number, rem)
      )
    }
    // a token or theme color, otherwise any string is taken to be a raw CSS
    // color and left for the browser to resolve. checking that against a CSS
    // color-name table costs 2.3KB gzip to reject values that were never valid
    // anyway. `red/50` opacity modifiers stay limited to token and theme
    // colors, which the branches above already covered.
    case 'Color':
      return (value != null && value in conf.tokensParsed.color) || string
    case 'Theme':
      return string && !!theme && value in theme
    case 'FontSize':
      return value === true || !!conf.fontsParsed.body?.size?.[value] || number || rem
    case 'FontStyle':
      return (
        !!conf.fontsParsed.body?.style?.[value] ||
        value === 'normal' ||
        value === 'italic'
      )
    case 'FontTransform':
      return (
        !!conf.fontsParsed.body?.transform?.[value] ||
        value === 'none' ||
        value === 'capitalize' ||
        value === 'uppercase' ||
        value === 'lowercase'
      )
    case 'FontLineHeight':
      return !!conf.fontsParsed.body?.lineHeight?.[value] || number || rem
    case 'FontLetterSpacing':
      return !!conf.fontsParsed.body?.letterSpacing?.[value] || number || rem
    case 'number':
    case 'string':
    case 'boolean':
      return typeof value === resolverName
    case 'any':
      return true
  }
}
