import { StyleObject, stylePropsTransform } from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { isVariable } from '../createVariable'
import { generateAtomicStyles } from './generateAtomicStyles'
import { invertMapTransformKeys, mergeTransform } from './mergeTransform'
import { PseudoDescriptor, pseudoDescriptors } from './pseudoDescriptors'

// refactor this file away next...

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

type AtomicStyleOptions = {
  // StyleObject.propererty will be original transform key, so extractor can keep prop/spread logic
  splitTransforms?: boolean
}

const pseudosOrdered = Object.values(pseudoDescriptors)

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

export function getAtomicStyle(
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
      const tKey = Object.keys(t)[0]
      const transformProperty = invertMapTransformKeys[tKey] || tKey
      const out = generateAtomicStyles({ transform: [t] }, pseudo)[0]
      atomicStyles.push({
        ...out,
        property: transformProperty,
      })
    }
    return [...atomicStyles, ...generateAtomicStyles(rest, pseudo)]
  }

  return generateAtomicStyles(style, pseudo)
}
