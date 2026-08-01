import React from 'react'
import { defaultConfig as config } from '@tamagui/config/v6'
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
    <YStack items="center" gap="4">
      <XStack gap="5">
        <Theme name={theme ?? null}>
          <Square rounded="8" bg="color" size={100} />
        </Theme>
      </XStack>

      <Button
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
