import * as Core from '@tamagui/core'
import { CreateTamaguiProps, InferTamaguiConfig, TamaguiProviderProps } from '@tamagui/core'
import * as React from 'react'

// this was used to wrap SafeAreaProvider, but no more, but leaving for now...

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): InferTamaguiConfig<Conf> {
  const conf = Core.createTamagui(config)

  // add our providers
  const OGProvider = conf.Provider
  conf.Provider = ({ children, ...props }: TamaguiProviderProps) => {
    return (
      <>
        <OGProvider {...props}>{children}</OGProvider>
      </>
    )
  }

  return conf
}
