import React, { useState } from 'react'
import { Button, H3, Square, Theme, YStack, addTheme, updateTheme } from 'tamagui'

export function AddThemeDemo() {
  const [theme, setTheme] = useState<string>()

  return (
    <YStack ai="center" space>
      <H3>Theme: {theme ?? 'inherit'}</H3>

      {/* @ts-ignore */}
      <Theme name={theme ?? null}>
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
            } as any,
          })
          setTheme('superblue')
        }}
      >
        Add superblue theme
      </Button>
    </YStack>
  )
}
