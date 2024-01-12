import type { TamaguiOptions } from '@tamagui/static'
import { createExtractor } from '@tamagui/static'
import type { GetTransformOptionsOpts } from 'metro-config'
import {
  ComposableIntermediateConfigT,
  withCssInterop,
} from 'react-native-css-interop/metro'

export function withTamagui(
  metroConfig: ComposableIntermediateConfigT,
  options: TamaguiOptions
) {
  const extractor = createExtractor()

  // emits outputCSS
  extractor.loadTamaguiSync(options)

  metroConfig = withCssInterop(metroConfig, {
    ignorePropertyWarningRegex: ['^--tw-'],
    grouping: ['^group(/.*)?'],
  })

  const previousTransformOptions = metroConfig.transformer?.getTransformOptions

  metroConfig.transformer = {
    ...metroConfig.transformer,

    nativewind: options.outputCSS
      ? {
          input: options.outputCSS,
        }
      : undefined,

    getTransformOptions: async (
      entryPoints: ReadonlyArray<string>,
      options: GetTransformOptionsOpts,
      getDependenciesOf: (filePath: string) => Promise<string[]>
    ) => {
      return previousTransformOptions?.(entryPoints, options, getDependenciesOf)
    },
  }

  return metroConfig
}
