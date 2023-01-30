export const names = {
  // keep the basics
  transparent: 0x00000000,
  white: 0xffffffff,
  black: 0x000000ff,
}

if (
  process.env.INCLUDE_CSS_COLOR_NAMES ||
  process.env.TAMAGUI_TARGET === 'native'
) {
  const allNames = require('./names.native').names
  Object.assign(names, allNames)
}
