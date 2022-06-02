import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, H1, Slider, YStack } from 'tamagui'

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
            Design Ssyadsasad faste Design Ssyadsasad faste Design Ssyadsasad faste
          </H1>

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
