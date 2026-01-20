import 'react-native-gesture-handler'
import { setupNativePortal } from '@tamagui/portal/setup'
import { ToastViewport } from '@tamagui/sandbox-ui'
import { useFonts } from 'expo-font'
import React from 'react'
import { Appearance, LogBox, useColorScheme } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { PortalProvider } from 'react-native-teleport'
import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext, type ThemeMode } from './useKitchenSinkTheme'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// setup native portal - will use teleport if available, otherwise fall back to legacy
setupNativePortal()

// Disable LogBox warnings to prevent them from blocking E2E tests
// These are typically deep import warnings from react-native internals
LogBox.ignoreAllLogs()

SplashScreen.hideAsync()

export default function App() {
  const [mode, setMode] = React.useState<ThemeMode>('system')
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const systemColorScheme = useColorScheme()

  // Resolved theme based on mode
  const resolvedTheme = mode === 'system' ? systemColorScheme : mode

  // Update Appearance when mode changes (for native components)
  React.useEffect(() => {
    if (mode === 'system') {
      Appearance.setColorScheme(null) // Follow system
    } else {
      Appearance.setColorScheme(mode)
    }
  }, [mode])

  const themeContext = React.useMemo(() => {
    return {
      mode,
      resolvedTheme,
      set: setMode,
    }
  }, [mode, resolvedTheme])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <SafeAreaProvider>
          <ThemeContext.Provider value={themeContext}>
            <Provider defaultTheme={resolvedTheme as any}>
              <Navigation />
              <SafeToastViewport />
            </Provider>
          </ThemeContext.Provider>
        </SafeAreaProvider>
      </PortalProvider>
    </GestureHandlerRootView>
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
