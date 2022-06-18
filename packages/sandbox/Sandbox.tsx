// debug
globalThis['React'] = require('React')

// debug
import '@tamagui/core/reset.css'
import '@tamagui/site/public/fonts/inter.css'
import '@tamagui/polyfill-dev'

import { Studio } from '@takeout/studio'
import { SelectDemo } from '@tamagui/demos'
import { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, H1, H3, Paragraph } from 'tamagui'

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
        <H1
          ta="left"
          size="$9"
          als="center"
          maw={500}
          $gtSm={{
            mx: 0,
            maxWidth: 800,
            size: '$11',
            ta: 'center',
          }}
          $gtMd={{
            maxWidth: 900,
            ta: 'center',
            size: '$12',
          }}
          $gtLg={{
            size: '$13',
            maxWidth: 1200,
          }}
        >
          Hello world
        </H1>
        {/* <Studio /> */}
        {/* <SelectDemo /> */}
      </div>
    </Tamagui.Provider>
  )
}
