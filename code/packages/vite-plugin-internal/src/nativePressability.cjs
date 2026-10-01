const { readFileSync } = require('node:fs')
const { dirname, join, resolve } = require('node:path')
const Module = require('node:module')
const { transformSync } = require('@babel/core')

// run react native's actual press state machine in native tests. only the
// platform bindings are mocked; geometry, timers and cancellation stay real.
const root = dirname(require.resolve('react-native/package.json'))
const platform = require('@tamagui/fake-react-native').Platform
const bindings = new Map([
  [join(root, 'Libraries/Utilities/Platform.js'), platform],
  [
    join(root, 'Libraries/ReactNative/UIManager.js'),
    {
      measure() {
        throw new Error('native press tests must provide a measurable responder')
      },
    },
  ],
  [join(root, 'Libraries/Components/Sound/SoundManager.js'), { playTouchSound() {} }],
  [
    join(root, 'src/private/featureflags/ReactNativeFeatureFlags.js'),
    {
      shouldPressibilityUseW3CPointerEventsForHover: () => false,
    },
  ],
])
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
  compiled._compile(output.code, filename)
  return compiled.exports
}

module.exports = load(join(root, 'Libraries/Pressability/usePressability.js')).default
