import { useFonts } from 'expo-font'
import React from 'react'
import { View } from 'react-native'

import { Navigation } from './Navigation'
import { Provider } from './provider'
import Tamagui from './tamagui.config'

export default function App() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/ttf/Inter.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <Navigation />
    </Provider>
  )
}
