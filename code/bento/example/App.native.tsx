import 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import { useState } from 'react'
import { Appearance, LogBox } from 'react-native'
import { Provider, BottomView } from './components'
import { type ThemeName, View, YStack } from 'tamagui'
import { Datepickers } from '../src/components'

LogBox.ignoreAllLogs()

export default function App() {
  const [theme] = useState(Appearance.getColorScheme() ?? 'light')
  const [themeName, setThemeName] = useState<ThemeName>()

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Provider defaultTheme={theme}>
      <YStack theme={themeName} bg={'$color2'} flex={1}>
        <View flex={1} jc="center" ai="center" p="$4">
          <Datepickers.Calendar />
        </View>
        <BottomView
          title="Date Picker"
          themeColor="orange"
          setThemeColor={setThemeName}
        />
      </YStack>
    </Provider>
  )
}
