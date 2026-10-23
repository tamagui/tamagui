import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const staticRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)
const createNativeModuleLoader = staticRequire(
  '@tamagui/fake-react-native/loadNativeModule'
)
const cache = new Map<string, NativeColorFactories>()

type NativeColorFactories = {
  PlatformColor: (...names: string[]) => unknown
  DynamicColorIOS: (colors: Record<string, unknown>) => unknown
}

// use the consumer's factories, including its react native patches. the opaque
// values belong to react native; the compiler must not reimplement their shape.
export function getNativeColorFactories(
  projectRoot: string,
  platform = process.env.EXPO_OS || 'ios'
): NativeColorFactories {
  const projectRequire = createRequire(join(projectRoot, 'package.json'))
  const root = dirname(projectRequire.resolve('react-native/package.json'))
  const key = `${root}:${platform}`
  const cached = cache.get(key)
  if (cached) return cached
  const load = createNativeModuleLoader(staticRequire)
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

// absolute entry for generated evaluation code, so it never resolves from the consumer.
export const nativeColorsModulePath = staticRequire.resolve(
  '@tamagui/static/nativeColors'
)
