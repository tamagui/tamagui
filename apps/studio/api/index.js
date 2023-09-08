if (process.env.IS_TAMAGUI_DEV) {
  Object.assign(module.exports, require('../dist/cjs/api'))
} else {
  module.exports = {}
}
