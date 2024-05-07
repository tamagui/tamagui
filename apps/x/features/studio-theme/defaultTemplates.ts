import { PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'

const colorsTemplate = {
  color1: PALETTE_BACKGROUND_OFFSET,
  color2: PALETTE_BACKGROUND_OFFSET + 1,
  color3: PALETTE_BACKGROUND_OFFSET + 2,
  color4: PALETTE_BACKGROUND_OFFSET + 3,
  color5: PALETTE_BACKGROUND_OFFSET + 4,
  color6: PALETTE_BACKGROUND_OFFSET + 5,
  color7: PALETTE_BACKGROUND_OFFSET + 6,
  color8: PALETTE_BACKGROUND_OFFSET + 7,
  color9: PALETTE_BACKGROUND_OFFSET + 8,
  color10: PALETTE_BACKGROUND_OFFSET + 9,
  color11: PALETTE_BACKGROUND_OFFSET + 10,
  color12: PALETTE_BACKGROUND_OFFSET + 11,
}

const accentsTemplate = {
  accentBackground: `$accent.${PALETTE_BACKGROUND_OFFSET}`,
  accentColor: `$accent.-${PALETTE_BACKGROUND_OFFSET}`,
}

const transparenciesTemplate = {
  background0: 1,
  background025: 2,
  background05: 3,
  background075: 4,
  color0: -4,
  color025: -3,
  color05: -2,
  color075: -1,
}

export const defaultBaseTemplate = {
  ...accentsTemplate,
  ...transparenciesTemplate,

  background: PALETTE_BACKGROUND_OFFSET,
  backgroundHover: PALETTE_BACKGROUND_OFFSET + 1,
  backgroundPress: PALETTE_BACKGROUND_OFFSET + 2,
  backgroundFocus: PALETTE_BACKGROUND_OFFSET + 3,

  color: -5,
  colorHover: -6,
  colorPress: -5,
  colorFocus: -6,

  placeholderColor: -6,

  borderColor: 7,
  borderColorHover: 8,
  borderColorFocus: 9,
  borderColorPress: 8,

  ...colorsTemplate,
}

const surfaceAdd = 3
const surfaceOffset = PALETTE_BACKGROUND_OFFSET + surfaceAdd

export const defaultSurfaceTemplate = {
  ...defaultBaseTemplate,

  background: surfaceOffset,
  backgroundHover: surfaceOffset + 1,
  backgroundPress: surfaceOffset + 2,
  backgroundFocus: surfaceOffset + 3,

  borderColor: defaultBaseTemplate.borderColor + surfaceAdd,
  borderColorHover: defaultBaseTemplate.borderColorHover + surfaceAdd,
  borderColorFocus: defaultBaseTemplate.borderColorFocus + surfaceAdd,
  borderColorPress: defaultBaseTemplate.borderColorPress + surfaceAdd,
}

export const defaultTemplates = {
  base: defaultBaseTemplate,
  surface: defaultSurfaceTemplate,
}
