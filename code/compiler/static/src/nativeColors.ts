import { createRequire } from 'node:module'
import { getNativeColorFactories as nativeColorFactories } from '@tamagui/react-native-web-lite/nativeColors'

const staticRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

// keep the existing compiler export while the native factories belong to lite.
export function getNativeColorFactories(
  _projectRoot: string,
  platform = process.env.EXPO_OS || 'ios'
) {
  return nativeColorFactories(platform)
}

// absolute entry for generated evaluation code, so it never resolves from the consumer.
export const nativeColorsModulePath = staticRequire.resolve(
  '@tamagui/static/nativeColors'
)
