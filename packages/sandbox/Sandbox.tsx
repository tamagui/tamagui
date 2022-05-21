import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider, SliderProps } from '@tamagui/slider'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Input, Spacer, XStack, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

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
        <XStack maw="100%" ov="hidden" space ai="center" fs={0}>
          {/* <FormDemo size="$3" /> */}
          <FormDemo size="$4" />
          {/* <FormDemo size="$9" /> */}
        </XStack>
      </div>
    </Tamagui.Provider>
  )
}

export function FormDemo({ size }) {
  return (
    <YStack space={size} p={size}>
      <Button size={size}>Hello</Button>
      <Input size={size} />
      <Demo size={size} />
    </YStack>
  )
}

export function Demo(props: SliderProps) {
  return (
    <>
      <Slider defaultValue={[50]} max={100} step={1} {...props}>
        <Slider.Track>
          <Slider.TrackActive bc="red" />
        </Slider.Track>
        <Slider.Thumb hoverable bordered circular elevate index={0} />
      </Slider>
      <Spacer />
      <Spacer />
      <Spacer />
      <Slider orientation="vertical" bc="blue" defaultValue={[50]} max={100} step={1} {...props}>
        <Slider.Track bc="green">
          <Slider.TrackActive bc="red" />
        </Slider.Track>
        <Slider.Thumb hoverable bordered circular elevate index={0} />
      </Slider>
    </>
  )
}
