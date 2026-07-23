import { useColorScheme } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps, Toast } from 'tamagui'
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
      <Toast position="top-center" swipeDirection="horizontal" duration={6000}>
        <Toast.Viewport>
          <Toast.List />
        </Toast.Viewport>
      </Toast>
    </TamaguiProvider>
  )
}
