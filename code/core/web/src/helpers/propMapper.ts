import { isAndroid } from '@tamagui/constants'
import { tokenCategories } from '@tamagui/helpers'
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
import { isKnownColorName } from '@tamagui/normalize-css-color'
import { expandStyle } from './expandStyle'
import { resolveVariableValue } from './resolveVariableValue'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { normalizeStyle } from './normalizeStyle'
import { isRemValue, resolveRem } from './resolveRem'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'

export const propMapper: PropMapper = (key, value, styleState, disabled, map) => {
  if (disabled) {
    return map(key, value)
  }

  if (!(process.env.TAMAGUI_TARGET === 'native' && isAndroid)) {
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
        variantValue.forEach(([key, value, originalValue]) => {
          map(key, value, originalValue)
        })
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
  const { staticConfig, conf, debug } = styleState
  const { variants } = staticConfig
  if (!variants) return

  const variant = variants[key]
  const variantMatch = getVariantDefinition(variant, value, conf, styleState)
  let variantValue = variantMatch?.value

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
        const name = staticConfig.componentName || '[UnnamedComponent]'
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
    const next: [string, any, any][] = []
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
            for (const [key, val, originalVal] of variantOut) {
              if (val == null) continue
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

export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize'

function mapTokenCategory(keys: Record<string, boolean>, category: StyleTokenCategory) {
  return Object.fromEntries(Object.keys(keys).map((key) => [key, category]))
}

// exported so the flat-value grammar adapter binds props to the same token
// categories the bare-token path already uses, rather than keeping a second table
export const tokenCategoryByProperty: Record<string, StyleTokenCategory> = {
  ...mapTokenCategory(tokenCategories.size, 'size'),
  ...mapTokenCategory(tokenCategories.radius, 'radius'),
  ...mapTokenCategory(tokenCategories.zIndex, 'zIndex'),
  // the transform family's x/y are lengths from the space scale (v6 decision:
  // `x="4"` resolves like `p="4"`), never the size category
  x: 'space',
  y: 'space',
  fontSize: 'fontSize',
  borderWidth: 'space',
  borderTopWidth: 'space',
  borderRightWidth: 'space',
  borderBottomWidth: 'space',
  borderLeftWidth: 'space',
  borderBlockWidth: 'space',
  borderBlockStartWidth: 'space',
  borderBlockEndWidth: 'space',
  borderInlineWidth: 'space',
  borderInlineStartWidth: 'space',
  borderInlineEndWidth: 'space',
  outlineOffset: 'space',
  outlineWidth: 'space',
  gap: 'space',
  rowGap: 'space',
  columnGap: 'space',
  top: 'space',
  right: 'space',
  bottom: 'space',
  left: 'space',
  inset: 'space',
  insetBlock: 'space',
  insetBlockEnd: 'space',
  insetBlockStart: 'space',
  insetInline: 'space',
  insetInlineEnd: 'space',
  insetInlineStart: 'space',
  margin: 'space',
  marginBlock: 'space',
  marginBlockEnd: 'space',
  marginBlockStart: 'space',
  marginInline: 'space',
  marginInlineEnd: 'space',
  marginInlineStart: 'space',
  marginTop: 'space',
  marginRight: 'space',
  marginBottom: 'space',
  marginEnd: 'space',
  marginLeft: 'space',
  marginHorizontal: 'space',
  marginStart: 'space',
  marginVertical: 'space',
  padding: 'space',
  paddingBlock: 'space',
  paddingBlockEnd: 'space',
  paddingBlockStart: 'space',
  paddingInline: 'space',
  paddingInlineEnd: 'space',
  paddingInlineStart: 'space',
  paddingTop: 'space',
  paddingRight: 'space',
  paddingBottom: 'space',
  paddingEnd: 'space',
  paddingLeft: 'space',
  paddingHorizontal: 'space',
  paddingStart: 'space',
  paddingVertical: 'space',
}

export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily'

export function getTokenCategoryForProperty(
  property: string
): RuntimeTokenCategory | undefined {
  if (property === 'fontFamily') return 'fontFamily'
  if (
    property === 'fontSize' ||
    property === 'fontWeight' ||
    property === 'lineHeight' ||
    property === 'letterSpacing'
  ) {
    return 'font'
  }
  return (
    tokenCategoryByProperty[property] ||
    (property in tokenCategories.color ? 'color' : undefined)
  )
}

// goes through specificity finding best matching variant function
type VariantDefinitionMatch = {
  value: any
}

function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
): VariantDefinitionMatch | undefined {
  if (!variant) return
  if (value === undefined) return
  if (typeof variant === 'function') {
    return { value: variant }
  }
  if (Object.prototype.hasOwnProperty.call(variant, value)) {
    return { value: variant[value] }
  }
  for (const { key, parts } of getCompiledVariantResolvers(variant)) {
    for (const part of parts) {
      if (matchesVariantResolver(part, value, conf, theme)) {
        return { value: variant[key] }
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
// the normalize-css-color table also holds RN-only extras absent from the
// CSSColorNames type; exclude them so resolver matching stays type-accurate
const isCSSColorName = (value: string) =>
  value !== 'transparent' && value !== 'burntsienna' && isKnownColorName(value)

function matchesVariantResolver(
  resolverName: VariantResolverName,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
) {
  const string = typeof value === 'string'
  const number = typeof value === 'number'
  const rem = string && remStringPattern.test(value)
  const token = (category: 'size' | 'space' | 'color' | 'radius' | 'zIndex') =>
    value != null && value in conf.tokensParsed[category]
  const themed = string && !!theme && value in theme
  const font = (
    category: 'size' | 'style' | 'transform' | 'lineHeight' | 'letterSpacing'
  ) => string && !!conf.fontsParsed.body?.[category]?.[value]
  const allowed = (category: 'size' | 'space' | 'radius' | 'zIndex') => {
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
        token(category) ||
        ((resolverName === 'Space' ||
          resolverName === 'Radius' ||
          resolverName === 'ZIndex') &&
          isVariable(value)) ||
        ((resolverName === 'Radius' || resolverName === 'ZIndex') && (number || rem)) ||
        allowed(category)
      )
    }
    case 'Color': {
      const slash = string ? value.lastIndexOf('/') : -1
      const opacity = slash === -1 ? NaN : Number(value.slice(slash + 1))
      const name = slash === -1 ? value : value.slice(0, slash)
      return (
        token('color') ||
        themed ||
        (Number.isInteger(opacity) &&
          opacity >= 0 &&
          opacity <= 100 &&
          (name in conf.tokensParsed.color || (!!theme && name in theme))) ||
        (string && isCSSColorName(value))
      )
    }
    case 'Theme':
      return themed
    case 'FontSize':
      return value === true || font('size') || number || rem
    case 'FontStyle':
      return font('style') || value === 'normal' || value === 'italic'
    case 'FontTransform':
      return (
        font('transform') ||
        value === 'none' ||
        value === 'capitalize' ||
        value === 'uppercase' ||
        value === 'lowercase'
      )
    case 'FontLineHeight':
      return font('lineHeight') || number || rem
    case 'FontLetterSpacing':
      return font('letterSpacing') || number || rem
    case 'number':
    case 'string':
    case 'boolean':
      return typeof value === resolverName
    case 'any':
      return true
  }
}
