import 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import { useState } from 'react'
import { LayoutAnimation, LogBox, useColorScheme } from 'react-native'
import { Provider, BottomView } from './components'
import { type ThemeName, View, YStack } from 'tamagui'
import { ThemePicker } from './components/ThemePicker'
import { Background } from './components/Background'
import { List, Paywall } from '../src/components'

LogBox.ignoreAllLogs()

export default function App() {
  const [themeName, setThemeName] = useState<ThemeName>()

  const colorScheme = useColorScheme() ?? 'light'

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Provider defaultTheme={colorScheme}>
      <YStack theme={themeName} flex={1}>
        {/* <Background themeName={themeName} /> */}
        {/* <View flex={1} justifyContent="center" ai="center" p="$4">
          <Datepickers.Calendar />
          <ThemePicker themeColor={colorScheme} setThemeColor={setThemeName} />
        </View> */}

        <Paywall.Paywall />

        {/* <BottomView title="Paywall" /> */}
      </YStack>
    </Provider>
  )
}

const colors: ThemeName[] = [
  'neonBlue',
  'cyan',
  'forest',
  'teal',
  'orangeRed',
  'burgundy',
  'royalBlue',
  'supreme',
]
