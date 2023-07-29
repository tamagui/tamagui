import { isAndroid, isWeb } from '@tamagui/constants'
import { tokenCategories } from '@tamagui/helpers'

import { isDevTools } from '../constants/isDevTools'
import { Variable, getVariableValue, isVariable } from '../createVariable'
import type {
  GetStyleState,
  PropMapper,
  SplitStyleProps,
  StyleResolver,
  TamaguiInternalConfig,
  VariantSpreadFunction,
} from '../types'
import { expandStyle } from './expandStyle'
import { expandStylesAndRemoveNullishValues } from './expandStyles'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { pseudoDescriptors } from './pseudoDescriptors'

export type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both'

export const propMapper: PropMapper = (key, value, styleStateIn, subPropsIn) => {
  if (!(process.env.TAMAGUI_TARGET === 'native' && isAndroid)) {
    // this shouldnt be necessary and handled in the outer loop
    if (key === 'elevationAndroid') return
  }

  // we use this for the sub-props like pseudos so we need to overwrite the "props" in styleState
  // fallbackProps is awkward thanks to static
  // also we need to override the props here because subStyles pass in a sub-style props object
  const subProps = styleStateIn.styleProps.fallbackProps || subPropsIn

  const styleState = subProps
    ? new Proxy(styleStateIn, {
        get(_, k) {
          return k === 'curProps' ? subProps : Reflect.get(_, k)
        },
      })
    : styleStateIn

  const { conf, styleProps, fontFamily, staticConfig } = styleState
  const { variants } = staticConfig

  // prettier-ignore
  if (process.env.NODE_ENV === 'development' && fontFamily && fontFamily[0] === '$' && !(fontFamily in conf.fontsParsed)) {
    // prettier-ignore
    console.warn(`Warning: no fontFamily "${fontFamily}" found in config: ${Object.keys(conf.fontsParsed).join(', ')}`)
  }

  if (variants && key in variants && value != null) {
    styleState.curProps[key] = value

    const variantValue = resolveVariants(key, value, styleProps, styleState, '')
    if (variantValue) {
      return variantValue
    }
  }

  let shouldReturn = false

  // handle shorthands
  if (key in conf.shorthands) {
    shouldReturn = true
    key = conf.shorthands[key]
  }

  if (value) {
    if (value[0] === '$') {
      value = getToken(key, value, styleProps, styleState)
    } else if (isVariable(value)) {
      value = resolveVariableValue(value, styleProps)
    }
  }

  if (shouldReturn || value != null) {
    return expandStyle(key, value) || [[key, value]]
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

  let variantValue = getVariantDefinition(variants[key], key, value, conf)

  if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
    console.groupCollapsed(`♦️♦️♦️ resolve variant ${key}`)
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log({
      key,
      value,
      variantValue,
      variants,
      curProps: { ...styleState.curProps },
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

    variantValue = fn(value, getVariantExtras(styleState))

    if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
      console.groupCollapsed('   expanded functional variant', key)
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
      fontFamilyResult = getFontFamilyFromNameOrVariable(fontFamilyUpdate, conf)
      styleState.fontFamily = fontFamilyResult

      if (process.env.NODE_ENV === 'development' && debug === 'verbose') {
        // rome-ignore lint/nursery/noConsoleLog: <explanation>
        console.log(`   updating font family`, fontFamilyResult)
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
    const expanded = expandStylesAndRemoveNullishValues(variantValue)
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

// special helper for special font family
const fontFamilyCache = new WeakMap()
export const getPropMappedFontFamily = (expanded?: any) => {
  return expanded && fontFamilyCache.get(expanded)
}

const resolveTokensAndVariants: StyleResolver<Object> = (
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
    // rome-ignore lint/nursery/noConsoleLog: <explanation>
    console.log(`   - resolveTokensAndVariants`, key, value)
  }

  for (const rKey in value) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = value[rKey]

    if (variants && fKey in variants) {
      // if its a variant expanded, attach to curProps
      styleState.curProps[fKey] = val

      // avoids infinite loop if variant is matching a style prop
      // eg: { variants: { flex: { true: { flex: 2 } } } }
      if (parentVariantKey && parentVariantKey === key) {
        res[fKey] =
          // SYNC WITH *1
          val[0] === '$' ? getToken(fKey, val, styleProps, styleState) : val
      } else {
        const variantOut = resolveVariants(fKey, val, styleProps, styleState, key)

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

    if (isVariable(val)) {
      res[fKey] = resolveVariableValue(val, styleProps)
      continue
    }

    if (typeof val === 'string') {
      const fVal =
        // SYNC WITH *1
        val[0] === '$' ? getToken(fKey, val, styleProps, styleState) : val
      res[fKey] = fVal
      continue
    }

    if (isObj(val)) {
      const subObject = resolveTokensAndVariants(fKey, val, styleProps, styleState, key)

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
  styleProps: SplitStyleProps,
  styleState: GetStyleState
) => {
  const { theme, conf, languageContext, fontFamily } = styleState

  const tokensParsed = conf.tokensParsed
  let valOrVar: any
  let hasSet = false
  if (value in theme) {
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
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
          const fam = fontFamily || styleState.conf.defaultFont
          if (fam) {
            const fontsParsed = languageContext
              ? getFontsForLanguage(conf.fontsParsed, languageContext)
              : conf.fontsParsed
            const font = fontsParsed[fam]
            valOrVar = font?.[fontShorthand[key] || key]?.[value] || value
            hasSet = true
          }
          break
        }
      }
      for (const cat in tokenCategories) {
        if (key in tokenCategories[cat]) {
          const res = tokensParsed[cat][value]
          if (res != null) {
            valOrVar = res
            hasSet = true
          }
        }
      }
      if (!hasSet) {
        const spaceVar = tokensParsed.space[value]
        if (spaceVar != null) {
          valOrVar = spaceVar
          hasSet = true
        }
      }
    }
  }

  if (hasSet) {
    const out = resolveVariableValue(valOrVar, styleProps)
    return out
  }

  if (
    process.env.NODE_ENV === 'development' &&
    isDevTools &&
    styleState.debug === 'verbose'
  ) {
    console.groupCollapsed('  ﹒ propMap (val)', key, value)
    // rome-ignore lint/nursery/noConsoleLog: ok
    console.log({ valOrVar, theme, hasSet }, theme[key])
    console.groupEnd()
  }

  return value
}

function resolveVariableValue(
  valOrVar: Variable | any,
  { resolveVariablesAs }: SplitStyleProps
) {
  if (isVariable(valOrVar)) {
    if (!isWeb || resolveVariablesAs === 'value') {
      return valOrVar.val
    }
    return valOrVar.variable
  }
  return valOrVar
}
