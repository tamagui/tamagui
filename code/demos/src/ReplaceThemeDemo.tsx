import React from 'react'
import { addTheme, replaceTheme } from '@tamagui/theme'

import {
  Button,
  Square,
  Theme,
  XStack,
  YStack,
  useForceUpdate,
  useIsomorphicLayoutEffect,
} from 'tamagui'

export function ReplaceThemeDemo() {
  const [theme, setTheme] = React.useState<any>()
  const update = useForceUpdate()

  useIsomorphicLayoutEffect(() => {
    addTheme({
      name: 'mytheme',
      insertCSS: true,
      theme: {
        color: 'red',
        color2: 'green',
      },
    })
    setTheme('mytheme')
  }, [])

  return (
    <YStack items="center" gap="$4">
      <XStack gap="$5">
        <Theme name={theme ?? null}>
          <Square rounded="$8" size={100} bg="$color" />
        </Theme>
      </XStack>

      <Button
        theme="surface3"
        onPress={() => {
          replaceTheme({
            name: 'mytheme',
            theme: {
              color: 'blue',
            },
          })
          update()
        }}
      >
        Replace theme to only have $color: blue
      </Button>
    </YStack>
  )
}
