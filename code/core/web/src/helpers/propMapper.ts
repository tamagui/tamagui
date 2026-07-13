import { isAndroid } from '@tamagui/constants'
import { tokenCategories } from '@tamagui/helpers'
import { resolveDefaultSizeToken } from '../config'
import { getVariableValue, isVariable } from '../createVariable'
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
import { cssColorNames } from '../interfaces/CSSColorNames'
import { expandStyle } from './expandStyle'
import {
  getLastFontFamilyToken,
  getTokenForKey,
  resolveVariableValue,
  setLastFontFamilyToken,
} from './getTokenForKey'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { normalizeStyle } from './normalizeStyle'
import { parseNativeStyle } from './parseNativeStyle'
import { pseudoDescriptors } from './pseudoDescriptors'
import { resolveCompoundTokens } from './resolveCompoundTokens'
import { isRemValue, resolveRem } from './resolveRem'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { skipProps } from './skipProps'
import { styleOriginalValues } from './styleOriginalValues'

export { getTokenForKey } from './getTokenForKey'

export const propMapper: PropMapper = (key, value, styleState, disabled, map) => {
  if (disabled) {
    return map(key, value)
  }

  setLastFontFamilyToken(null)

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
    if (value === true && key in defaultSizeTokenKeys) {
      value = getTokenForKey(
        key,
        resolveDefaultSizeToken(value, conf),
        styleProps,
        styleState
      )
    } else if (typeof value === 'string') {
      if (value[0] === '$') {
        value = getTokenForKey(key, value, styleProps, styleState)
      } else {
        const resolved = resolveCompoundTokens(key, value, styleProps, styleState)
        value =
          resolved !== value ? resolved : isRemValue(value) ? resolveRem(value) : value
      }
    } else if (isVariable(value)) {
      value = resolveVariableValue(key, value, styleProps.resolveValues)
    } else if (isRemValue(value)) {
      value = resolveRem(value)
    }
  }

  // on native, parse string backgroundImage/boxShadow/textShadow to RN object format
  // this handles both token-resolved strings and plain strings without tokens
  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    value != null &&
    typeof value === 'string' &&
    (key === 'backgroundImage' || key === 'boxShadow' || key === 'textShadow')
  ) {
    const parsed = parseNativeStyle(key, value)
    if (parsed) {
      // textShadow returns [key, value] pairs to expand into separate properties
      if (key === 'textShadow' && Array.isArray(parsed) && Array.isArray(parsed[0])) {
        for (const [nkey, nvalue] of parsed) {
          map(nkey, nvalue, originalValue)
        }
        return
      }
      value = parsed
    }
  }

  if (value != null) {
    const fontToken = getLastFontFamilyToken()
    if (key === 'fontFamily' && fontToken) {
      styleState.fontFamily = fontToken
    }

    const expanded = styleProps.noExpand
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
    if (variantMatch?.resolveDefaultSize) {
      value = resolveDefaultSizeToken(value, conf)
    }
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
    const next = Object.entries(expanded)
    const originalValues = styleOriginalValues.get(expanded)

    // store any changed font family (only support variables for now)
    if (fontFamilyResult && fontFamilyResult[0] === '$') {
      setLastFontFamilyToken(getVariableValue(fontFamilyResult))
    }

    return next.map(([key, value]) => [key, value, originalValues?.[key]])
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
  } else if (typeof input === 'string') {
    if (input[0] === '$') {
      return input
    }
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
  const { conf, staticConfig, debug, theme } = styleState
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
    // Store the ORIGINAL token value (like '$8') before resolution so that
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
          res[subKey] =
            val[0] === '$' ? getTokenForKey(subKey, val, styleProps, styleState) : val
        } else {
          const variantOut = resolveVariants(subKey, val, styleProps, styleState, key)

          // apply, merging sub-styles
          if (variantOut) {
            for (const [key, val, originalVal] of variantOut) {
              if (val == null) continue
              if (key in pseudoDescriptors) {
                res[key] ??= {}
                Object.assign(res[key], val)
                const subOriginalValues = styleOriginalValues.get(val)
                if (subOriginalValues) {
                  styleOriginalValues.set(res[key], {
                    ...styleOriginalValues.get(res[key]),
                    ...subOriginalValues,
                  })
                }
              } else {
                res[key] = val
                if (originalVal !== undefined) {
                  originalValues ||= {}
                  originalValues[key] = originalVal
                }
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

    // boolean token shorthand (borderRadius: true etc) inside variant styles —
    // mirrors the direct-prop gate in map(); without this the raw `true` reaches
    // drivers (rn driver throws constructing Animated.Value(true))
    if (val === true && subKey in defaultSizeTokenKeys) {
      res[subKey] = getTokenForKey(
        subKey,
        resolveDefaultSizeToken(val, conf),
        styleProps,
        styleState
      )
      continue
    }

    if (typeof val === 'string') {
      const fVal =
        val[0] === '$'
          ? getTokenForKey(subKey, val, styleProps, styleState)
          : resolveCompoundTokens(subKey, val, styleProps, styleState)

      res[subKey] = fVal === val && isRemValue(val) ? resolveRem(val) : fVal
      continue
    }

    if (isObj(val)) {
      const subObject = resolveTokensAndVariants(subKey, val, styleProps, styleState, key)

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        console.info(`object`, subKey, subObject)
      }

      // sub-objects: media queries, pseudos, shadowOffset
      res[subKey] ??= {}
      Object.assign(res[subKey], subObject)
      const subOriginalValues = styleOriginalValues.get(subObject)
      if (subOriginalValues) {
        styleOriginalValues.set(res[subKey], {
          ...styleOriginalValues.get(res[subKey]),
          ...subOriginalValues,
        })
      }
    } else {
      // nullish values cant be tokens, need no extra parsing
      res[subKey] = val
    }

    if (process.env.NODE_ENV === 'development') {
      if (debug) {
        if (res[subKey]?.[0] === '$') {
          console.warn(
            `⚠️ Missing token in theme ${theme.name}:`,
            subKey,
            res[subKey],
            theme
          )
        }
      }
    }
  }

  if (originalValues) {
    styleOriginalValues.set(res, originalValues)
  }

  return res
}

const defaultSizeTokenKeys: Record<string, boolean> = {
  ...tokenCategories.size,
  ...tokenCategories.radius,
  ...tokenCategories.zIndex,
  gap: true,
  rowGap: true,
  columnGap: true,
  top: true,
  right: true,
  bottom: true,
  left: true,
  inset: true,
  insetBlock: true,
  insetBlockEnd: true,
  insetBlockStart: true,
  insetInline: true,
  insetInlineEnd: true,
  insetInlineStart: true,
  margin: true,
  marginBlock: true,
  marginBlockEnd: true,
  marginBlockStart: true,
  marginInline: true,
  marginInlineEnd: true,
  marginInlineStart: true,
  marginTop: true,
  marginRight: true,
  marginBottom: true,
  marginEnd: true,
  marginLeft: true,
  marginHorizontal: true,
  marginStart: true,
  marginVertical: true,
  padding: true,
  paddingBlock: true,
  paddingBlockEnd: true,
  paddingBlockStart: true,
  paddingInline: true,
  paddingInlineEnd: true,
  paddingInlineStart: true,
  paddingTop: true,
  paddingRight: true,
  paddingBottom: true,
  paddingEnd: true,
  paddingLeft: true,
  paddingHorizontal: true,
  paddingStart: true,
  paddingVertical: true,
}

// goes through specificity finding best matching variant function
function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
) {
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
        return {
          value: variant[key],
          resolveDefaultSize: value === true && defaultSizeResolverNames.has(part),
        }
      }
    }
  }

  const legacyValue =
    value === true && hasLegacyDefaultSizeResolver(variant)
      ? resolveDefaultSizeToken(value, conf)
      : value

  if (legacyValue != null) {
    const { tokensParsed } = conf
    for (const { name, spreadName } of legacyTokenCats) {
      if (spreadName in variant) {
        // check tokens first
        if (name in tokensParsed && legacyValue in tokensParsed[name]) {
          return {
            value: variant[spreadName],
            resolveDefaultSize:
              value === true && legacyDefaultSizeSpreadNames.has(spreadName),
          }
        }
        // or check theme (only color lives in theme, others are in tokens)
        if (
          name === 'color' &&
          theme &&
          typeof legacyValue === 'string' &&
          legacyValue[0] === '$'
        ) {
          const themeKey = legacyValue.slice(1)
          if (themeKey in theme) {
            return {
              value: variant[spreadName],
              resolveDefaultSize:
                value === true && legacyDefaultSizeSpreadNames.has(spreadName),
            }
          }
        }
      }
    }
    const fontSizeVariant = variant['...fontSize']
    if (fontSizeVariant && conf.fontSizeTokens.has(legacyValue)) {
      return {
        value: fontSizeVariant,
        resolveDefaultSize: value === true,
      }
    }
  }
  // fallback to catch all | size
  const fallback = variant[`:${typeof value}`] || variant['...']
  return fallback ? { value: fallback } : undefined
}

type VariantResolverName = (typeof variantResolverNames)[number]

const variantResolverNameSet = new Set<string>(variantResolverNames)

const legacyTokenCats = ['size', 'color', 'radius', 'space', 'zIndex'].map((name) => ({
  name,
  spreadName: `...${name}`,
}))

const defaultSizeResolverNames = new Set<VariantResolverName>([
  'Size',
  'Space',
  'FontSize',
])

const legacyDefaultSizeSpreadNames = new Set(['...size', '...space'])

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
  if (!key || key[0] === ':' || key.startsWith('...')) {
    return null
  }
  const parts = key.split('|').map((part) => part.trim())
  if (!parts.length) return null
  for (const part of parts) {
    if (!variantResolverNameSet.has(part)) {
      return null
    }
  }
  return parts as VariantResolverName[]
}

function matchesVariantResolver(
  resolverName: VariantResolverName,
  value: any,
  conf: TamaguiInternalConfig,
  theme: Partial<GetStyleState>['theme']
) {
  if (value === true && defaultSizeResolverNames.has(resolverName)) {
    return true
  }
  switch (resolverName) {
    case 'Size':
      return (
        value === true ||
        isTokenCategoryValue(conf, 'size', value) ||
        isSpecificTokenValue(conf, value) ||
        matchesAllowedStyleValue(conf, 'size', value)
      )
    case 'Space':
      return (
        value === true ||
        isTokenCategoryValue(conf, 'space', value) ||
        isSpecificTokenValue(conf, value) ||
        isVariable(value) ||
        matchesAllowedStyleValue(conf, 'space', value)
      )
    case 'Color':
      return (
        isTokenCategoryValue(conf, 'color', value) ||
        isThemeValue(theme, value) ||
        isSpecificTokenValue(conf, value) ||
        isDollarTokenWithOpacity(value) ||
        isCSSColorName(value)
      )
    case 'Radius':
      return (
        value === true ||
        isTokenCategoryValue(conf, 'radius', value) ||
        isSpecificTokenValue(conf, value) ||
        isVariable(value) ||
        isRemString(value) ||
        isNumericValue(value) ||
        matchesAllowedStyleValue(conf, 'radius', value)
      )
    case 'ZIndex':
      return (
        value === true ||
        isTokenCategoryValue(conf, 'zIndex', value) ||
        isSpecificTokenValue(conf, value) ||
        isVariable(value) ||
        isNumericValue(value) ||
        matchesAllowedStyleValue(conf, 'zIndex', value)
      )
    case 'Theme':
      return isThemeValue(theme, value)
    case 'FontSize':
      return (
        value === true ||
        isBodyFontToken(conf, 'size', value) ||
        isNumericValue(value) ||
        isRemString(value)
      )
    case 'FontStyle':
      return (
        isBodyFontToken(conf, 'style', value) || value === 'normal' || value === 'italic'
      )
    case 'FontTransform':
      return (
        isBodyFontToken(conf, 'transform', value) ||
        value === 'none' ||
        value === 'capitalize' ||
        value === 'uppercase' ||
        value === 'lowercase'
      )
    case 'FontLineHeight':
      return (
        isBodyFontToken(conf, 'lineHeight', value) ||
        isNumericValue(value) ||
        isRemString(value)
      )
    case 'FontLetterSpacing':
      return (
        isBodyFontToken(conf, 'letterSpacing', value) ||
        isNumericValue(value) ||
        isRemString(value)
      )
    case 'number':
      return typeof value === 'number'
    case 'string':
      return typeof value === 'string'
    case 'boolean':
      return typeof value === 'boolean'
    case 'any':
      return true
  }
}

function hasLegacyDefaultSizeResolver(variant: any) {
  return '...size' in variant || '...space' in variant || '...fontSize' in variant
}

function isTokenCategoryValue(
  conf: TamaguiInternalConfig,
  category: 'size' | 'space' | 'color' | 'radius' | 'zIndex',
  value: any
) {
  return Boolean(
    value != null && category in conf.tokensParsed && value in conf.tokensParsed[category]
  )
}

function isThemeValue(theme: Partial<GetStyleState>['theme'], value: any) {
  if (!theme || typeof value !== 'string' || value[0] !== '$') {
    return false
  }
  return value.slice(1) in theme
}

function isNumericValue(value: any) {
  return typeof value === 'number'
}

const cssColorNameSet = new Set<string>(cssColorNames)

function isCSSColorName(value: any) {
  return typeof value === 'string' && cssColorNameSet.has(value)
}

function isDollarTokenWithOpacity(value: any) {
  return typeof value === 'string' && tokenWithOpacityPattern.test(value)
}

function isSpecificTokenValue(conf: TamaguiInternalConfig, value: any) {
  if (typeof value !== 'string') return false
  const hasSetting = Object.prototype.hasOwnProperty.call(
    conf.settings,
    'autocompleteSpecificTokens'
  )
  const setting = conf.settings.autocompleteSpecificTokens
  if (hasSetting && (setting === undefined || setting === 'except-special')) {
    return false
  }
  return value in conf.specificTokens
}

type AllowedCategory = 'size' | 'space' | 'radius' | 'zIndex'

function matchesAllowedStyleValue(
  conf: TamaguiInternalConfig,
  category: AllowedCategory,
  value: any
) {
  const { setting, isGloballyAbsent } = getAllowedStyleValuesSetting(conf, category)
  switch (setting) {
    case 'strict':
      return false
    case 'strict-web':
      return isWebAllowedValue(category, value)
    case 'somewhat-strict':
      return isSomewhatStrictValue(category, value)
    case 'somewhat-strict-web':
      return isSomewhatStrictValue(category, value) || isWebAllowedValue(category, value)
    default:
      return isLooseAllowedValue(category, value, isGloballyAbsent)
  }
}

function getAllowedStyleValuesSetting(
  conf: TamaguiInternalConfig,
  category: AllowedCategory
) {
  const hasSetting = Object.prototype.hasOwnProperty.call(
    conf.settings,
    'allowedStyleValues'
  )
  if (!hasSetting) {
    return { setting: undefined, isGloballyAbsent: true }
  }
  const setting = conf.settings.allowedStyleValues
  if (setting && typeof setting === 'object') {
    return { setting: setting[category], isGloballyAbsent: false }
  }
  return { setting, isGloballyAbsent: false }
}

function isSomewhatStrictValue(category: AllowedCategory, value: any) {
  switch (category) {
    case 'size':
    case 'space':
      return (
        value === 'auto' ||
        isNumericValue(value) ||
        isRemString(value) ||
        isPercentString(value)
      )
    case 'radius':
    case 'zIndex':
      return isNumericValue(value)
  }
}

function isLooseAllowedValue(
  category: AllowedCategory,
  value: any,
  isGloballyAbsent: boolean
) {
  if (isNumericValue(value)) return true
  if (typeof value !== 'string') return false
  if (category === 'radius' || category === 'zIndex') {
    return isGloballyAbsent
  }
  return true
}

function isWebAllowedValue(category: AllowedCategory, value: any) {
  return (
    isWebUniversalValue(value) ||
    ((category === 'size' || category === 'space') && isWebOnlySizeValue(value))
  )
}

function isWebUniversalValue(value: any) {
  return (
    value === 'unset' ||
    value === 'inherit' ||
    (typeof value === 'string' && /^var\(.*\)$/.test(value))
  )
}

function isWebOnlySizeValue(value: any) {
  return (
    value === 'max-content' ||
    value === 'min-content' ||
    (typeof value === 'string' &&
      (viewportValuePattern.test(value) || /^(calc|min|max)\(.*\)$/.test(value)))
  )
}

const numberStringPattern =
  /[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?|[+-]?0[xX][\da-fA-F]+|[+-]?0[bB][01]+|[+-]?0[oO][0-7]+/
const tokenWithOpacityPattern = new RegExp(`^\\$.*\\/(?:${numberStringPattern.source})$`)
const remStringPattern = new RegExp(`^(?:${numberStringPattern.source})rem$`)
const viewportValuePattern = new RegExp(
  `^(?:${numberStringPattern.source})(vw|dvw|lvw|svw|vh|dvh|lvh|svh)$`
)

function isRemString(value: any) {
  return typeof value === 'string' && remStringPattern.test(value)
}

function isPercentString(value: any) {
  return typeof value === 'string' && value.endsWith('%')
}

function isBodyFontToken(
  conf: TamaguiInternalConfig,
  category: 'size' | 'style' | 'transform' | 'lineHeight' | 'letterSpacing',
  value: any
) {
  if (typeof value !== 'string') return false
  const bodyFont = conf.fontsParsed.$body
  const fontCategory = bodyFont?.[category]
  return Boolean(fontCategory && value in fontCategory)
}
