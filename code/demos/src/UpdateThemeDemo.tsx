import React from 'react'
import { config } from '@tamagui/config/v3'
import { addTheme, updateTheme } from '@tamagui/theme'

import {
  Button,
  Square,
  Theme,
  XStack,
  YStack,
  getVariableValue,
  useIsomorphicLayoutEffect,
} from 'tamagui'

const colors = config.tokens.color
const colorKeys = Object.keys(colors)

export function UpdateThemeDemo() {
  const [theme, setTheme] = React.useState<any>()

  useIsomorphicLayoutEffect(() => {
    addTheme({
      name: 'custom',
      insertCSS: true,
      theme: {
        color: 'red',
      },
    })
    setTheme('custom')
  }, [])

  return (
    <YStack items="center" gap="$4">
      <XStack gap={'$5'}>
        <Theme name={theme ?? null}>
          <Square rounded="$8" size={100} bg="$color" />
        </Theme>
      </XStack>

      <Button
        theme="surface3"
        onPress={() => {
          const randomColor = getVariableValue(
            colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]]
          )
          updateTheme({
            name: 'custom',
            theme: {
              color: randomColor,
            },
          })
        }}
      >
        Set to random color
      </Button>
    </YStack>
  )
}
