import { isAndroid } from '@tamagui/constants'
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
import { skipProps } from './skipProps'

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

  if (!styleProps.noExpand) {
    if (variants && key in variants) {
      const variantValue = resolveVariants(key, value, styleProps, styleState, '')
      if (variantValue) {
        variantValue.forEach(([key, value]) => map(key, value))
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

  if (value != null) {
    if (typeof value === 'string') {
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

    const expanded = styleProps.noExpand ? null : expandStyle(key, value)

    if (expanded) {
      const max = expanded.length
      for (let i = 0; i < max; i++) {
        const [nkey, nvalue] = expanded[i]
        map(nkey, nvalue, originalValue)
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

  let variantValue = getVariantDefinition(variants[key], value, conf, styleState)

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
    const next = Object.entries(expanded)

    // store any changed font family (only support variables for now)
    if (fontFamilyResult && fontFamilyResult[0] === '$') {
      setLastFontFamilyToken(getVariableValue(fontFamilyResult))
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

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.info(`   - resolveTokensAndVariants`, key, value)
  }

  for (const _key in value) {
    const subKey = conf.shorthands[_key] || _key
    const val = value[_key]

    if (!styleProps.noSkip && subKey in skipProps) {
      continue
    }

    // Track context overrides for any key that's in context props (issues #3670, #3676)
    // Store the ORIGINAL token value (like '$8') before resolution so that
    // children's functional variants can look up token values
    if (staticConfig) {
      const contextProps =
        staticConfig.context?.props || staticConfig.parentStaticConfig?.context?.props
      if (contextProps && subKey in contextProps) {
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
            for (const [key, val] of variantOut) {
              if (val == null) continue
              if (key in pseudoDescriptors) {
                res[key] ??= {}
                Object.assign(res[key], val)
              } else {
                res[key] = val
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

  return res
}

const tokenCats = ['size', 'color', 'radius', 'space', 'zIndex'].map((name) => ({
  name,
  spreadName: `...${name}`,
}))

// goes through specificity finding best matching variant function
function getVariantDefinition(
  variant: any,
  value: any,
  conf: TamaguiInternalConfig,
  { theme }: Partial<GetStyleState>
) {
  if (!variant) return
  if (typeof variant === 'function') {
    return variant
  }
  const exact = variant[value]
  if (exact) {
    return exact
  }
  if (value != null) {
    const { tokensParsed } = conf
    for (const { name, spreadName } of tokenCats) {
      if (spreadName in variant) {
        // check tokens first
        if (name in tokensParsed && value in tokensParsed[name]) {
          return variant[spreadName]
        }
        // or check theme (only color lives in theme, others are in tokens)
        if (name === 'color' && theme && typeof value === 'string' && value[0] === '$') {
          const themeKey = value.slice(1)
          if (themeKey in theme) {
            return variant[spreadName]
          }
        }
      }
    }
    const fontSizeVariant = variant['...fontSize']
    if (fontSizeVariant && conf.fontSizeTokens.has(value)) {
      return fontSizeVariant
    }
  }
  // fallback to catch all | size
  return variant[`:${typeof value}`] || variant['...']
}
