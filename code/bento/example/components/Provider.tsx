import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import config from '../../tamagui.config'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} {...rest}>
        {children}
      </TamaguiProvider>
    </GestureHandlerRootView>
  )
}
