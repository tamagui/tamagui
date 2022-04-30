import { OverlayProvider } from '@react-native-aria/overlays'
import * as Core from '@tamagui/core'
import {
  CreateTamaguiConfig,
  CreateTamaguiProps,
  TamaguiInternalConfig,
  TamaguiProviderProps,
} from '@tamagui/core'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export function createTamagui<Conf extends CreateTamaguiProps>(
  config: Conf
): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E>>
  ? TamaguiInternalConfig<A, B, C, D, E>
  : unknown {
  const conf = Core.createTamagui(config)

  // add our providers
  const OGProvider = conf.Provider
  conf.Provider = ({ children, ...props }: TamaguiProviderProps) => {
    return (
      <OGProvider {...props}>
        <SafeAreaProvider>
          <OverlayProvider>{children}</OverlayProvider>
        </SafeAreaProvider>
      </OGProvider>
    )
  }

  return conf
}
