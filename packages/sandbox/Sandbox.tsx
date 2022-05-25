// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Slider, SliderProps } from '@tamagui/slider'
import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Button, Select, YStack } from 'tamagui'

import { SandboxAnimationDemo } from './SandboxAnimationDemo'
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
        <YStack space ai="center">
          <Select defaultValue="blueberry">
            <Select.Trigger>
              <Select.Value />
              <Select.Icon></Select.Icon>
            </Select.Trigger>

            <Select.Content>
              <Select.ScrollUpButton>☝️</Select.ScrollUpButton>

              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
              </Select.Group>

              <Select.ScrollDownButton>👇</Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </YStack>
      </div>
    </Tamagui.Provider>
  )
}
