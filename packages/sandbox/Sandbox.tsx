// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { ChevronDown } from '@tamagui/feather-icons'
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
            <Select.Trigger iconAfter={ChevronDown}>
              <Select.Value placeholder="Something" />
            </Select.Trigger>

            <Select.Content>
              <Select.ScrollUpButton>☝️</Select.ScrollUpButton>

              <Select.Viewport minWidth={200}>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item value="apple" index={0}>
                    <Select.ItemText>Apple</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="banana" index={1}>
                    <Select.ItemText>Banana</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="blueberry" index={2}>
                    <Select.ItemText>Blueberry</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="berry" index={1}>
                    <Select.ItemText>Berry</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="strawberry" index={1}>
                    <Select.ItemText>Strawberry</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="kiwi" index={1}>
                    <Select.ItemText>Kiwi</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="grap" index={1}>
                    <Select.ItemText>Grap</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="orange" index={1}>
                    <Select.ItemText>Orange</Select.ItemText>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton>👇</Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </YStack>
      </div>
    </Tamagui.Provider>
  )
}
