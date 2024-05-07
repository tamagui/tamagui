import type { CreateMask } from '@tamagui/create-theme'
import {
  combineMasks,
  createInverseMask,
  createMask,
  createSoftenMask,
  createStrengthenMask,
  skipMask,
} from '@tamagui/create-theme'

import type { BuildMask } from '../../theme-builder/types'

// helper function for generating a custom mask given an object
// pulled out from studio, not really a "user facing" API yet

export function buildMask(masks: BuildMask[]) {
  return combineMasks(
    ...masks.map((mask) => {
      if (mask.type === 'override') {
        return skipMask
      }
      if (mask.type === 'inverse') {
        return createInverseMask()
      }
      if (mask.type === 'soften') {
        return createSoftenMask({ strength: mask.strength || 0 })
      }
      if (mask.type === 'strengthen') {
        return createStrengthenMask({ strength: mask.strength || 0 })
      }
      if (mask.type === 'softenBorder') {
        return createMask((template, options) => {
          const plain = skipMask.mask(template, options)
          const softer = createSoftenMask({ strength: mask.strength }).mask(
            template,
            options
          )
          return {
            ...plain,
            borderColor: softer.borderColor,
            borderColorHover: softer.borderColorHover,
            borderColorPress: softer.borderColorPress,
            borderColorFocus: softer.borderColorFocus,
          }
        })
      }
      if (mask.type === 'strengthenBorder') {
        return createMask((template, options) => {
          const plain = skipMask.mask(template, options)
          const softer = createSoftenMask({ strength: mask.strength }).mask(
            template,
            options
          )
          return {
            ...plain,
            borderColor: softer.borderColor,
            borderColorHover: softer.borderColorHover,
            borderColorPress: softer.borderColorPress,
            borderColorFocus: softer.borderColorFocus,
          }
        })
      }
      return {} as CreateMask
    })
  )
}
