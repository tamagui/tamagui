process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (path: string, projectRoot: string, tamaguiOptions: any) => {
  if (
    path.includes('react-native-reanimated')
    || path.includes(projectRoot)
    || path.includes('/dist/jsx/')
  ) {
    return false
  }
  // if (
  //   tamaguiOptions.components.some((c) =>
  //     path.includes(`/node_modules/${c}`) ||
  //     path.includes(`${c}/dist/jsx/`)
  //   )
  // ) {
  //   return false
  // }
  return true
}
