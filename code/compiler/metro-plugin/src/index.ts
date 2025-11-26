import {
  createExtractor,
  loadTamaguiBuildConfigSync,
  type TamaguiOptions,
} from '@tamagui/static'
import type { IntermediateConfigT } from 'metro-config'

export type MetroTamaguiOptions = TamaguiOptions & {
  /**
   * When true, writes CSS to .tamagui/css/ files and imports them,
   * letting Metro handle CSS bundling. When false (default), CSS is
   * injected inline via JS at runtime.
   * @default false
   */
  cssInterop?: boolean
}

export function withTamagui(
  metroConfig: Partial<IntermediateConfigT>,
  optionsIn?: MetroTamaguiOptions
) {
  const { cssInterop, ...tamaguiOptionsIn } = optionsIn || {}

  const options = {
    ...tamaguiOptionsIn,
    ...loadTamaguiBuildConfigSync(tamaguiOptionsIn),
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
    // @ts-ignore - metro-plugin specific option
    tamaguiCssInterop: cssInterop,
  }

  return metroConfig
}
