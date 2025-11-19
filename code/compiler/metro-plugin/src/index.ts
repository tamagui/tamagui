import {
  createExtractor,
  loadTamaguiBuildConfigSync,
  type TamaguiOptions,
} from '@tamagui/static'
import type { IntermediateConfigT } from 'metro-config'

export function withTamagui(
  metroConfig: Partial<IntermediateConfigT>,
  optionsIn?: TamaguiOptions & {
    enableCSSInterop?: boolean
  }
) {
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

  return metroConfig
}
