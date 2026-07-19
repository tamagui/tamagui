import { useColorScheme } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps, Toaster } from 'tamagui'
import { config } from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config' | 'defaultTheme'>) {
  const colorScheme = useColorScheme()

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      {children}
      <Toaster position="top-center" swipeDirection="horizontal" duration={6000} />
    </TamaguiProvider>
  )
}
