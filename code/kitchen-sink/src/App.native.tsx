import React from 'react'
import { ToastViewport } from '@tamagui/sandbox-ui'
import { useFonts } from 'expo-font'

import { Appearance, Platform, useColorScheme } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext } from './useKitchenSinkTheme'

if (Platform.OS === 'ios') {
  require('./iosSheetSetup')
}

export default function App() {
  const [theme, setTheme] = React.useState(Appearance.getColorScheme())
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const colorScheme = useColorScheme()

  React.useEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  const children = React.useMemo(() => {
    return <Navigation />
  }, [])

  const themeContext = React.useMemo(() => {
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
