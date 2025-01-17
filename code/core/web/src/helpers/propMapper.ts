import { isAndroid } from '@tamagui/constants'
import { tokenCategories } from '@tamagui/helpers'
import { getConfig } from '../config'
import type { Variable } from '../createVariable'
import { getVariableValue, isVariable } from '../createVariable'
import type {
  GetStyleState,
  PropMapper,
  ResolveVariableAs,
  StyleResolver,
  TamaguiInternalConfig,
  VariantSpreadFunction,
} from '../types'
import { expandStyle } from './expandStyle'
import { getFontsForLanguage, getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'
import { normalizeStyle } from './normalizeStyle'
import { pseudoDescriptors } from './pseudoDescriptors'
import { skipProps } from './skipProps'

export const propMapper: PropMapper = (key, value, styleState, disabled, map) => {
  if (disabled) {
    return map(key, value)
  }

  lastFontFamilyToken = null

  if (!(process.env.TAMAGUI_TARGET === 'native' && isAndroid)) {
    // this shouldnt be necessary and handled in the outer loop
    if (key === 'elevationAndroid') return
  }

  const { conf, styleProps, staticConfig } = styleState

  if (value === 'unset') {
    const unsetVal = conf.unset?.[key]
    if (unsetVal != null) {
      value = unsetVal
    } else {
      // if no unset found, do nothing
      return
    }
  }

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

  if (value != null) {
    if (value[0] === '$') {
      value = getTokenForKey(key, value, styleProps.resolveValues, styleState)
    } else if (isVariable(value)) {
      value = resolveVariableValue(key, value, styleProps.resolveValues)
    }
  }

  if (value != null) {
    if (key === 'fontFamily' && lastFontFamilyToken) {
      styleState.fontFamily = lastFontFamilyToken
    }

    const expanded = styleProps.noExpand ? null : expandStyle(key, value)

    if (expanded) {
      const max = expanded.length
      for (let i = 0; i < max; i++) {
        const [nkey, nvalue] = expanded[i]
        map(nkey, nvalue)
      }
    } else {
      map(key, value)
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

  let variantValue = getVariantDefinition(variants[key], value, conf)

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
      lastFontFamilyToken = getVariableValue(fontFamilyResult)
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
    console.info(`   - resolveTokensAndVariants`, key, value)
  }

  for (const _key in value) {
    const subKey = conf.shorthands[_key] || _key
    const val = value[_key]

    if (!styleProps.noSkip && subKey in skipProps) {
      continue
    }

    if (styleProps.noExpand) {
      res[subKey] = val
    } else {
      if (variants && subKey in variants) {
        // avoids infinite loop if variant is matching a style prop
        // eg: { variants: { flex: { true: { flex: 2 } } } }
        if (parentVariantKey && parentVariantKey === key) {
          res[subKey] =
            // SYNC WITH *1
            val[0] === '$'
              ? getTokenForKey(subKey, val, styleProps.resolveValues, styleState)
              : val
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
        // SYNC WITH *1
        val[0] === '$'
          ? getTokenForKey(subKey, val, styleProps.resolveValues, styleState)
          : val

      res[subKey] = fVal
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
function getVariantDefinition(variant: any, value: any, conf: TamaguiInternalConfig) {
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
      if (spreadName in variant && value in tokensParsed[name]) {
        return variant[spreadName]
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

const fontShorthand = {
  fontSize: 'size',
  fontWeight: 'weight',
}

let lastFontFamilyToken: any = null

export const getTokenForKey = (
  key: string,
  value: string,
  resolveAs: ResolveVariableAs = 'none',
  styleState: Partial<GetStyleState>
) => {
  if (resolveAs === 'none') {
    return value
  }

  const { theme, conf = getConfig(), context, fontFamily, staticConfig } = styleState

  const tokensParsed = conf.tokensParsed
  let valOrVar: any
  let hasSet = false

  const customTokenAccept = staticConfig?.accept?.[key]
  if (customTokenAccept) {
    const val = theme?.[value] ?? tokensParsed[customTokenAccept][value]
    if (val != null) {
      resolveAs = 'value' // always resolve custom tokens as values
      valOrVar = val
      hasSet = true
    }
  }

  if (theme && value in theme) {
    valOrVar = theme[value]
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
      globalThis.tamaguiAvoidTracking = true
      console.info(
        ` - resolving ${key} to theme value ${value} resolveAs ${resolveAs}`,
        valOrVar
      )
      globalThis.tamaguiAvoidTracking = false
    }
    hasSet = true
  } else {
    if (value in conf.specificTokens) {
      hasSet = true
      valOrVar = conf.specificTokens[value]
    } else {
      switch (key) {
        case 'fontFamily': {
          const fontsParsed = context?.language
            ? getFontsForLanguage(conf.fontsParsed, context.language)
            : conf.fontsParsed
          valOrVar = fontsParsed[value]?.family || value
          lastFontFamilyToken = value
          hasSet = true
          break
        }
        case 'fontSize':
        case 'lineHeight':
        case 'letterSpacing':
        case 'fontWeight': {
          const fam = fontFamily || conf.defaultFontToken
          if (fam) {
            const fontsParsed = context?.language
              ? getFontsForLanguage(conf.fontsParsed, context.language)
              : conf.fontsParsed
            const font = fontsParsed[fam] || fontsParsed[conf.defaultFontToken]
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
    }

    if (!hasSet) {
      const spaceVar = tokensParsed.space[value]
      if (spaceVar != null) {
        valOrVar = spaceVar
        hasSet = true
      }
    }
  }

  if (hasSet) {
    const out = resolveVariableValue(key, valOrVar, resolveAs)
    if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
      globalThis.tamaguiAvoidTracking = true
      console.info(`resolved`, resolveAs, valOrVar, out)
      globalThis.tamaguiAvoidTracking = false
    }
    return out
  }

  // they didn't define this token don't return anything, we could warn?

  if (process.env.NODE_ENV === 'development' && styleState.debug === 'verbose') {
    console.warn(`Warning: no token found for ${key}, omitting`)
  }
}

function resolveVariableValue(
  key: string,
  valOrVar: Variable | any,
  resolveValues?: ResolveVariableAs
) {
  if (resolveValues === 'none') {
    return valOrVar
  }
  if (isVariable(valOrVar)) {
    if (resolveValues === 'value') {
      return valOrVar.val
    }

    // @ts-expect-error this is fine until we can type better
    const get = valOrVar?.get

    // shadowColor doesn't support dynamic style
    if (process.env.TAMAGUI_TARGET !== 'native' || key !== 'shadowColor') {
      if (typeof get === 'function') {
        const resolveDynamicFor = resolveValues === 'web' ? 'web' : undefined
        return get(resolveDynamicFor)
      }
    }

    return process.env.TAMAGUI_TARGET === 'native' ? valOrVar.val : valOrVar.variable
  }
  return valOrVar
}
