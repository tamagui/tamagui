import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { KitchenSink } from '@tamagui/kitchen-sink'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, SizableText, Square, YStack, styled } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme={theme}>
      <Button
        pos="absolute"
        b={10}
        l={10}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </Button>

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
        <YStack
          space
          ai="center"
          debug="verbose"
          $gtSm={{
            space: '$10',
          }}
        >
          {/* <DialogDemo /> */}
          {/* <KitchenSink /> */}
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
          <Square bc="red" size={100} />
        </YStack>
      </div>
    </Tamagui.Provider>
  )
}
