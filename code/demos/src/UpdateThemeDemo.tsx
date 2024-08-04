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
  useForceUpdate,
  useIsomorphicLayoutEffect,
} from 'tamagui'

const colors = config.tokens.color
const colorKeys = Object.keys(colors)

export function UpdateThemeDemo() {
  const [theme, setTheme] = React.useState<any>()
  const update = useForceUpdate()

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
    <YStack alignItems="center" space>
      <XStack gap={'$5'}>
        <Theme name={theme ?? null}>
          <Square borderRadius="$8" size={100} backgroundColor="$color" />
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
          update()
        }}
      >
        Set to random color
      </Button>
    </YStack>
  )
}
