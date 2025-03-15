import 'react-native-gesture-handler'

import { useFonts } from 'expo-font'
import { useState } from 'react'
import { LogBox, useColorScheme } from 'react-native'
import { Provider, BottomView } from './components'
import { type ThemeName, View, YStack } from 'tamagui'
import { Datepickers, UserProfile } from '../src/components'
import { ThemePicker } from './components/ThemePicker'
import { Background } from './components/Background'

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
      {/* <YStack theme={themeName} bg={'$color2'} flex={1}>
        <Background themeName={themeName} />
        <View flex={1} justifyContent="center" ai="center" p="$4">
          <Datepickers.Calendar />
          <ThemePicker themeColor={colorScheme} setThemeColor={setThemeName} />
        </View>
        <BottomView title="Calendar" />
      </YStack> */}
      <UserProfile.ProfileView />
    </Provider>
  )
}
