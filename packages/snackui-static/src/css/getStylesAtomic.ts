import _ from 'lodash'
import { ViewStyle } from 'react-native'
import { atomic } from 'react-native-web/dist/cjs/exports/StyleSheet/compile'
import createCompileableStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle'
import createReactDOMStyle from 'react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle'
import i18Style from 'react-native-web/dist/cjs/exports/StyleSheet/i18nStyle'
import { getOrCreateStylePrefix } from 'snackui/node'
import { getNiceKey } from 'snackui/node'

import { StyleObject } from '../types'

export const pseudos = {
  focusWithinStyle: {
    name: 'focus-within',
    priority: 4,
  },
  focusStyle: {
    name: 'focus',
    priority: 3,
  },
  pressStyle: {
    name: 'active',
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
}

function getAtomicStyle(
  style: ViewStyle,
  pseudo?: { name: string; priority: number }
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
  const all = _.cloneDeep(
    atomic(createCompileableStyle(createReactDOMStyle(i18Style(style))))
  )
  return Object.keys(all).map((key) => {
    const val = all[key]
    const prefix = `s-${getOrCreateStylePrefix(val.property)}`
    const hash = val.identifier.replace(/r-([a-z0-9]+)-/i, '')
    // pseudos have a `--` to be easier to find with concatClassNames
    const psuedoPrefix = pseudo ? `-${getNiceKey(key)}-` : ''
    const identifier = `${prefix}-${psuedoPrefix}${hash}`
    const className = pseudo
      ? [...Array(pseudo.priority)].map((x) => `.${identifier}`).join('')
      : `.${identifier}`
    const rules = val.rules.map((rule) => {
      const valCN = `.${val.identifier}`
      if (pseudo) {
        return rule
          .replace(valCN, className)
          .replace('{', `:${pseudo.name}{`)
          .replace('!important', '')
      }
      return rule.replace(valCN, className).replace('!important', '')
    })
    return {
      ...val,
      identifier,
      className,
      rules,
    } as StyleObject
  })
}
