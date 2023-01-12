export const names = {
  transparent: 0x00000000,
}

if (process.env.TAMAGUI_TARGET === 'native') {
  const allNames = require('./names.native').names
  Object.assign(names, allNames)
}
