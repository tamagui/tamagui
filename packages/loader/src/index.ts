import path from 'path'

// TODO this is being compiled below the export *
// just turn this into a cjs module only
process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'
process.env.IS_STATIC = 'is_static'

export * from './TamaguiPlugin'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (filePath: string, projectRoot: string) => {
  if (
    (filePath.includes(projectRoot) && filePath.endsWith('sx')) ||
    isTamaguiDistJSX(filePath)
  ) {
    return false
  }
  return true
}

function isTamaguiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
