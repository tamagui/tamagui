const { readFileSync } = require('node:fs')
const { dirname, resolve } = require('node:path')
const Module = require('node:module')
const { transformSync } = require('@babel/core')

// evaluate installed react native modules without loading their native bindings.
module.exports = function createNativeModuleLoader(bindings = new Map()) {
  const cache = new Map()
  function load(filename) {
    if (bindings.has(filename)) return bindings.get(filename)
    if (cache.has(filename)) return cache.get(filename).exports
    const compiled = new Module(filename, module)
    compiled.paths = Module._nodeModulePaths(dirname(filename))
    compiled.require = (request) => {
      if (request.startsWith('.')) {
        const path = resolve(dirname(filename), request)
        return load(path.endsWith('.js') ? path : path + '.js')
      }
      return Module.prototype.require.call(compiled, request)
    }
    cache.set(filename, compiled)
    const output = transformSync(readFileSync(filename, 'utf8'), {
      filename,
      babelrc: false,
      configFile: false,
      presets: [
        [require.resolve('@react-native/babel-preset'), { enableBabelRuntime: false }],
      ],
    })
    Function(
      'require',
      'module',
      'exports',
      '__DEV__',
      output.code
    )(compiled.require, compiled, compiled.exports, process.env.NODE_ENV !== 'production')
    return compiled.exports
  }
  return load
}
