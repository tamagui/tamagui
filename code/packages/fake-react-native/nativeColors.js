const { createRequire } = require('node:module')
const { dirname, join } = require('node:path')
const createNativeModuleLoader = require('./loadNativeModule')
const cache = new Map()

// use the consumer's factories, including its react native patches. the opaque
// values belong to react native; the compiler must not reimplement their shape.
exports.getNativeColorFactories = function getNativeColorFactories(
  projectRoot,
  platform = process.env.EXPO_OS || 'ios'
) {
  const projectRequire = createRequire(join(projectRoot, 'package.json'))
  const root = dirname(projectRequire.resolve('react-native/package.json'))
  const key = `${root}:${platform}`
  if (cache.has(key)) return cache.get(key)
  const load = createNativeModuleLoader()
  const stylesheet = join(root, 'Libraries/StyleSheet')
  const factories = {
    PlatformColor: load(
      join(
        stylesheet,
        `PlatformColorValueTypes.${platform === 'android' ? 'android' : 'ios'}.js`
      )
    ).PlatformColor,
    DynamicColorIOS: load(
      join(
        stylesheet,
        platform === 'android'
          ? 'PlatformColorValueTypesIOS.js'
          : 'PlatformColorValueTypesIOS.ios.js'
      )
    ).DynamicColorIOS,
  }
  cache.set(key, factories)
  return factories
}
