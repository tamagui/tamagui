import 'expo-dev-client'

import { useFonts } from 'expo-font'
import React from 'react'
import { NativeNavigation } from 'starter-app/navigation/native'
import { Provider } from 'starter-app/provider'

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <NativeNavigation />
    </Provider>
  )
}
