import type { TamaguiOptions } from '@tamagui/static'
import { createExtractor } from '@tamagui/static'
import type { GetTransformOptionsOpts } from 'metro-config'
import {
  ComposableIntermediateConfigT,
  withCssInterop,
} from 'react-native-css-interop/metro'

export function withTamagui(
  metroConfig: ComposableIntermediateConfigT,
  options: TamaguiOptions,
) {
  const extractor = createExtractor()
  const created = extractor.loadTamaguiSync(options)
  const platform = options.platform

  metroConfig = withCssInterop(metroConfig, {
    ignorePropertyWarningRegex: ['^--tw-'],
    grouping: ['^group(/.*)?'],
  })

  const previousTransformOptions = metroConfig.transformer?.getTransformOptions

  metroConfig.transformer = {
    ...metroConfig.transformer,

    getTransformOptions: async (
      entryPoints: ReadonlyArray<string>,
      options: GetTransformOptionsOpts,
      getDependenciesOf: (filePath: string) => Promise<string[]>,
    ) => {
      return previousTransformOptions?.(entryPoints, options, getDependenciesOf)
    },
  }

  // const {
  //   platform,
  //   // @ts-ignore i guess this isnt here yet?
  //   transformer,
  // } = metroConfig

  // const previousTransformOptions = transformer?.getTransformOptions

  // const cssString = ''

  // cssToReactNativeRuntime(cssString, transformer?.cssToReactNativeRuntime)

  return metroConfig
}
