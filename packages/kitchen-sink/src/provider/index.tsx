import { Drawer } from '@tamagui/drawer'
import React from 'react'
import { TamaguiProviderProps } from 'tamagui'

import Tamagui from '../tamagui.config'
import { NavigationProvider } from './navigation'

export function Provider({ children, ...rest }: TamaguiProviderProps) {
  return (
    <Tamagui.Provider defaultTheme="light" {...rest}>
      <NavigationProvider>
        <Drawer.Provider>{children}</Drawer.Provider>
      </NavigationProvider>
    </Tamagui.Provider>
  )
}
