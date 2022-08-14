// see core/static

if (process.env.TAMAGUI_COMPILE_PROCESS !== 1) {
  process.env.TAMAGUI_COMPILE_PROCESS = 1
}
process.env.IS_STATIC = 'is_static'
const all = {
  ...require('./dist/static'),
  aliasPlugin: require('./esbuildAliasPlugin'),
}
process.env.IS_STATIC = undefined
Object.assign(exports, all)
