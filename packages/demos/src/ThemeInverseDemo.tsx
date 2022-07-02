import { ThemeInverse } from '@tamagui/core'
import React from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

export function ThemeInverseDemo() {
  return (
    <XStack space>
      <Buttons />
      <ThemeInverse>
        <Buttons />
      </ThemeInverse>
    </XStack>
  )
}

function Buttons() {
  return (
    <YStack bc="$background" p="$3" br="$3" space>
      <Button>Dark</Button>
      <Button themeInverse>Inversed</Button>
      <Button theme="alt1">Alt1 Dark</Button>
      <Theme name="yellow">
        <Button>Yellow dark</Button>
      </Theme>
    </YStack>
  )
}
