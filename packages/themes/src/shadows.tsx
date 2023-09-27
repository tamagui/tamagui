const lightShadowColor = 'rgba(0,0,0,0.03)'
const lightShadowColorStrong = 'rgba(0,0,0,0.065)'
const darkShadowColor = 'rgba(0,0,0,0.3)'
const darkShadowColorStrong = 'rgba(0,0,0,0.4)'

export const shadows = {
  light: {
    shadowColor: lightShadowColorStrong,
    shadowColorHover: lightShadowColorStrong,
    shadowColorPress: lightShadowColor,
    shadowColorFocus: lightShadowColor,
  },
  dark: {
    shadowColor: darkShadowColorStrong,
    shadowColorHover: darkShadowColorStrong,
    shadowColorPress: darkShadowColor,
    shadowColorFocus: darkShadowColor,
  },
}
