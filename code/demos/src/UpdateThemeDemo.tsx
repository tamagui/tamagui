import React from 'react'
import { addTheme, updateTheme } from '@tamagui/theme'

import {
  Button,
  Square,
  Theme,
  XStack,
  YStack,
  getTokens,
  getVariableValue,
  useIsomorphicLayoutEffect,
} from 'tamagui'

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
          // read the app's own palette rather than importing a config: pulling in
          // @tamagui/config/v3 here dragged the legacy color graph into every
          // consumer of this demo
          const colors = getTokens().color
          const colorKeys = Object.keys(colors)
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
