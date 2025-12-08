// import { ToastViewport } from '@tamagui/sandbox-ui'
import * as SplashScreen from 'expo-splash-screen'
import React from 'react'
import { Appearance, LogBox, useColorScheme } from 'react-native'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext } from './useKitchenSinkTheme'

// Disable LogBox warnings to prevent them from blocking E2E tests
// These are typically deep import warnings from react-native internals
LogBox.ignoreAllLogs()

SplashScreen.hideAsync()

export default function App() {
  const [theme, setTheme] = React.useState(Appearance.getColorScheme())
  // TODO restore
  // const [loaded] = useFonts({
  //   Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
  //   InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  // })

  const colorScheme = useColorScheme()

  React.useLayoutEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  const themeContext = React.useMemo(() => {
    return {
      value: theme,
      set: (next) => {
        Appearance.setColorScheme(next)
        setTheme(next)
      },
    }
  }, [theme])

  // if (!loaded) {
  //   return null
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeContext.Provider value={themeContext}>
          <Provider defaultTheme={theme as any}>
            <Navigation />
            {/* // TODO restore */}
            {/* <SafeToastViewport /> */}
          </Provider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

// TODO?
// const SafeToastViewport = () => {
//   const { left, top, right } = useSafeAreaInsets()
//   return (
//     <>
//       <ToastViewport
//         flexDirection="column-reverse"
//         top={top}
//         left={left}
//         right={right}
//         mx="auto"
//       />
//     </>
//   )
// }
