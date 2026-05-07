// check launch args for disabling RNGH (for testing without gesture handler)
import { LaunchArguments } from 'react-native-launch-arguments'
import { getGestureHandler } from '@tamagui/native'

interface TestLaunchArgs {
  disableGestureHandler?: boolean
  disableKeyboardController?: boolean
  initialTestCase?: string
  directUseCase?: string
}

const rawLaunchArgs = LaunchArguments.value<TestLaunchArgs>()

// Detox forwards launch args as `-key value` strings, so a JS `true` boolean
// arrives as the string "true" and `false` arrives as "false" — which is
// truthy in JS. Coerce known boolean flags so explicit `false` keeps
// KeyboardProvider/RNGH mounted.
const isTrueArg = (value: unknown) =>
  value === true || value === 'true' || value === 1 || value === '1'

const launchArgs = {
  ...rawLaunchArgs,
  disableGestureHandler: isTrueArg(rawLaunchArgs.disableGestureHandler),
  disableKeyboardController: isTrueArg(rawLaunchArgs.disableKeyboardController),
}

if (launchArgs.disableGestureHandler) {
  getGestureHandler().disable()
}

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { useFonts } from 'expo-font'
import React from 'react'
import { Appearance, LogBox, Platform, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PortalProvider } from 'react-native-teleport'
import { H1 } from 'tamagui'
import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext, type ThemeMode } from './useKitchenSinkTheme'
import * as SplashScreen from 'expo-splash-screen'

// Disable LogBox warnings to prevent them from blocking E2E tests
// These are typically deep import warnings from react-native internals
LogBox.ignoreAllLogs()

SplashScreen.hideAsync()

// Detox launches the activity through AndroidX MonitoringInstrumentation, which
// waits up to 45s for the main looper to go idle. Mounting the full Navigation
// tree synchronously on first commit (with all the test cases statically
// imported into the bundle) keeps main busy long enough on the CI emulator
// (software graphics, 2GB RAM) to blow that timeout. Deferring the heavy mount
// by one tick gives the looper a chance to idle so the launch handshake can
// finish before we start doing real work.
const isAndroid = Platform.OS === 'android'

export default function App() {
  const [ready, setReady] = React.useState(!isAndroid)

  React.useEffect(() => {
    if (ready) return
    const id = setTimeout(() => setReady(true), 0)
    return () => clearTimeout(id)
  }, [ready])

  const [mode, setMode] = React.useState<ThemeMode>('system')
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const systemColorScheme = useColorScheme()

  // Resolved theme based on mode
  // useColorScheme can return null (RN 0.83+) or 'unspecified' (after setColorScheme('unspecified'))
  const scheme = mode === 'system' ? systemColorScheme : mode
  const resolvedTheme = (scheme && scheme !== 'unspecified' ? scheme : null) || 'light'

  // Update Appearance when mode changes (for native components)
  React.useEffect(() => {
    if (mode === 'system') {
      // RN 0.83+ Kotlin conversion makes setColorScheme non-null on Android
      // pass 'unspecified' to follow system
      Appearance.setColorScheme('unspecified' as any)
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

  if (!loaded || !ready) {
    return null
  }

  const DirectUseCase = getDirectUseCaseComponent(launchArgs.directUseCase)

  // KeyboardProvider keeps the main thread busy via continuous keyboard-state
  // monitoring, which prevents Detox's RCTContentDidAppearNotification from
  // firing promptly after RN reload, hanging tests. Allow tests to opt out.
  const Inner = (
    <PortalProvider>
      <SafeAreaProvider>
        <ThemeContext.Provider value={themeContext}>
          <Provider defaultTheme={resolvedTheme as any}>
            {DirectUseCase ? (
              <DirectUseCase />
            ) : (
              <Navigation initialTestCase={launchArgs.initialTestCase} />
            )}
          </Provider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </PortalProvider>
  )

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {launchArgs.disableKeyboardController ? (
        Inner
      ) : (
        <KeyboardProvider>{Inner}</KeyboardProvider>
      )}
    </GestureHandlerRootView>
  )
}

function getDirectUseCaseComponent(name?: string): React.ComponentType | null {
  if (!name) {
    return null
  }

  const useCases = require('./usecases') as Record<
    string,
    React.ComponentType | undefined
  >

  return (
    useCases[name] || (() => <H1 testID="direct-usecase-not-found">Not found: {name}</H1>)
  )
}
