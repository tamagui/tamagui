import { addRule } from '@tamagui/helpers'
import type { StyleObject } from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { pseudos } from '../constants/pseudos'
import { rnw } from '../constants/rnw'

const generateStyle = (style: any) => {
  const { atomic, createCompileableStyle, createReactDOMStyle, i18Style } = rnw
  return {
    ...atomic(createCompileableStyle(createReactDOMStyle(i18Style(style)))),
  }
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}

export function getStylesAtomic(style: any, avoidCollection = false) {
  const styles: { [key: string]: ViewStyle } = {
    base: {},
  }
  // split pseudos
  for (const key in style) {
    if (!!pseudos[key]) {
      styles[key] = style[key]
    } else {
      styles.base[key] = style[key]
    }
  }
  return Object.keys(styles)
    .map((key) => {
      return getAtomicStyle(styles[key], pseudos[key], avoidCollection)
    })
    .flat()
}

const importantRegex = /\!important*/g

function getAtomicStyle(
  style: ViewStyle,
  pseudo?: { name: string; priority: number },
  avoidCollection?: boolean
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

  const all = generateStyle(style)
  return Object.keys(all).map((key) => {
    const val = all[key]
    const hash = val.identifier.slice(`${val.identifier}`.lastIndexOf('-') + 1)
    // pseudos have a `--` to be easier to find with concatClassNames
    const psuedoPrefix = pseudo ? `0${pseudo.name}-` : ''
    const identifier = `_${val.property}-${psuedoPrefix}${hash}`
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

    if (!avoidCollection) {
      if (rules.length > 1) {
        console.warn('have never seen more than one, verifying')
      }
      addRule(rules[0])
    }

    const result: StyleObject = {
      property: val.property,
      value: val.value,
      identifier,
      className,
      rules,
    }
    return result
  })
}
