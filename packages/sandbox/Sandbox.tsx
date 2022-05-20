import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider, SliderProps } from '@tamagui/slider'
import React, { useState } from 'react'
import { Button, Input, PopoverProps, Spacer, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

const size = '$6'

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider disableRootThemeClass injectCSS defaultTheme={theme}>
      <Button
        pos="absolute"
        b={10}
        l={10}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch
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
        <YStack space={size}>
          <Button size={size}>Hello</Button>
          <Input size={size} />
          <Demo size={size} />
        </YStack>
        {/* <Spacer size="$8" />
        <Demo size="$10" /> */}
      </div>
    </Tamagui.Provider>
  )
}

export function Demo(props: SliderProps) {
  return (
    <Slider width="100%" bc="blue" defaultValue={[50]} max={100} step={1} {...props}>
      <Slider.Track bc="green">
        <Slider.TrackActive bc="red" />
      </Slider.Track>
      <Slider.Thumb circular elevate index={0} />
    </Slider>
  )
}
