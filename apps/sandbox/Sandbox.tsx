// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { useState } from 'react'
import { Button, Input, Square, TamaguiProvider, XStack, YStack } from 'tamagui'

import config from './tamagui.config'

// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />
      <button
        style={{
          position: 'absolute',
          top: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <YStack space="$2">
        <Square size={100} bc="red" />
        <Square size={100} bc="red" />
        <Square size={100} bc="red" />
      </YStack>

      <Input size="$2" placeholder="hi" />
    </TamaguiProvider>
  )
}
