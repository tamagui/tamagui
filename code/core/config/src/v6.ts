// v6 base - no animations bundled, users import from specific paths (mirrors v5):
//   @tamagui/config/v6-css  (to be added when needed)

export * from './v6-base'
// Resolve the names also exported by the inherited v5 modules to the aligned v6 values.
export { defaultConfig, fonts, shorthands, themes, tokens } from './v6-base'
