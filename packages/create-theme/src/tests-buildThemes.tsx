// @ts-ignore

import { buildThemes } from './buildThemes'
import { createStrengthenMask, createWeakenMask } from './masks'
import { palettes } from './palettes'
import { templates } from './templates'

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

const themes = buildThemes()
  //
  .addPalettes(palettes)
  .addTemplates(templates)
  .addMasks({
    soften: createWeakenMask(),
    strengthen: createStrengthenMask(),
  })
  .addThemes({
    dark: {
      template: 'dark',
      palette: 'dark',
    },
    light: {
      template: 'light',
      palette: 'light',
    },
  })
  .addChildThemes({
    blue: {
      palette: '*_blue',
      template: 'color',
    },
  })
  .addChildThemes({
    alt1: {
      mask: 'soften',
    },
  })
  .addChildThemes(
    {
      ListItem: {
        mask: 'strengthen',
      },
    },
    {
      // we dont actually do this right now but this is an important api to figure out
      avoidNestingWithin: ['alt1'],
    }
  )

// rome-ignore lint/nursery/noConsoleLog: <explanation>
console.log(themes.build())
