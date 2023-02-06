import '@tamagui/web/reset.css'
import '@tamagui/polyfill-dev'

import { Stack, TamaguiProvider } from '@tamagui/web'
import { useState } from 'react'

import config from './tamagui.config'

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <button
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        🌗
      </button>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <Stack ai="center" jc="center" f={1} bc="red">
        <Stack onMoveShouldSetResponder={() => true}>hi</Stack>
      </Stack>

      {/*  */}
    </TamaguiProvider>
  )
}
