import { StyleObject, stylePropsTransform } from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { isVariable } from '../createVariable'
import { generateAtomicStyles } from './generateAtomicStyles'
import { mergeTransform } from './mergeTransform'
import { PseudoDescriptor, pseudos } from './pseudos'

// refactor this file away next...

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

type AtomicStyleOptions = {
  splitTransforms?: boolean
}

const pseudosOrdered = Object.values(pseudos)

export function getStylesAtomic(stylesIn: ViewStyleWithPseudos, options?: AtomicStyleOptions) {
  // performance optimization
  if (!stylesIn.hoverStyle && !stylesIn.pressStyle && !stylesIn.focusStyle) {
    return getAtomicStyle(stylesIn, undefined, options)
  }

  // only for pseudos
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
  pseudo?: PseudoDescriptor,
  options?: AtomicStyleOptions
): StyleObject[] {
  if (process.env.NODE_ENV === 'development') {
    if (!style || typeof style !== 'object') {
      throw new Error(`Wrong style type: "${typeof style}": ${style}`)
    }
  } else {
    if (!style) {
      console.warn(`Invalid style`)
      return []
    }
  }

  if (options && options.splitTransforms && style.transform) {
    let atomicStyles: StyleObject[] = []
    let { transform, ...rest } = style
    for (const t of transform) {
      atomicStyles.push(generateAtomicStyles({ transform: [t] }, pseudo)[0])
    }
    return [...atomicStyles, ...generateAtomicStyles(rest, pseudo)]
  }

  return generateAtomicStyles(style, pseudo)
}
