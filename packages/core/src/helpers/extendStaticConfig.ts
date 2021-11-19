import { getTamaguiConfig } from '../createTamagui'
import { Variable } from '../createVariable'
import { StaticComponent, StaticConfig, StaticConfigParsed, TamaguiInternalConfig } from '../types'

export function extendStaticConfig(
  // can be undefined when loading with @tamagui/fake-react-native
  // could be fixed a bit cleaner
  Component?: StaticComponent | React.Component<any>,
  config: StaticConfig = {}
): StaticConfigParsed | null {
  const a = (Component || {}) as any
  if (!a.staticConfig) {
    // if no static config, we are extending an external component
    a.staticConfig = {
      Component,
    }
  }

  return parseStaticConfig({
    ...a.staticConfig,
    variants: {
      ...a.staticConfig.variants,
      ...config.variants,
    },
    isText: config.isText || a.staticConfig.isText || false,
    neverFlatten: config.neverFlatten ?? a.staticConfig.neverFlatten,
    ensureOverriddenProp: config.ensureOverriddenProp ?? a.staticConfig.ensureOverriddenProp,
    validStyles: config.validStyles
      ? {
          ...a.staticConfig.validStyles,
          ...config.validStyles,
        }
      : a.staticConfig.validStyles,
    validPropsExtra: {
      ...a.staticConfig.validPropsExtra,
      ...config.validPropsExtra,
    },
    defaultProps: {
      ...a.staticConfig.defaultProps,
      ...config.defaultProps,
    },
  })
}

export function parseStaticConfig(c: StaticConfig): StaticConfigParsed {
  const variants = c.variants
  let variantsParsed
  return {
    ...c,
    parsed: true,

    propMapper(key: string, value: any, theme: any) {
      const conf = getTamaguiConfig()
      if (!conf) {
        console.trace('err')
        return
      }
      if (variants && !variantsParsed) {
        variantsParsed = parseVariants(variants, conf)
      }

      // expand variants
      const variant = variantsParsed?.[key]
      if (variant) {
        const tokenKey = typeof value === 'string' && value[0] === '$' ? value.slice(1) : value
        const val = tokenKey === true ? variant['true'] : variant[tokenKey] ?? value

        let res: any
        if (typeof val === 'function') {
          res = val(tokenKey, { tokens: conf.tokens, theme })
        } else {
          res = val
        }

        if (res) {
          for (const rKey in res) {
            const fKey = conf.shorthands[rKey] || rKey
            if (rKey !== fKey) {
              delete res[rKey]
            }
            const val = res[rKey]
            if (val instanceof Variable) {
              res[fKey] = val.variable
            } else if (val) {
              const fVal = val[0] === '$' ? getToken(fKey, val, conf) : val
              res[fKey] = fVal
            } else {
              // nullish values can't be tokens
            }
          }
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
        value = getToken(key, value, conf)
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
    },
  }
}

const getToken = (
  key: string,
  value: string,
  { tokensParsed, themeParsed }: TamaguiInternalConfig
) => {
  if (themeParsed[value]) {
    return themeParsed[value].variable
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
  font: {
    fontFamily: true,
  },
  fontSize: {
    fontSize: true,
  },
  lineHeight: {
    lineHeight: true,
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

function parseVariants(variants: any, conf: TamaguiInternalConfig) {
  return Object.keys(variants).reduce((acc, key) => {
    acc[key] = Object.keys(variants[key]).reduce((vacc, vkey) => {
      if (vkey.startsWith('...')) {
        const tokenKey = vkey.slice(3)
        const tokens = conf.tokens[tokenKey]
        for (const tkey in tokens) {
          vacc[tkey] = variants[key][vkey]
        }
        // explode
        // acc[vkey] = variants[key][vkey]
      } else {
        vacc[vkey] = variants[key][vkey]
      }
      return vacc
    }, {})
    return acc
  }, {})
}
