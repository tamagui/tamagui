import {
  StyleObject,
  invertMapTransformKeys,
  mergeTransform,
  stylePropsTransform,
} from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { getConfig } from '../conf'
import { rnw } from '../constants/rnw'
import { isVariable } from '../createVariable'

// NOTE: going to refactor and merge getSplitStyles + getAtomicStyles into one
// before i can do that need to not rely on rnw for generateAtomicStyles
// will change that to not be external at all and just logically do it in the
// merged getSplitStyles/getAtomicStyles file in one loop.

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

type AtomicStyleOptions = {
  splitTransforms?: boolean
}

export function getStylesAtomic(stylesIn: ViewStyleWithPseudos, options: AtomicStyleOptions = {}) {
  const { hoverStyle, pressStyle, focusStyle, ...base } = stylesIn
  let res: StyleObject[] = []

  // *1 order matched to *0
  for (const [index, style] of [hoverStyle, pressStyle, focusStyle, base].entries()) {
    if (!style || !Object.keys(style).length) {
      continue
    }
    const pseudo = pseudosOrdered[index]
    for (const skey in style) {
      const val = style[skey]
      if (isVariable(val)) {
        style[skey] = val.toString()
      }
      if (stylePropsTransform[skey]) {
        delete style[skey]
        mergeTransform(style, skey, val)
      }
    }
    res = [...res, ...getAtomicStyle(style, pseudo, options)]
  }

  return res
}

const generateAtomicStyles = (style: ViewStyle) => {
  return rnw.atomic(rnw.createCompileableStyle(rnw.createReactDOMStyle(style))) as {
    [key: string]: StyleObject
  }
}

let reversedShorthands: Record<string, string> | null = null

function getAtomicStyle(
  style: ViewStyle,
  pseudo: { name: string; priority: number } | undefined,
  options: AtomicStyleOptions
): StyleObject[] {
  if (style == null || typeof style !== 'object') {
    throw new Error(`Wrong style type: "${typeof style}": ${style}`)
  }

  // why is this diff from react-native-web!? need to figure out
  for (const key in borderDefaults) {
    if (key in style) {
      style[borderDefaults[key]] = style[borderDefaults[key]] ?? 'solid'
    }
  }

  let atomicStyles: { [key: string]: StyleObject & { transformProperty?: string } } = {}

  if (options.splitTransforms && style.transform) {
    let { transform, ...rest } = style
    Object.assign(atomicStyles, generateAtomicStyles(rest))
    for (const t of transform) {
      const tKey = Object.keys(t)[0]
      const transformProperty = invertMapTransformKeys[tKey] || tKey
      const out = generateAtomicStyles({ transform: [t] })
      const key = Object.keys(out)[0]
      atomicStyles[key] = {
        ...out[key],
        transformProperty,
      }
    }
  } else {
    // TODO we can do this all in one loop likely inside getSplitStyles in existing loop and avoid O(n^3)...
    atomicStyles = generateAtomicStyles(style)
  }

  if (!reversedShorthands) {
    reversedShorthands = {}
    const conf = getConfig()
    if (conf.shorthands) {
      for (const key in conf.shorthands) {
        reversedShorthands[conf.shorthands[key]] = key
      }
    }
  }

  // TODO ... and then also avoid this loop! n^4
  return Object.keys(atomicStyles).map((key) => {
    const val = atomicStyles[key]
    // r-transform-1ns13n
    const [_, a, b] = val.identifier.split('-')
    // dev mode its "r-transform-1ns13n", prod its "r-1ns13n", normalize them
    const hash = b || a
    // pseudos have a `--` to be easier to find with concatClassNames
    const psuedoPrefix = pseudo ? `0${pseudo.name}-` : ''
    const shortProp = reversedShorthands![val.property] || val.property
    const identifier = `_${shortProp}-${psuedoPrefix}${hash}`
    const className = `.${identifier}`
    const rules = val.rules.map((rule) => {
      if (pseudo) {
        const psuedoPrefixSelect = [...Array(pseudo.priority)].map(() => ':root').join('') + ' '
        let res = rule
          .replace(`.${val.identifier}`, `${psuedoPrefixSelect} ${className}`)
          .replace('{', `:${pseudo.name}{`)

        if (pseudo.name === 'hover') {
          // hover styles need to be conditional
          // perhaps this can be generalized but for now lets just shortcut
          // and hardcode for hover styles, if we need to later we can
          // WEIRD SYNTAX, SEE:
          //   https://stackoverflow.com/questions/40532204/media-query-for-devices-supporting-hover
          res = `@media not all and (hover: none) { ${res} }`
        }
        return res
      }
      return rule.replace(`.${val.identifier}`, className).replace(importantRegex, '')
    })

    const result: StyleObject = {
      property: val.transformProperty || val.property,
      value: val.value,
      identifier,
      className,
      rules,
    }

    return result
  })
}

const importantRegex = /\!important*/g

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}

// *0 order matches to *1
export const pseudos = {
  hoverStyle: {
    name: 'hover',
    priority: 1,
  },
  pressStyle: {
    name: 'active',
    priority: 2,
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
}

const pseudosOrdered = Object.values(pseudos)
