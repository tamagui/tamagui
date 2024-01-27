import type { MaskDefinitions } from '@tamagui/create-theme'
import {
  combineMasks,
  createIdentityMask,
  createInverseMask,
  createMask,
  createSoftenMask,
  createStrengthenMask,
  skipMask,
} from '@tamagui/create-theme'

export const masks = {
  identity: createIdentityMask(),
  soften: createSoftenMask(),
  soften2: createSoftenMask({ strength: 2 }),
  soften3: createSoftenMask({ strength: 3 }),
  strengthen: createStrengthenMask(),
  inverse: createInverseMask(),
  inverseSoften: combineMasks(createInverseMask(), createSoftenMask({ strength: 2 })),
  inverseSoften2: combineMasks(createInverseMask(), createSoftenMask({ strength: 3 })),
  inverseSoften3: combineMasks(createInverseMask(), createSoftenMask({ strength: 4 })),
  inverseStrengthen2: combineMasks(
    createInverseMask(),
    createStrengthenMask({ strength: 2 })
  ),
  strengthenButSoftenBorder: createMask((template, options) => {
    const stronger = createStrengthenMask().mask(template, options)
    const softer = createSoftenMask().mask(template, options)
    return {
      ...stronger,
      borderColor: softer.borderColor,
      borderColorHover: softer.borderColorHover,
      borderColorPress: softer.borderColorPress,
      borderColorFocus: softer.borderColorFocus,
    }
  }),
  soften2Border1: createMask((template, options) => {
    const softer2 = createSoftenMask({ strength: 2 }).mask(template, options)
    const softer1 = createSoftenMask({ strength: 1 }).mask(template, options)
    return {
      ...softer2,
      borderColor: softer1.borderColor,
      borderColorHover: softer1.borderColorHover,
      borderColorPress: softer1.borderColorPress,
      borderColorFocus: softer1.borderColorFocus,
    }
  }),
  soften3FlatBorder: createMask((template, options) => {
    const borderMask = createSoftenMask({ strength: 2 }).mask(template, options)
    const softer3 = createSoftenMask({ strength: 3 }).mask(template, options)
    return {
      ...softer3,
      borderColor: borderMask.borderColor,
      borderColorHover: borderMask.borderColorHover,
      borderColorPress: borderMask.borderColorPress,
      borderColorFocus: borderMask.borderColorFocus,
    }
  }),
  softenBorder: createMask((template, options) => {
    const plain = skipMask.mask(template, options)
    const softer = createSoftenMask().mask(template, options)
    return {
      ...plain,
      borderColor: softer.borderColor,
      borderColorHover: softer.borderColorHover,
      borderColorPress: softer.borderColorPress,
      borderColorFocus: softer.borderColorFocus,
    }
  }),
  softenBorder2: createMask((template, options) => {
    const plain = skipMask.mask(template, options)
    const softer = createSoftenMask({ strength: 2 }).mask(template, options)
    return {
      ...plain,
      borderColor: softer.borderColor,
      borderColorHover: softer.borderColorHover,
      borderColorPress: softer.borderColorPress,
      borderColorFocus: softer.borderColorFocus,
    }
  }),
} satisfies MaskDefinitions
