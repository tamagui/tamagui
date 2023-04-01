import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'
import { useColorScheme } from 'react-native';

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme();
  return (
    <TamaguiProvider config={config} disableInjectCSS defaultTheme={scheme === 'dark' ? 'dark' : 'light'} {...rest}>
      <NavigationProvider>{children}</NavigationProvider>
    </TamaguiProvider>
  )
}
