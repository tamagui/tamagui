import { getConfig } from '../conf'
import { isWeb } from '../constants/platform'
import { Variable, isVariable } from '../createVariable'
import {
  GenericVariantDefinitions,
  PropMapper,
  StaticConfig,
  TamaguiInternalConfig,
  VariantSpreadFunction,
} from '../types'
import { expandStyle, expandStyles } from './generateAtomicStyles'
import { getVariantExtras } from './getVariantExtras'
import { isObj } from './isObj'

export type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both'

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
    const returnVariablesAs =
      state.resolveVariablesAs === 'value' || !!props.animation ? 'value' : 'auto'

    // handled here because we need to resolve this off tokens, its the only one-off like this
    const fontFamily = props.fontFamily || defaultProps.fontFamily || '$body'

    const variantValue = resolveVariants(
      key,
      value,
      props,
      defaultProps,
      theme,
      variants,
      fontFamily,
      conf,
      returnVariablesAs,
      staticConfig,
      '',
      avoidDefaultProps
    )
    if (variantValue) {
      return variantValue
    }

    let shouldReturn = value !== undefined && value !== null

    // handle shorthands
    if (conf.shorthands[key]) {
      shouldReturn = true
      key = conf.shorthands[key]
    }

    if (value) {
      if (value[0] === '$') {
        // prettier-ignore
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

type StyleResolver = (
  key: string,
  value: any,
  props: Record<string, any>,
  defaultProps: any,
  theme: any,
  variants: GenericVariantDefinitions,
  fontFamily: string,
  conf: TamaguiInternalConfig,
  returnVariablesAs: 'auto' | 'value',
  staticConfig: Partial<StaticConfig>,
  parentVariantKey: string,
  avoidDefaultProps?: boolean
) => any

const resolveVariants: StyleResolver = (
  key,
  value,
  props,
  defaultProps,
  theme,
  variants,
  fontFamily,
  conf,
  returnVariablesAs,
  staticConfig,
  parentVariantKey,
  avoidDefaultProps = false
) => {
  const variant = variants && variants[key]
  if (variant && value !== undefined) {
    let variantValue = getVariantDefinition(variant, key, value)

    if (variantValue) {
      if (typeof variantValue === 'function') {
        const fn = variantValue as VariantSpreadFunction<any>
        variantValue = fn(value, getVariantExtras(props, theme, defaultProps, avoidDefaultProps))
      }

      if (isObj(variantValue)) {
        variantValue = resolveTokensAndVariants(
          key,
          variantValue,
          props,
          defaultProps,
          theme,
          variants,
          fontFamily,
          conf,
          returnVariablesAs,
          staticConfig,
          parentVariantKey,
          avoidDefaultProps
        )
      }

      return Object.entries(expandStyles(variantValue))
    } else {
      // variant at key exists, but no matching variant value, return nothing
      if (process.env.NODE_ENV === 'development') {
        if (staticConfig.validStyles?.[key]) {
          return null
        }
        console.warn(
          `No variant found: ${
            staticConfig.componentName || '[UnnamedComponent]'
          } has variant "${key}", but no matching value "${value}"`
        )
      }
      return null
    }
  }
}

const resolveTokensAndVariants: StyleResolver = (
  key, // we dont use key assume value is object instead
  value,
  props,
  defaultProps,
  theme,
  variants,
  fontFamily,
  conf,
  returnVariablesAs,
  staticConfig,
  parentVariantKey,
  avoidDefaultProps
) => {
  let res = {}
  for (const rKey in value) {
    const fKey = conf.shorthands[rKey] || rKey
    const val = value[rKey]
    if (isVariable(val)) {
      res[fKey] = !isWeb || returnVariablesAs === 'value' ? val.val : val.variable
      // res[fKey] =
      //   resolveAs === 'variable' ? val : !isWeb || resolveAs === 'value' ? val.val : val.variable
    } else if (variants[fKey]) {
      // avoids infinite loop if variant is matching a style prop
      // eg: { variants: { flex: { true: { flex: 2 } } } }
      if (parentVariantKey === key) {
        res[fKey] = val
      } else {
        res = {
          ...res,
          ...Object.fromEntries(
            resolveVariants(
              fKey,
              val,
              props,
              defaultProps,
              theme,
              variants,
              fontFamily,
              conf,
              returnVariablesAs,
              staticConfig,
              key,
              avoidDefaultProps
            )
          ),
        }
      }
    } else if (typeof val === 'string') {
      const fVal =
        val[0] === '$' ? getToken(fKey, val, conf, theme, fontFamily, returnVariablesAs) : val
      res[fKey] = fVal
    } else {
      if (isObj(val)) {
        // sub-objects: media queries, pseudos, shadowOffset
        res[fKey] = resolveTokensAndVariants(
          fKey,
          val,
          props,
          defaultProps,
          theme,
          variants,
          fontFamily,
          conf,
          returnVariablesAs,
          staticConfig,
          key,
          avoidDefaultProps
        )
      } else {
        // nullish values cant be tokens, need no extra parsing
        res[fKey] = value[fKey]
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

// goes through specificity finding best matching variant function
function getVariantDefinition(variant: any, key: string, value: any) {
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
