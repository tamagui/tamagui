process.env.TAMAGUI_TARGET = process.env.TAMAGUI_TARGET || 'web'
process.env.TAMAGUI_COMPILE_PROCESS = '1'

export default require('./loader').loader

// helper for webpack exclude specific to tamagui

export const shouldExclude = (path: string, projectRoot: string, tamaguiOptions: any) => {
  if (path.includes('react-native-reanimated')) {
    return false
  }
  // analyze everything in our jsx dir
  // analyze everything in the components dirs
  const shouldInclude =
    path.includes(projectRoot) ||
    tamaguiOptions.components.some(
      (c) =>
        path.includes(`/node_modules/${c}`) ||
        path.includes(`${c}/dist/jsx/`) ||
        // more generic catch-all for independent tamagui packages like drawer
        (path.includes('tamagui') && path.includes('/dist/jsx/'))
    )
  if (!shouldInclude) {
    return true
  }
  return false
}
