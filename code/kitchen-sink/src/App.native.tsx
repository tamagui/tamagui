import { ToastViewport } from '@tamagui/sandbox-ui'
import { useFonts } from 'expo-font'
import React from 'react'
import { Appearance, DynamicColorIOS, Platform, useColorScheme } from 'react-native'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Navigation } from './Navigation'
import { Provider } from './provider'
import { ThemeContext } from './useKitchenSinkTheme'
import Svg, { Circle, Path } from 'react-native-svg'
import { ChevronRight, Moon, Sun } from '@tamagui/lucide-icons'

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

  React.useLayoutEffect(() => {
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
          {/* {children} */}

          <XStack h={200} w={20} bg="red" />
          <ColorSchemeListItem />
          <Card />

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

import { styled, XStack } from 'tamagui'
import { ColorSchemeListItem } from './features/home/ColorSchemeListItem'

const Card = styled(XStack, {
  ov: 'hidden',
  minWidth: '100%',
  p: '$4',
  gap: '$4',
  bbw: 1,
  bbc: '$borderColor',

  hoverStyle: {
    bg: '$color2',
  },

  pressStyle: {
    bg: '$color2',
  },

  variants: {
    disableLink: {
      true: {
        hoverStyle: {
          bg: 'transparent',
        },

        pressStyle: {
          bg: 'transparent',
        },
      },
    },
  } as const,
})
