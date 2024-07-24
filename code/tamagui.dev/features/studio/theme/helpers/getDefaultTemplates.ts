import type { BuildTemplates } from '../types'

export function getDefaultTemplates() {
  // its offset by some transparent values etc
  const basePaletteOffset = 5
  const namedTemplateSlots = {
    background: basePaletteOffset,
    subtleBackground: basePaletteOffset + 1,
    uiBackground: basePaletteOffset + 2,
    hoverUIBackround: basePaletteOffset + 3,
    activeUIBackround: basePaletteOffset + 4,
    subtleBorder: basePaletteOffset + 5,
    strongBorder: basePaletteOffset + 6,
    hoverBorder: basePaletteOffset + 7,
    strongBackground: basePaletteOffset + 8,
    hoverStrongBackground: basePaletteOffset + 9,
  }

  const baseTemplate = {
    accentBackground: 0,
    accentColor: -0,

    background0: 1,
    background025: 2,
    background05: 3,
    background075: 4,

    color0: -4,
    color025: -3,
    color05: -2,
    color075: -1,

    background: 5,
    backgroundHover: 6,
    backgroundPress: 7,
    backgroundFocus: 8,

    color: -5,
    colorHover: -6,
    colorPress: -5,
    colorFocus: -6,

    placeholderColor: -6,

    borderColor: 7,
    borderColorHover: 8,
    borderColorFocus: 9,
    borderColorPress: 8,
  }

  const template = {
    color1: 5,
    color2: 6,
    color3: 7,
    color4: 8,
    color5: 9,
    color6: 10,
    color7: 11,
    color8: 12,
    color9: 13,
    color10: 14,
    color11: 15,
    color12: 16,
    ...baseTemplate,
  }

  return {
    base: template,
    active: {
      ...template,
      background: namedTemplateSlots.strongBackground,
      backgroundHover: namedTemplateSlots.hoverStrongBackground,
      backgroundPress: namedTemplateSlots.hoverBorder,
      backgroundFocus: namedTemplateSlots.strongBackground,
    },
  } satisfies BuildTemplates
}
