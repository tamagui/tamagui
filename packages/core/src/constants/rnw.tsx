const interopRequire = (src: any) => ('default' in src ? src.default : src)

export const rnw: Record<string, any> = {}

// in static mode, require them directly since we can't import react-native-web at all (it has flow stuff in it)
if (process.env.IS_STATIC === 'is_static') {
  const createCompileableStyle = require('react-native-web/dist/cjs/exports/StyleSheet/createCompileableStyle')
  const createReactDOMStyle = require('react-native-web/dist/cjs/exports/StyleSheet/createReactDOMStyle')
  const i18Style = require('react-native-web/dist/cjs/exports/StyleSheet/i18nStyle')
  const atomic = require('react-native-web/dist/cjs/exports/StyleSheet/compile').atomic
  Object.assign(rnw, {
    createCompileableStyle,
    createReactDOMStyle,
    i18Style,
    atomic,
  })
} else if (process.env.TAMAGUI_TARGET === 'web') {
  // when targeting web (client) import it like so
  Object.assign(rnw, interopRequire(require('react-native-web').TamaguiExports))
}
