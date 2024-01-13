import type { TamaguiOptions } from '@tamagui/static'
import {
  ComposableIntermediateConfigT,
  withCssInterop,
} from 'react-native-css-interop/metro'

export function withTamagui(
  metroConfig: ComposableIntermediateConfigT,
  options: TamaguiOptions
) {
  // metroConfig = withCssInterop(metroConfig, {
  //   // TODO figure out why/what for
  //   ignorePropertyWarningRegex: ['^--tw-'],
  //   grouping: ['^group(/.*)?'],
  // })

  // github.com/marklawlor/nativewind/blob/main/packages/nativewind/src/metro/tailwind-cli.ts
  // https://github.com/marklawlor/nativewind/blob/main/packages/nativewind/src/metro/index.ts
  // https://github.com/marklawlor/nativewind/blob/main/packages/nativewind/src/metro/transformer.ts

  metroConfig.transformerPath = require.resolve('./transformer')

  // const previousTransformOptions = metroConfig.transformer?.getTransformOptions

  metroConfig.transformer = {
    ...metroConfig.transformer,

    tamagui: options,

    // getTransformOptions: async (
    //   entryPoints: ReadonlyArray<string>,
    //   options: GetTransformOptionsOpts,
    //   getDependenciesOf: (filePath: string) => Promise<string[]>
    // ) => {
    //   const tamaguiOptions = ((metroConfig as any).transformer.tamagui) as TamaguiOptions

    //   Object.assign(tamaguiOptions, {

    //   })

    //   return previousTransformOptions?.(entryPoints, options, getDependenciesOf)
    // },
  }

  return metroConfig
}
