import { StyleObject, stylePropsTransform } from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { reversedShorthands } from '../createTamagui'
import { isVariable } from '../createVariable'
import { RulesData, generateAtomicStyles } from './generateAtomicStyles'
import { invertMapTransformKeys, mergeTransform } from './mergeTransform'
import { pseudos } from './pseudos'

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

type AtomicStyleOptions = {
  splitTransforms?: boolean
}

type PseudoDescriptor = typeof pseudos[keyof typeof pseudos]

const pseudosOrdered = Object.values(pseudos)

// this is how compiler outputs psueodo identifier
// TODO remove in next refactor
export const psuedoCNInverse = {
  hover: 'hoverStyle',
  focus: 'focusStyle',
  press: 'pressStyle',
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

function getAtomicStyle(
  style: ViewStyle,
  pseudo: PseudoDescriptor | undefined,
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

  let atomicStyles: { [key: string]: RulesData & { transformProperty?: string } } = {}

  if (options.splitTransforms && style.transform) {
    let { transform, ...rest } = style
    style = rest
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
  }

  if (style) {
    Object.assign(atomicStyles, generateAtomicStyles(style))
  }

  // TODO ... and then also avoid this loop! n^4
  return Object.keys(atomicStyles).map((key) => {
    const val = atomicStyles[key]
    const hash = val.identifier
    // pseudos have a `--` to be easier to find with concatClassNames
    const psuedoPrefix = pseudo ? `0${pseudo.name}-` : ''
    if (!val.property) {
      throw new Error(`no prop`)
    }
    const shortProp = reversedShorthands[val.property] || val.property
    const identifier = `_${shortProp}-${psuedoPrefix}${hash}`
    const className = `.${identifier}`
    const rules = val.rules.map((rule) => {
      if (pseudo) {
        const psuedoPrefixSelect = [...Array(pseudo.priority)].map(() => ':root').join('') + ' '
        let res = rule
          .replace(`.${val.identifier}`, `${psuedoPrefixSelect} ${className}`)
          .replace('{', `:${pseudo.name}{`)
          // important to override inline styles
          .replace(';', ' !important;')

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
      pseudo: pseudo?.name,
      value: val.value as any,
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
