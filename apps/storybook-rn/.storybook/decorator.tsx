import { TamaguiProvider, YStack } from '@my/ui'
import { Decorator } from '@storybook/react'
import { UniversalThemeProvider } from 'app/provider/theme'
import { ToastProvider } from 'app/provider/toast'
import React from 'react'
import config from '../tamagui.config'

export const StorybookDecorator: Decorator = (Story, args: any) => {
  return (
    <UniversalThemeProvider>
      <TamaguiProvider config={config} defaultTheme="light">
        <ToastProvider noSafeArea>
          <YStack backgroundColor="$background" f={1}>
            <Story />
          </YStack>
        </ToastProvider>
      </TamaguiProvider>
    </UniversalThemeProvider>
  )
}
