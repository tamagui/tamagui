import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { Variable, isVariable } from '../createVariable'
import {
  PropMapper,
  SplitStyleState,
  StaticConfig,
  TamaguiInternalConfig,
  ThemeObject,
  VariantSpreadFunction,
} from '../types'
import { expandStyle, expandStyles } from './generateAtomicStyles'
import { getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'

export type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both'

// goes through specificity finding best matching variant function
function getVariantFunction(variant: any, key: string, value: any) {
  if (typeof variant === 'function') {
    return variant
  }
  for (const cat in tokenCategories) {
    if (key in tokenCategories[cat]) {
      const spreadVariant = variant[`...${cat}`]
      if (spreadVariant) {
        return spreadVariant
      }
    }
  }
  let fn: any
  if (typeof value === 'number') {
    fn = variant[':number']
  } else if (typeof value === 'string') {
    fn = variant[':string']
  } else if (value === true || value === false) {
    fn = variant[':boolean']
  }
  fn = fn || variant[value]
  // fallback to size ultimately - could do token level detection
  return fn || variant['...'] || variant['...size']
}

export const createPropMapper = (staticConfig: Partial<StaticConfig>) => {
  const variants = staticConfig.variants || {}
  const defaultProps = staticConfig.defaultProps || {}

  const mapper: PropMapper = (key, value, theme, propsIn, state, avoidDefaultProps = false) => {
    const conf = getConfig()
    if (!conf) {
      console.trace('no conf! err')
      return
    }

    const props = state.fallbackProps || propsIn
    const returnVariablesAs = state.resolveVariablesAs || !!props.animation ? 'value' : 'auto'

    // handled here because we need to resolve this off tokens, its the only one-off like this
    const fontFamily = props.fontFamily || defaultProps.fontFamily || '$body'
    const variant = variants && variants[key]

    if (variant && value !== undefined) {
      let variantValue = getVariantFunction(variant, key, value)

      if (variantValue) {
        if (typeof variantValue === 'function') {
          const fn = variantValue as VariantSpreadFunction<any>
          variantValue = fn(value, getVariantExtras(props, theme, defaultProps, avoidDefaultProps))
        }

        if (isObj(variantValue)) {
          variantValue = resolveTokens(variantValue, conf, theme, fontFamily, returnVariablesAs)
        }

        return Object.entries(expandStyles(variantValue))
      }
    }

    let shouldReturn = value !== undefined && value !== null

    // handle shorthands
    if (conf.shorthands[key]) {
      shouldReturn = true
      key = conf.shorthands[key]
    }

    if (value) {
      if (value[0] === '$') {
        value = getToken(key, value, conf, theme, fontFamily, returnVariablesAs)
      } else if (isVariable(value)) {
        value = getVariableValue(value, returnVariablesAs)
      }
    }

    if (shouldReturn) {
      return expandStyle(key, value) || [[key, value]]
    }
  }

  return mapper
}

const resolveTokens = (
  input: Object,
  conf: TamaguiInternalConfig,
  theme: any,
  fontFamily: any,
  resolveAs?: ResolveVariableTypes
) => {
  let res = {}
  for (const rKey in input) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = input[rKey]
    if (isVariable(val)) {
      res[fKey] =
        resolveAs === 'variable' ? val : !isWeb || resolveAs === 'value' ? val.val : val.variable
    } else if (typeof val === 'string') {
      const fVal = val[0] === '$' ? getToken(fKey, val, conf, theme, fontFamily, resolveAs) : val
      res[fKey] = fVal
    } else {
      if (isObj(val)) {
        // for things like shadowOffset, hoverStyle which is a sub-object
        res[fKey] = resolveTokens(val, conf, theme, fontFamily, resolveAs)
      } else {
        // nullish values cant be tokens so need no exrta parsing
        res[fKey] = input[fKey]
      }
    }
    if (process.env.NODE_ENV === 'development') {
      if (res[fKey]?.[0] === '$') {
        console.warn(`⚠️ Missing token in theme ${theme.name}:`, fKey, res[fKey])
      }
    }
  }
  return res
}

const fontShorthand = {
  fontSize: 'size',
  fontWeight: 'weight',
}

const getToken = (
  key: string,
  value: string,
  { tokensParsed, fontsParsed }: TamaguiInternalConfig,
  theme: any,
  fontFamily: string | undefined = '$body',
  resolveAs?: ResolveVariableTypes
) => {
  let valOrVar: any
  let hasSet = false
  if (value in theme) {
    valOrVar = theme[value]
    hasSet = true
  } else {
    switch (key) {
      case 'fontFamily':
        valOrVar = fontsParsed[value]?.family || value
        hasSet = true
        break
      case 'fontSize':
      case 'lineHeight':
      case 'letterSpacing':
      case 'fontWeight':
        valOrVar = fontsParsed[fontFamily]?.[fontShorthand[key] || key]?.[value] || value
        hasSet = true
        break
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
  if (hasSet) {
    return getVariableValue(valOrVar, resolveAs)
  }
  if (process.env.NODE_ENV === 'development') {
    if (value && value[0] === '$') {
      console.warn(`⚠️ Missing token:`, key, value, fontFamily, theme, fontsParsed)
      return null
    }
  }
  return value
}

function getVariableValue(valOrVar: Variable | any, resolveAs: ResolveVariableTypes = 'auto') {
  if (isVariable(valOrVar)) {
    if (resolveAs === 'variable') {
      return valOrVar
    }
    if (!isWeb || resolveAs === 'value') {
      return valOrVar.val
    }
    return valOrVar.variable
  }
  return valOrVar
}

// just specificy the least costly, all else go to `space` (most keys - we can exclude)
const tokenCategories = {
  radius: {
    borderRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
    padding: true,
    paddingLeft: true,
    paddingRight: true,
    paddingTop: true,
    paddingBottom: true,
    paddingVertical: true,
    paddingHorizontal: true,
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
