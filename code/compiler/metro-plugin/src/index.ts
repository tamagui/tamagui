import {
  createExtractor,
  loadTamaguiBuildConfigSync,
  type TamaguiOptions,
} from '@tamagui/static'
import {
  withCssInterop,
  type ComposableIntermediateConfigT,
} from 'react-native-css-interop/metro'

export function withTamagui(
  metroConfig: ComposableIntermediateConfigT,
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

  if (options.enableCSSInterop) {
    metroConfig = withCssInterop(metroConfig, {
      ignorePropertyWarningRegex: ['^--'],
      // grouping: ['^group(/.*)?'],
    })
  } else {
    // done in css interop
    metroConfig.resolver = {
      ...metroConfig.resolver,
      sourceExts: [...metroConfig.resolver.sourceExts, 'css'],
    }
  }

  const ogTransformPath = metroConfig.transformerPath
  metroConfig.transformerPath = require.resolve('./transformer')
  metroConfig.transformer = {
    ...metroConfig.transformer,
    ogTransformPath,
    tamagui: {
      ...options,
      disableInitialBuild: true,
    },
  }

  return metroConfig
}
