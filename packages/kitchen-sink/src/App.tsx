import { useFonts } from 'expo-font'
import React from 'react'

import { Navigation } from './Navigation'
import { Provider } from './provider'

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
