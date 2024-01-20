import { createExtractor, type TamaguiOptions } from '@tamagui/static'
import {
  withCssInterop,
  ComposableIntermediateConfigT,
} from 'react-native-css-interop/metro'

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
  void extractor.loadTamagui(options)

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
