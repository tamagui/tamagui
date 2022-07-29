import React from 'react'
import { TamaguiProviderProps } from 'tamagui'

import Tamagui from '../tamagui.config'
import { NavigationProvider } from './navigation'

export function Provider({ children, ...rest }: TamaguiProviderProps) {
  return (
    <Tamagui.Provider defaultTheme="light" {...rest}>
      <NavigationProvider>{children}</NavigationProvider>
    </Tamagui.Provider>
  )
}
