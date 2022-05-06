import * as Core from '@tamagui/core'
import {
  CreateTamaguiConfig,
  CreateTamaguiProps,
  TamaguiInternalConfig,
  TamaguiProviderProps,
} from '@tamagui/core'
import * as React from 'react'

import { SafeAreaProvider } from './views/SafeAreaProvider'

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E, infer F>>
  ? TamaguiInternalConfig<A, B, C, D, E, F>
  : unknown {
  const conf = Core.createTamagui(config)

  // add our providers
  const OGProvider = conf.Provider
  conf.Provider = ({ children, ...props }: TamaguiProviderProps) => {
    return (
      <OGProvider {...props}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </OGProvider>
    )
  }

  return conf
}
