import { Text, ToastViewport } from '@tamagui/sandbox-ui'
import { useFonts } from 'expo-font'
import { createContext, useEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import { Appearance, Platform, useColorScheme } from 'react-native'
import type { ColorSchemeName } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Provider } from './components/provider/Provider'

if (Platform.OS === 'ios') {
  require('./iosSheetSetup')
}

export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme())
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const colorScheme = useColorScheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  const themeContext = useMemo(() => {
    return {
      value: theme,
      set: (next) => {
        Appearance.setColorScheme(next)
        setTheme(next)
      },
    }
  }, [theme])

  if (!loaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={themeContext}>
        <Provider defaultTheme={theme as any}>
          <Text>test</Text>
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

const ThemeContext = createContext({
  value: Appearance.getColorScheme(),
  set(next: ColorSchemeName) {},
})

const useThemeControl = () => {
  return useContext(ThemeContext)
}
