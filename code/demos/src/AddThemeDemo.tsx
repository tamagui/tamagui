import { addTheme } from '@tamagui/theme'
import React from 'react'

import { Button, H3, Theme, View, YStack } from 'tamagui'

export function AddThemeDemo() {
  const [theme, setTheme] = React.useState<any>()

  return (
    <YStack items="center" gap="$4">
      <H3>Theme: {theme ?? 'none'}</H3>

      <Theme name={theme ?? 'red'}>
        <View rounded="$8" width={100} height={100} bg="$color" />
      </Theme>

      <Button
        theme="surface3"
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
