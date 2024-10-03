import config from '~/config/tamagui.config'

export const themeTokenNumber = {
  dark: 3,
  light: 9,
}

export const headerColors = {
  dark: config.themes.dark_yellow[`color${themeTokenNumber.dark}`].val,
  light: config.themes.light_yellow[`color${themeTokenNumber.light}`].val,
}
