import { useState } from 'react'
import { Button, H3, Square, Theme, YStack, addTheme } from 'tamagui'

export function AddThemeDemo() {
  const [theme, setTheme] = useState<any>()

  return (
    <YStack ai="center" space>
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
