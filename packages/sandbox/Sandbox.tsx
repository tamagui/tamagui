// debug
globalThis['React'] = require('React')

// debug
import '@tamagui/core/reset.css'
import '@tamagui/site/public/fonts/inter.css'
import '@tamagui/polyfill-dev'

import { Studio } from '@takeout/studio'
import { AnimationsDemo, SelectDemo } from '@tamagui/demos'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, H1, H3, Paragraph, Square, YStack, ZStack } from 'tamagui'

import Tamagui from './tamagui.config'

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)
  return (
    <Tamagui.Provider defaultTheme={theme}>
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--backgroundStrong)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paragraph
          fontFamily="$silkscreen"
          px="$3"
          py="$2"
          letterSpacing={2}
          cursor="pointer"
          size="$3"
          o={0.7}
          hoverStyle={{ opacity: 1 }}
          tag="a"
          $xxs={{
            display: 'none',
          }}
        >
          Login
        </Paragraph>
        {/* <Studio /> */}
        {/* <SelectDemo /> */}
      </div>
    </Tamagui.Provider>
  )
}
