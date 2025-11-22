import {
  createExtractor,
  loadTamaguiBuildConfigSync,
  type TamaguiOptions,
} from '@tamagui/static'
import type { ConfigT } from 'metro-config'

// Support both old and new Metro versions
// Make the config mutable since we need to modify it
type MetroConfig = { -readonly [K in keyof ConfigT]: ConfigT[K] }

export function withTamagui(
  metroConfig: Partial<MetroConfig>,
  optionsIn?: TamaguiOptions & {
    enableCSSInterop?: boolean
  }
): MetroConfig {
  const options = {
    ...optionsIn,
    ...loadTamaguiBuildConfigSync(optionsIn),
  }

  // run one build up front
  const extractor = createExtractor()

  // need to await this somehow.. but generally this starts like 10 seconds before any request
  if (!options.disable) {
    void extractor.loadTamagui(options)
  }

  // done in css interop
  metroConfig.resolver = {
    ...(metroConfig.resolver as any),
    sourceExts: [...(metroConfig.resolver?.sourceExts || []), 'css'],
  }

  const ogTransformPath = metroConfig.transformerPath
  metroConfig.transformerPath = require.resolve('./transformer')
  metroConfig.transformer = {
    ...metroConfig.transformer,
    ...(ogTransformPath && {
      ogTransformPath,
    }),
    // @ts-ignore
    tamagui: {
      ...options,
      disableInitialBuild: true,
    },
  }

  return metroConfig as MetroConfig
}
