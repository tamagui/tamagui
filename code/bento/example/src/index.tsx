

import { useFonts } from 'expo-font'
import { useEffect, useState } from 'react'
import { Appearance, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from './components'

export default function App() {
  const [theme, setTheme] = useState(Appearance.getColorScheme())
  // const [loaded] = useFonts({
  //   Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
  //   InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  // })

  const colorScheme = useColorScheme()

  useEffect(() => {
    setTheme(colorScheme)
  }, [colorScheme])

  // if (!loaded) {
  //   return null
  // }

  return (
    <SafeAreaProvider>
      <Provider defaultTheme={theme as any}></Provider>
    </SafeAreaProvider>
  )
}
