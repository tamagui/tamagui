process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (path: string, projectRoot: string, tamaguiOptions: any) => {
  if (
    path.includes('react-native-reanimated') ||
    path.includes('react-native-gesture-handler') ||
    path.includes('@gorhom/portal') ||
    path.includes(projectRoot) ||
    path.includes('/dist/jsx/')
  ) {
    return false
  }
  return true
}
