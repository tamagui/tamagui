import { isAndroid, isWeb } from '@tamagui/constants'

import { isDevTools } from '../constants/isDevTools'
import { Variable, getVariableValue, isVariable } from '../createVariable'
import type {
  DebugProp,
  GetStyleState,
  PropMapper,
  StaticConfigParsed,
  StyleResolver,
  TamaguiInternalConfig,
  VariantSpreadFunction,
} from '../types'
import { expandStyle } from './expandStyle'
import { expandStyles } from './expandStyles'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { mergeProps } from './mergeProps'
import { pseudoDescriptors } from './pseudoDescriptors'

export type ResolveVariableTypes =
  | 'auto'
  | 'value'
  | 'variable'
  | 'both'
  | 'non-color-value'

export const createPropMapper = (staticConfig: StaticConfigParsed) => {
  // temp remove classnames
  const defaultProps = mergeProps(staticConfig.defaultProps || {}, {}, false)[0]

  const mapper: PropMapper = (
    key,
    value,
    propsIn,
    styleStateIn,
    avoidDefaultProps = false
  ) => {
    if (!(process.env.TAMAGUI_TARGET === 'native' && isAndroid)) {
      if (key === 'elevationAndroid') {
        return
      }
    }

    // we use this for the sub-props like pseudos so we need to overwrite the "props" in styleState
    const styleState = {
      ...styleStateIn,
      // awkward bit thanks for static
      props: styleStateIn.state.fallbackProps || propsIn,
    }

    const { conf, state, fontFamily } = styleState
    const returnVariablesAs = state.resolveVariablesAs === 'value' ? 'value' : 'auto'

    if (
      process.env.NODE_ENV === 'development' &&
      fontFamily &&
      fontFamily[0] === '$' &&
      !(fontFamily in conf.fontsParsed)
    ) {
      console.warn(
        `Warning: no fontFamily "${fontFamily}" found in config: ${Object.keys(
          conf.fontsParsed
        ).join(', ')}`
      )
    }

    const variantValue = resolveVariants(
      key,
      value,
      styleState,
      defaultProps,
      returnVariablesAs,
      '',
      avoidDefaultProps
    )

    if (variantValue) {
      return variantValue
    }

    let shouldReturn = value != null

    // handle shorthands
    if (key in conf.shorthands) {
      shouldReturn = true
      key = conf.shorthands[key]
    }

    if (value) {
      if (value[0] === '$') {
        value = getToken(key, value, styleState, returnVariablesAs)
      } else if (isVariable(value)) {
        value = resolveVariableValue(key, value, returnVariablesAs)
      }
    }

    if (shouldReturn) {
      return expandStyle(key, value) || [[key, value]]
    }
  }

  return mapper
}

const resolveVariants: StyleResolver = (
  key,
  value,
  styleState,
  defaultProps,
  returnVariablesAs,
  parentVariantKey,
  avoidDefaultProps = false
) => {
  const { staticConfig, fontFamily, conf, debug } = styleState
  const { variants } = staticConfig

  if (!variants || !(key in variants) || value === undefined) {
    return
  }

  let variantValue = getVariantDefinition(variants[key], key, value, conf)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log(' - resolve variant', { key, value, variantValue })
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
    variantValue = fn(
      value,
      getVariantExtras(styleState, defaultProps, avoidDefaultProps)
    )

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('expanded functional variant', key)
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log({ fn, variantValue })
      console.groupEnd()
    }
  }

  let fontFamilyResult: any

  if (isObj(variantValue)) {
    const fontFamilyUpdate =
      variantValue.fontFamily || variantValue[conf.inverseShorthands.fontFamily]

    if (fontFamilyUpdate) {
      styleState.fontFamily = getFontFamilyFromNameOrVariable(fontFamilyUpdate, conf)
    }

    variantValue = resolveTokensAndVariants(
      key,
      variantValue,
      styleState,
      defaultProps,
      returnVariablesAs,
      parentVariantKey,
      avoidDefaultProps
    )
  }

  if (variantValue) {
    const expanded = expandStyles(variantValue)

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('completing variant', key)
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log({ expanded })
      console.groupEnd()
    }

    const next = Object.entries(expanded)

    // store any changed font family (only support variables for now)
    if (fontFamilyResult && fontFamilyResult[0] === '$') {
      fontFamilyCache.set(next, getVariableValue(fontFamilyResult))
    }

    return next
  }
}

// handles finding and resolving the fontFamily to the token name
// this is used as `font_[name]` in className for nice css variable support
export function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig) {
  if (isVariable(input)) {
    const val = variableToFontNameCache.get(input)
    if (val) {
      return val
    } else {
      for (const key in conf.fontsParsed) {
        const familyVariable = conf.fontsParsed[key].family
        if (isVariable(familyVariable)) {
          variableToFontNameCache.set(familyVariable, key)
          if (familyVariable === input) {
            return key
          }
        }
      }
    }
  } else if (typeof input === 'string') {
    if (input?.[0] === '$') {
      return input
    } else {
      // this could be mapped back to
      if (process.env.NODE_ENV === 'development') {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('[tamagui] should map back', input)
      }
    }
  }
}

const variableToFontNameCache = new WeakMap<Variable, string>()

// special helper for special font family
const fontFamilyCache = new WeakMap()
export const getPropMappedFontFamily = (expanded?: any) => {
  return expanded && fontFamilyCache.get(expanded)
}

const resolveTokensAndVariants: StyleResolver<Object> = (
  key, // we dont use key assume value is object instead
  value,
  styleState,
  defaultProps,
  returnVariablesAs,
  parentVariantKey,
  avoidDefaultProps
) => {
  const { conf, staticConfig, debug, theme } = styleState
  const { variants } = staticConfig
  const res = {}

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log(`   - resolveTokensAndVariants`, key, value)
  }

  for (const rKey in value) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = value[rKey]

    if (variants && fKey in variants) {
      // avoids infinite loop if variant is matching a style prop
      // eg: { variants: { flex: { true: { flex: 2 } } } }
      if (parentVariantKey && parentVariantKey === key) {
        res[fKey] = val
      } else {
        const variantOut = resolveVariants(
          fKey,
          val,
          styleState,
          defaultProps,
          returnVariablesAs,
          key,
          avoidDefaultProps
        )

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

        if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log('  - variantOut', { fKey, variantOut, res: { ...res } })
        }
      }
      continue
    }

    if (isVariable(val)) {
      res[fKey] = !isWeb || returnVariablesAs === 'value' ? val.val : val.variable
      continue
    }

    if (typeof val === 'string') {
      const fVal =
        val[0] === '$' ? getToken(fKey, val, styleState, returnVariablesAs) : val
      res[fKey] = fVal
      continue
    }

    if (isObj(val)) {
      const subObject = resolveTokensAndVariants(
        fKey,
        val,
        styleState,
        defaultProps,
        returnVariablesAs,
        key,
        avoidDefaultProps
      )

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log(`object`, fKey, subObject)
      }

      // sub-objects: media queries, pseudos, shadowOffset
      res[fKey] ??= {}
      Object.assign(res[fKey], subObject)
    } else {
      // nullish values cant be tokens, need no extra parsing
      res[fKey] = val
    }

    if (process.env.NODE_ENV === 'development') {
      if (debug) {
        if (res[fKey]?.[0] === '$') {
          console.warn(`⚠️ Missing token in theme ${theme.name}:`, fKey, res[fKey], theme)
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
  key: string,
  value: any,
  conf: TamaguiInternalConfig
) {
  if (typeof variant === 'function') {
    return variant
  }
  if (variant[value]) {
    return variant[value]
  }
  const { tokensParsed } = conf
  for (const { name, spreadName } of tokenCats) {
    if (spreadName in variant && value in tokensParsed[name]) {
      return variant[spreadName]
    }
  }
  const fontSizeVariant = variant['...fontSize']
  if (fontSizeVariant && conf.fontSizeTokens.has(value)) {
    return fontSizeVariant
  }
  // fallback to catch all | size
  return variant[`:${typeof value}`] || variant['...'] || variant['...size']
}

const fontShorthand = {
  fontSize: 'size',
  fontWeight: 'weight',
}

const getToken = (
  key: string,
  value: string,
  styleState: GetStyleState,
  resolveAs?: ResolveVariableTypes,
  debug?: DebugProp
) => {
  const { theme, conf, languageContext, fontFamily } = styleState

  const tokensParsed = conf.tokensParsed
  let valOrVar: any
  let hasSet = false
  if (value in theme) {
    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      // rome-ignore lint/nursery/noConsoleLog: <explanation>
      console.log(` - getting theme value for ${key} from ${value} = ${theme[value].val}`)
    }
    valOrVar = theme[value]
    hasSet = true
  } else {
    if (value in conf.specificTokens) {
      hasSet = true
      valOrVar = conf.specificTokens[value]
    } else {
      switch (key) {
        case 'fontFamily': {
          const fontsParsed = languageContext
            ? getFontsForLanguage(conf.fontsParsed, languageContext)
            : conf.fontsParsed
          valOrVar = fontsParsed[value]?.family || value
          hasSet = true
          break
        }
        case 'fontSize':
        case 'lineHeight':
        case 'letterSpacing':
        case 'fontWeight': {
          if (fontFamily) {
            const fontsParsed = languageContext
              ? getFontsForLanguage(conf.fontsParsed, languageContext)
              : conf.fontsParsed
            valOrVar =
              fontsParsed[fontFamily]?.[fontShorthand[key] || key]?.[value] || value
            hasSet = true
          }
          break
        }
      }
      for (const cat in tokenCategories) {
        if (key in tokenCategories[cat]) {
          const res = tokensParsed[cat][value]
          if (res) {
            valOrVar = res
            hasSet = true
          }
        }
      }
      if (!hasSet) {
        const spaceVar = tokensParsed.space[value]
        if (spaceVar) {
          valOrVar = spaceVar
          hasSet = true
        }
      }
    }
  }

  if (hasSet) {
    const out = resolveVariableValue(key, valOrVar, resolveAs)
    return out
  }

  if (process.env.NODE_ENV === 'development' && isDevTools && debug === 'verbose') {
    console.groupCollapsed('  ﹒ propMap (val)', key, value)
    // rome-ignore lint/nursery/noConsoleLog: ok
    console.log({ valOrVar, theme, hasSet, resolveAs }, theme[key])
    console.groupEnd()
  }

  return value
}

function resolveVariableValue(
  key: string,
  valOrVar: Variable | any,
  resolveAs: ResolveVariableTypes = 'auto'
) {
  if (isVariable(valOrVar)) {
    if (resolveAs === 'variable') {
      return valOrVar
    }
    if (resolveAs === 'non-color-value') {
      if (isWeb) {
        if (key in tokenCategories.color) {
          return valOrVar.variable
        }
      }
      return valOrVar.val
    }
    if (!isWeb || resolveAs === 'value') {
      return valOrVar.val
    }
    return valOrVar.variable
  }
  return valOrVar
}

// TODO move to validStyleProps to merge

// just specificy the least costly, all else go to `space` (most keys - we can exclude)
const tokenCategories = {
  radius: {
    borderRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
  },
  zIndex: {
    zIndex: true,
  },
  color: {
    color: true,
    backgroundColor: true,
    borderColor: true,
    borderBottomColor: true,
    borderTopColor: true,
    borderLeftColor: true,
    borderRightColor: true,
  },
}
