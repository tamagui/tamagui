// see core/static

process.env.IS_STATIC = 'is_static'
process.env.TAMAGUI_IS_SERVER = 'true'

try {
  const all = {
    // @ts-ignore
    ...require('../dist/index'),
    // @ts-ignore
    aliasPlugin: require('./esbuildAliasPlugin'),
  }
  Object.assign(exports, all)
  process.env.IS_STATIC = undefined
} catch (err) {
  // rome-ignore lint/suspicious/noConsoleLog: ok
  console.log('Error loading @tamagui/core-node', err)
}
