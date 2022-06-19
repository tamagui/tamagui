const interopRequire = (x: any) => ('default' in x ? x.default : x)
export const rnw: any = {}

// in static mode, require them directly since we can't import react-native-web at all (it has flow stuff in it)
if (process.env.IS_STATIC === 'is_static') {
  Object.assign(rnw, interopRequire(require('react-native-web/dist/cjs/tamagui-exports')))
} else if (process.env.TAMAGUI_TARGET === 'web') {
  Object.assign(rnw, interopRequire(require('react-native-web').TamaguiExports))
}
