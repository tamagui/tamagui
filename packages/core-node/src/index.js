// see core/static

if (process.env.TAMAGUI_COMPILE_PROCESS !== '1') {
  process.env.TAMAGUI_COMPILE_PROCESS = '1'
}

process.env.IS_STATIC = 'is_static'

try {
  const all = {
    ...require('../dist/static'),
    aliasPlugin: require('./esbuildAliasPlugin'),
  }
  Object.assign(exports, all)
} catch (err) {
  // eslint-disable-next-line no-console
  console.log('Error loading @tamagui/core-node', err)
}
