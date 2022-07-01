import { StyleObject } from '@tamagui/helpers'
import { ViewStyle } from 'react-native'

import { generateAtomicStyles } from './generateAtomicStyles'
import { PseudoDescriptor, pseudoDescriptors } from './pseudoDescriptors'

// refactor this file away next...

export type ViewStyleWithPseudos = ViewStyle & {
  hoverStyle?: ViewStyle
  pressStyle?: ViewStyle
  focusStyle?: ViewStyle
}

const pseudosOrdered = Object.values(pseudoDescriptors)

export function getStylesAtomic(stylesIn: ViewStyleWithPseudos) {
  // performance optimization
  if (!stylesIn.hoverStyle && !stylesIn.pressStyle && !stylesIn.focusStyle) {
    return getAtomicStyle(stylesIn)
  }

  // only for pseudos
  const { hoverStyle, pressStyle, focusStyle, ...base } = stylesIn
  let res: StyleObject[] = []
  // *1 order matched to *0
  for (const [index, style] of [hoverStyle, pressStyle, focusStyle, base].entries()) {
    if (!style) continue
    const pseudo = pseudosOrdered[index]
    res = [...res, ...getAtomicStyle(style, pseudo)]
  }
  return res
}

export function getAtomicStyle(style: ViewStyle, pseudo?: PseudoDescriptor): StyleObject[] {
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

  return generateAtomicStyles(style, pseudo)
}
