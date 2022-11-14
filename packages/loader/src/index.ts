import path from 'path'

process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'
process.env.IS_STATIC = 'is_static'

export * from './plugin'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (filePath: string, projectRoot: string) => {
  if ((filePath.includes(projectRoot) && filePath.endsWith('sx')) || isTamaguiDistJSX(filePath)) {
    return false
  }
  return true
}

function isTamaguiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
