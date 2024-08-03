import React from 'react'
import { addTheme } from '@tamagui/theme'

import { Button, H3, Square, Theme, YStack } from 'tamagui'

export function AddThemeDemo() {
  const [theme, setTheme] = React.useState<any>()

  return (
    <YStack alignItems="center" space>
      <H3>Theme: {theme ?? 'none'}</H3>

      <Theme name={theme ?? 'red'}>
        <Square borderRadius="$8" size={100} backgroundColor="$color" />
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
