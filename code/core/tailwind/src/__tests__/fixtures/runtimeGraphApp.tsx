import { TamaguiProvider } from '@tamagui/style'
import { ThemeUpdate } from '@tamagui/style/theme-update'
import { View } from '@tamagui/tailwind'
import { createElement, type ComponentProps } from 'react'

type ProviderProps = ComponentProps<typeof TamaguiProvider>
const config = {} as NonNullable<ProviderProps['config']>

export function RuntimeGraphApp() {
  return createElement(
    TamaguiProvider,
    { config, defaultTheme: 'light' },
    createElement(ThemeUpdate, null, createElement(View, { className: 'dark:bg-blue-4' }))
  )
}
