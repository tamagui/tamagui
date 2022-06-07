import * as Core from '@tamagui/core'
import { CreateTamaguiProps, InferTamaguiConfig, TamaguiProviderProps } from '@tamagui/core'
import * as React from 'react'

import { SafeAreaProvider } from './views/SafeAreaProvider'

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): InferTamaguiConfig<Conf> {
  const conf = Core.createTamagui(config)

  // add our providers
  const OGProvider = conf.Provider
  conf.Provider = ({ children, ...props }: TamaguiProviderProps) => {
    return (
      <SafeAreaProvider>
        <OGProvider {...props}>{children}</OGProvider>
      </SafeAreaProvider>
    )
  }

  return conf
}
