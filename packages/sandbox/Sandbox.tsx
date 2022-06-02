import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, Slider, YStack } from 'tamagui'

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
        <YStack space>
          {/* <DialogDemo /> */}
          {/* <KitchenSink /> */}
          <Slider width={200} defaultValue={[50]} max={100} step={1}>
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb hoverable bordered circular elevate index={0} />
          </Slider>
        </YStack>
      </div>
    </Tamagui.Provider>
  )
}
