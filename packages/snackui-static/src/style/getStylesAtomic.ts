import _ from 'lodash'
import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import createReactDOMStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'

import { StyleObject } from '../types'

export const pseudos = {
  focusStyle: {
    name: 'focus-within',
    priority: 4,
  },
  activeStyle: {
    name: 'active',
    priority: 3,
  },
  pressStyle: {
    name: 'focus',
    priority: 2,
  },
  hoverStyle: {
    name: 'hover',
    priority: 1,
  },
}

const borderDefaults = {
  borderWidth: 'borderStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderTopWidth: 'borderTopStyle',
  borderLeftWidth: 'borderLeftStyle',
  borderRightWidth: 'borderRightStyle',
}

export function getStylesAtomic(
  style: any,
  classList?: string[] | null,
  shouldPrintDebug?: boolean
) {
  const styles: { [key: string]: ViewStyle } = {
    base: {},
  }

  // split psuedos
  for (const key in style) {
    if (!!pseudos[key]) {
      styles[key] = style[key]
    } else {
      styles.base[key] = style[key]
    }
  }

  return Object.keys(styles)
    .map((key) => {
      return getAtomicStyle(styles[key], pseudos[key])
    })
    .flat()

  function getAtomicStyle(
    style: ViewStyle,
    pseudoConfig?: { name: string; priority: number }
  ) {
    if (style == null || typeof style !== 'object') {
      throw new Error(`Wrong style type: "${typeof style}": ${style}`)
    }
    // why is this diff from react-native-web!? we need to figure out
    for (const key in borderDefaults) {
      if (key in style) {
        style[borderDefaults[key]] = style[borderDefaults[key]] ?? 'solid'
      }
    }
    const all = _.cloneDeep(
      atomic(createCompileableStyle(createReactDOMStyle(i18Style(style))))
    )
    for (const key in all) {
      const styleObj = all[key]
      if (pseudoConfig) {
        const ogId = styleObj.identifier
        const prefix = pseudoConfig.name.slice(0, 2)
        styleObj.identifier = `${styleObj.identifier}-${prefix}`
        const newSelector = [...Array(pseudoConfig.priority)]
          .map((x) => `.${styleObj.identifier}`)
          .join('')
        styleObj.rules = styleObj.rules.map((rule) =>
          rule
            .replace(`.${ogId}`, newSelector)
            .replace('{', `:${pseudoConfig.name}{`)
        )
      }
      if (styleObj.rules[0].indexOf('!important') > 0) {
        styleObj.rules[0] = styleObj.rules[0].replace('!important', '')
      }
      styleObj.className = `.${styleObj.identifier}`
    }
    if (shouldPrintDebug) {
      console.log(`getStylesAtomic`, all)
    }
    return Object.keys(all).map((key) => all[key]) as StyleObject[]
  }
}
