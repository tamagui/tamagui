import { createExtractor, type TamaguiOptions } from '@tamagui/static'
import type { ComposableIntermediateConfigT } from 'react-native-css-interop/metro'
import { withCssInterop } from 'react-native-css-interop/metro'

export function withTamagui(
  metroConfig: ComposableIntermediateConfigT,
  options: TamaguiOptions
) {
  metroConfig = withCssInterop(metroConfig, {
    ignorePropertyWarningRegex: ['^--'],
    // grouping: ['^group(/.*)?'],
  })

  // run one build up front
  const extractor = createExtractor()

  // need to await this somehow.. but generally this starts like 10 seconds before any request
  if (!options.disable) {
    void extractor.loadTamagui(options)
  }

  metroConfig.transformerPath = require.resolve('./transformer')
  metroConfig.transformer = {
    ...metroConfig.transformer,
    tamagui: {
      ...options,
      disableInitialBuild: true,
    },
  }
  return metroConfig
}
