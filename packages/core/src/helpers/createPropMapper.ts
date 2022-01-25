import { getTamagui } from '../conf'
import { isWeb } from '../constants/platform'
import { Variable } from '../createVariable'
import { StaticConfig, TamaguiInternalConfig } from '../types'
import { isObj } from './isObj'

export const createPropMapper = (c: StaticConfig) => {
  const variants = c.variants
  let variantsParsed
  const defaultProps = c.defaultProps || {}

  return (key: string, value: any, theme: any, props: any) => {
    const conf = getTamagui()
    if (!conf) {
      console.trace('no conf! err')
      return
    }
    if (variants && !variantsParsed) {
      variantsParsed = parseVariants(variants, conf)
    }

    // handled here because we need to resolve this off tokens, its the only one-off like this
    let fontFamily = props.fontFamily || defaultProps.fontFamily || '$body'

    // expand variants
    const variant = variantsParsed?.[key]
    if (variant && typeof value !== 'undefined') {
      const val =
        value === true
          ? variant['$true'] || variant['true']
          : variant[value] ?? variant['...'] ?? value

      const res =
        typeof val === 'function'
          ? val(value, { tokens: conf.tokensParsed, theme, props })
          : isObj(val)
          ? { ...val }
          : val

      if (isObj(res)) {
        resolveTokens(res, conf, theme, fontFamily)
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
      value = getToken(key, value, conf, theme, fontFamily)
    }

    if (value instanceof Variable) {
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

const resolveTokens = (res: any, conf: TamaguiInternalConfig, theme: any, fontFamily: any) => {
  for (const rKey in res) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = res[rKey]
    if (val instanceof Variable) {
      res[fKey] = val.variable
    } else if (typeof val === 'string') {
      const fVal = val[0] === '$' ? getToken(fKey, val, conf, theme, fontFamily) : val
      res[fKey] = fVal
    } else {
      if (isObj(val)) {
        // for things like shadowOffset which is a sub-object
        resolveTokens(val, conf, theme, fontFamily)
      }
      // nullish values cant be tokens so need no exrta parsing
    }
  }
}

const getToken = (
  key: string,
  value: string,
  { tokensParsed, themeParsed }: TamaguiInternalConfig,
  theme: any,
  fontFamily: string | undefined = '$body'
) => {
  if (themeParsed[value]) {
    if (isWeb && themeParsed[value].variable) {
      return themeParsed[value].variable
    } else {
      if (value && value[0] === '$') {
        return theme[`${value.slice(1)}`]?.val || themeParsed[value]?.val
      }
    }
  }
  let valOrVar: any
  if (key === 'fontFamily') {
    valOrVar = tokensParsed.font[value]?.family || value
  }
  if (key === 'fontSize') {
    valOrVar = tokensParsed.font[fontFamily]?.size[value] || value
  }
  if (key === 'lineHeight') {
    valOrVar = tokensParsed.font[fontFamily]?.lineHeight[value] || value
  }
  if (key === 'letterSpacing') {
    valOrVar = tokensParsed.font[fontFamily]?.letterSpacing[value] || value
  }
  if (key === 'fontWeight') {
    valOrVar = tokensParsed.font[fontFamily]?.weight[value] || value
  }
  if (typeof valOrVar !== 'undefined') {
    if (valOrVar instanceof Variable) {
      return valOrVar.variable
    } else {
      return valOrVar
    }
  }
  for (const cat in tokenCategories) {
    if (tokenCategories[cat][key]) {
      const res = tokensParsed[cat][value]
      if (res) {
        return res.variable
      } else {
        const themeVar = themeParsed[value]
        if (themeVar) {
          return themeVar.variable
        }
      }
    }
  }
  const spaceVar = tokensParsed.space[value]
  if (spaceVar) {
    return spaceVar.variable
  }
  return value
}

// just specificy the least costly, all else go to `space` (most keys - we can exclude)
const tokenCategories = {
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
