import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { config as configBase } from '@tamagui/config'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { TamaguiProvider, createTamagui } from 'tamagui'

import { Studio } from './src'

globalThis['React'] = React

const config = createTamagui({
  ...configBase,
  themeClassNameOnRoot: false,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

const App = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <link href="/fonts/inter.css" rel="stylesheet" />
      <Studio />
    </TamaguiProvider>
  )
}

createRoot(document.querySelector('#root')!).render(<App />)
