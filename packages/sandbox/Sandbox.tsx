import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider, SliderProps } from '@tamagui/slider'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Card, Input, Spacer, Switch, SwitchThumb, XStack, YStack } from 'tamagui'

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
          <FormDemo size="$4" />
          <FormDemo size="$5" />
          <FormDemo size="$6" />
          <FormDemo size="$7" />
        </XStack>
      </div>
    </Tamagui.Provider>
  )
}

export function FormDemo({ size }) {
  return (
    <Card size={size}>
      <XStack space={size}>
        <Slider f={1} size={size} orientation="vertical" defaultValue={[50]} max={100} step={1}>
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb hoverable bordered circular elevate index={0} />
        </Slider>
        <YStack space={size} p={size}>
          <Button size={size}>Hello</Button>
          <Input placeholder="Search..." size={size} />
          <SliderDemo w="100%" size={size} />
          <Switch size={size}>
            <SwitchThumb elevate />
          </Switch>
        </YStack>
      </XStack>
    </Card>
  )
}

export function SliderDemo(props: SliderProps) {
  return (
    <Slider my={props.size} defaultValue={[50]} max={100} step={1} {...props}>
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb
        hoverable
        bordered
        circular
        elevate
        index={0}
        focusStyle={{
          borderWidth: 2,
        }}
      />
    </Slider>
  )
}
