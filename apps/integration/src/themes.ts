import type { MaskOptions } from '@tamagui/create-theme'
import {
  addChildren,
  applyMask,
  createStrengthenMask,
  createTheme,
  createWeakenMask,
} from '@tamagui/create-theme'

import { tokens } from './tokens'

/**
 * This is an advanced setup of themes for *only* light + dark (no colors)
 *
 * For color themes, see the @tamagui/config source code themes.ts file
 * which this was based off of, which includes extra steps for color and
 * alternate sub-themes.
 */

export const themes = (() => {
  // background => foreground
  const palettes = {
    light: [
      tokens.color.darkTransparent,
      tokens.color.light1,
      tokens.color.light2,
      tokens.color.light3,
      tokens.color.light4,
      tokens.color.light5,
      tokens.color.light6,
      tokens.color.light7,
      tokens.color.light8,
      tokens.color.light9,
      tokens.color.light10,
      tokens.color.light11,
      tokens.color.light12,
      tokens.color.lightTransparent,
    ],
    dark: [
      tokens.color.lightTransparent,
      tokens.color.dark1,
      tokens.color.dark2,
      tokens.color.dark3,
      tokens.color.dark4,
      tokens.color.dark5,
      tokens.color.dark6,
      tokens.color.dark7,
      tokens.color.dark8,
      tokens.color.dark9,
      tokens.color.dark10,
      tokens.color.dark11,
      tokens.color.dark12,
      tokens.color.darkTransparent,
    ],
  }

  const genericsTemplate = {
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 2,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    borderColor: 4,
    borderColorHover: 5,
    borderColorPress: 3,
    borderColorFocus: 4,
    placeholderColor: -4,
  }

  const colorStepsTemplate = {
    color1: 1,
    color2: 2,
    color3: 3,
    color4: 4,
    color5: 5,
    color6: 6,
    color7: 7,
    color8: 8,
    color9: 9,
    color10: 10,
    color11: 11,
    color12: 12,
  }

  const shadowsTemplate = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2,
  }

  const template = {
    ...colorStepsTemplate,
    ...shadowsTemplate,
    ...genericsTemplate,
  }

  const lightShadowColor = 'rgba(0,0,0,0.02)'
  const lightShadowColorStrong = 'rgba(0,0,0,0.066)'
  const darkShadowColor = 'rgba(0,0,0,0.2)'
  const darkShadowColorStrong = 'rgba(0,0,0,0.3)'

  const lightShadows = {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  }

  const darkShadows = {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
  }

  /**
   * Create the base light/dark themes, they use the full "template"
   */
  const light = createTheme(palettes.light, template)
  const dark = createTheme(palettes.dark, template)

  type BaseTheme = typeof light

  /**
   * Set up some masks which we can use to shift the base templates to be more or less contrasty
   */
  const masks = {
    weaker: createWeakenMask(),
    stronger: createStrengthenMask(),
  }

  /**
   * Use to get our specific component themes
   */
  function getComponentThemes(theme: BaseTheme, inverse: BaseTheme, isLight: boolean) {
    const componentMaskOptions: MaskOptions = {
      // basically we only want the generics, avoids extra weight
      skip: {
        ...colorStepsTemplate,
        ...shadowsTemplate,
      },
      // avoids the transparent ends
      max: palettes.light.length - 2,
      min: 1,
    }

    const weaker1 = applyMask(theme, masks.weaker, componentMaskOptions)
    const base = applyMask(weaker1, masks.stronger, componentMaskOptions)
    const weaker2 = applyMask(weaker1, masks.weaker, componentMaskOptions)
    const stronger1 = applyMask(theme, masks.stronger, componentMaskOptions)
    const inverse1 = applyMask(inverse, masks.weaker, componentMaskOptions)
    const inverse2 = applyMask(inverse1, masks.weaker, componentMaskOptions)

    // make overlays always dark
    const overlayTheme = {
      background: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.9)',
    } as BaseTheme

    return {
      ListItem: isLight ? stronger1 : base,
      Card: weaker1,
      Button: weaker2,
      Checkbox: weaker2,
      DrawerFrame: weaker1,
      SliderTrack: stronger1,
      SliderTrackActive: weaker2,
      SliderThumb: inverse1,
      Progress: weaker1,
      ProgressIndicator: inverse,
      Switch: weaker2,
      SwitchThumb: inverse2,
      TooltipArrow: weaker1,
      TooltipContent: weaker2,
      Input: stronger1,
      TextArea: stronger1,
      Tooltip: inverse1,
      SheetOverlay: overlayTheme,
      DialogOverlay: overlayTheme,
      ModalOverlay: overlayTheme,
    }
  }

  const baseThemes = {
    light,
    dark,
  }

  return addChildren(baseThemes, (name, theme) => {
    const isLight = name === 'light'
    const inverseName = isLight ? 'dark' : 'light'
    const inverseTheme = baseThemes[inverseName]
    return getComponentThemes(theme, inverseTheme, isLight)
  })
})()
