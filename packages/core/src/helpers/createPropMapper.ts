import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { isVariable } from '../createVariable'
import { StaticConfig, TamaguiInternalConfig } from '../types'
import { isObj } from './isObj'

export const createPropMapper = (c: StaticConfig) => {
  const variants = c.variants
  let variantsParsed
  const defaultProps = c.defaultProps || {}

  return (key: string, value: any, theme: any, props: any) => {
    const conf = getConfig()
    if (!conf) {
      console.trace('no conf! err')
      return
    }
    const isAnimated = !!props.animation
    if (variants && !variantsParsed) {
      variantsParsed = parseVariants(variants, conf)
    }

    // handled here because we need to resolve this off tokens, its the only one-off like this
    let fontFamily = props.fontFamily || defaultProps.fontFamily || '$body'

    // expand variants
    const variant = variantsParsed && variantsParsed[key]
    if (variant && typeof value !== 'undefined') {
      let variantValue =
        value === true
          ? variant['$true'] || variant['true'] || variant[':boolean']
          : value === false
          ? variant['$false'] || variant['false'] || variant[':boolean']
          : variant[value]

      if (!variantValue) {
        if (variant[':number'] && !isNaN(value)) {
          variantValue = variant[':number']
        } else if (variant[':string'] && typeof value === 'string') {
          variantValue = variant[':string']
        }
      }

      let res = variantValue
      if (typeof res === 'function') {
        res = res(value, { tokens: conf.tokensParsed, theme, props })
      }
      if (isObj(res)) {
        res = resolveTokens(res, conf, theme, fontFamily, isAnimated)
      }
      return res
    }

    let shouldReturn = false

    // handle shorthands
    if (conf.shorthands[key]) {
      shouldReturn = true
      key = conf.shorthands[key]
    }

    if (value && value[0] === '$') {
      shouldReturn = true
      value = getToken(key, value, conf, theme, fontFamily, isAnimated)
    }

    if (isVariable(value)) {
      shouldReturn = true
      value = value.variable
    }

    if (shouldReturn) {
      return {
        [key]: value,
      }
    }
  }
}

const resolveTokens = (
  input: Object,
  conf: TamaguiInternalConfig,
  theme: any,
  fontFamily: any,
  isAnimated = false
) => {
  let res = {}
  for (const rKey in input) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = input[rKey]
    if (isVariable(val)) {
      res[fKey] = val.variable
    } else if (typeof val === 'string') {
      const fVal = val[0] === '$' ? getToken(fKey, val, conf, theme, fontFamily, isAnimated) : val
      res[fKey] = fVal
    } else {
      if (isObj(val)) {
        // for things like shadowOffset, hoverStyle which is a sub-object
        res[fKey] = resolveTokens(val, conf, theme, fontFamily, isAnimated)
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

const getToken = (
  key: string,
  value: string,
  { tokensParsed }: TamaguiInternalConfig,
  theme: any,
  fontFamily: string | undefined = '$body',
  isAnimated = false
) => {
  let valOrVar: any
  let hasSet = false
  const valueName = value[0] === '$' ? value.slice(1) : value
  if (valueName in theme) {
    valOrVar = theme[valueName]
    hasSet = true
  } else {
    switch (key) {
      case 'fontFamily':
        valOrVar = tokensParsed.font[value]?.family || value
        hasSet = true
        break
      case 'fontSize':
        valOrVar = tokensParsed.font[fontFamily]?.size[value] || value
        hasSet = true
        break
      case 'lineHeight':
        valOrVar = tokensParsed.font[fontFamily]?.lineHeight[value] || value
        hasSet = true
        break
      case 'letterSpacing':
        valOrVar = tokensParsed.font[fontFamily]?.letterSpacing[value] || value
        hasSet = true
        break
      case 'fontWeight':
        valOrVar = tokensParsed.font[fontFamily]?.weight[value] || value
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
    if (isVariable(valOrVar)) {
      if (!isWeb || isAnimated) {
        return valOrVar.val
      }
      return valOrVar.variable
    }
    return valOrVar
  }
  if (process.env.NODE_ENV === 'development') {
    if (value && value[0] === '$') {
      console.warn(`⚠️ Missing token in theme:`, value, theme)
      return null
    }
  }
  return value
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

// turns variant spreads into individual lookups
function parseVariants(variants: any, conf: TamaguiInternalConfig) {
  return Object.keys(variants).reduce((acc, key) => {
    acc[key] = Object.keys(variants[key]).reduce((vacc, vkey) => {
      const variantVal = variants[key][vkey]
      if (vkey.startsWith('...')) {
        // set the default one at '...' for easy fallback on non-exact-variant-match
        vacc['...'] = variantVal
        const tokenKey = vkey.slice(3)
        const tokens = conf.tokens[tokenKey]
        for (const tkey in tokens) {
          vacc[`$${tkey}`] = variantVal
        }
      } else {
        vacc[vkey] = variantVal
      }
      return vacc
    }, {})
    return acc
  }, {})
}
