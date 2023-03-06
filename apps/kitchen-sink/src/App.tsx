import { useFonts } from 'expo-font'
import { useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { Toast, ToastProvider, YStack } from 'sandbox-ui'

import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext } from './useKitchenSinkTheme'

export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme())
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

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
          <ToastProvider>
            {children}

            <SafeToastViewport />
          </ToastProvider>
        </Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  )
}

const SafeToastViewport = () => {
  const { left, top, bottom, right } = useSafeAreaInsets()
  return (
    <>
      <Toast.Viewport
        flexDirection="column-reverse"
        name="default"
        top={top}
        left={left}
        right={right}
        mx="auto"
      />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top-left"
        top={top}
        left={left}
      />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top-center"
        top={top}
        left={left}
        right={right}
        mx="auto"
      />
      <Toast.Viewport
        flexDirection="column-reverse"
        name="top-right"
        top={top}
        right={right}
      />
      <Toast.Viewport name="bottom-left" bottom={bottom} left={left} />
      <Toast.Viewport
        name="bottom-center"
        bottom={bottom}
        left={left}
        right={right}
        mx="auto"
      />
      <Toast.Viewport name="bottom-right" bottom={bottom} right={right} />
    </>
  )
}
