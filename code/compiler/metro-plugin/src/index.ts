import {
  createExtractor,
  loadTamaguiBuildConfigSync,
  type TamaguiOptions,
} from '@tamagui/static'

export type MetroTamaguiOptions = TamaguiOptions & {
  /**
   * When true, writes CSS to .tamagui/css/ files and imports them,
   * letting Metro handle CSS bundling. When false (default), CSS is
   * injected inline via JS at runtime.
   * @default false
   */
  cssInterop?: boolean
}

// Use a loose type for metro config to avoid version-specific type incompatibilities
type MetroConfigInput = {
  resolver?: any
  transformer?: any
  transformerPath?: string
  [key: string]: any
}

export function withTamagui(
  metroConfig: MetroConfigInput,
  optionsIn?: MetroTamaguiOptions
): MetroConfigInput {
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
