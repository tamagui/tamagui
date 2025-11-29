import React from 'react'
import { addTheme } from '@tamagui/theme'

import { Button, H3, Square, Theme, YStack } from 'tamagui'

export function AddThemeDemo() {
  const [theme, setTheme] = React.useState<any>()

  return (
    <YStack items="center" gap="$4">
      <H3>Theme: {theme ?? 'none'}</H3>

      <Theme name={theme ?? 'red'}>
        <Square rounded="$8" size={100} bg="$color" />
      </Theme>

      <Button
        disabled={theme === 'superblue'}
        onPress={() => {
          addTheme({
            name: 'superblue',
            insertCSS: true,
            theme: {
              background: '#000',
              color: 'blue',
            },
          })
          setTheme('superblue')
        }}
      >
        Add superblue theme
      </Button>
    </YStack>
  )
}
