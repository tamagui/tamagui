import { Lato_400Regular, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato'
import { ToastViewport } from '@tamagui/sandbox-ui'
import { useFonts } from 'expo-font'
import { useEffect, useMemo, useState } from 'react'
import { Appearance, Platform, useColorScheme } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext } from './useKitchenSinkTheme'

if (Platform.OS === 'ios') {
  require('./iosSheetSetup')
}

export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme())
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    Lato: Lato_400Regular,
    LatoBold: Lato_700Bold,
    LatoBlack: Lato_900Black,
  })

  const colorScheme = useColorScheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  const children = useMemo(() => {
    return <Navigation />
  }, [])

  const themeContext = useMemo(() => {
    return {
      value: theme,
      set: setTheme,
    }
  }, [theme])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={themeContext}>
        <Provider defaultTheme={theme as any}>
          {children}

          <SafeToastViewport />
        </Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  )
}

const SafeToastViewport = () => {
  const { left, top, right } = useSafeAreaInsets()
  return (
    <>
      <ToastViewport
        flexDirection="column-reverse"
        top={top}
        left={left}
        right={right}
        mx="auto"
      />
    </>
  )
}
