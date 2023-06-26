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
  inverseSoften: combineMasks(createInverseMask(), createSoftenMask()),
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
}
