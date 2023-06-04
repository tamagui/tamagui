export const templates = (() => {
  const templateColors = {
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

  const templateShadows = {
    shadowColor: 1,
    shadowColorHover: 1,
    shadowColorPress: 2,
    shadowColorFocus: 2,
  }

  // we can use subset of our template as a "override" so it doesn't get adjusted with masks
  // we want to skip over templateColor + templateShadows
  const toSkip = {
    ...templateShadows,
  }

  // templates use the palette and specify index
  // negative goes backwards from end so -1 is the last item
  const template = {
    ...templateColors,
    ...toSkip,
    // the background, color, etc keys here work like generics - they make it so you
    // can publish components for others to use without mandating a specific color scale
    // the @tamagui/button Button component looks for `$background`, so you set the
    // dark_red_Button theme to have a stronger background than the dark_red theme.
    background: 2,
    backgroundHover: 3,
    backgroundPress: 4,
    backgroundFocus: 5,
    backgroundStrong: 1,
    backgroundTransparent: 0,
    color: -1,
    colorHover: -2,
    colorPress: -1,
    colorFocus: -2,
    colorTransparent: -0,
    borderColor: 4,
    borderColorHover: 5,
    borderColorPress: 3,
    borderColorFocus: 4,
    placeholderColor: -4,
  }

  const baseTemplate = {
    ...template,
    // our light color palette is... a bit unique
    borderColor: 6,
    borderColorHover: 7,
    borderColorFocus: 5,
    borderColorPress: 6,
  }

  return {
    base: baseTemplate,
    colorLight: {
      ...baseTemplate,
      // light color themes are a bit less sensitive
      borderColor: 4,
      borderColorHover: 5,
      borderColorFocus: 4,
      borderColorPress: 4,
    },
  }
})()
