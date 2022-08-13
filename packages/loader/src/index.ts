import path from 'path'

process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'
process.env.IS_STATIC = 'is_static'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (filePath: string, projectRoot: string) => {
  if (
    filePath.includes('react-native-web') ||
    filePath.includes('react-native-reanimated') ||
    filePath.includes('react-native-gesture-handler') ||
    // filePath.includes('expo-linear-gradient') ||
    filePath.includes('@gorhom/portal') ||
    filePath.includes(projectRoot) ||
    isTamaguiDistJSX(filePath)
  ) {
    return false
  }
  return true
}

function isTamaguiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
