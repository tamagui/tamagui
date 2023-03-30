import { memo, useState } from 'react'
import { Button, Square, Theme, YStack } from 'tamagui'

export function SandboxThemeChange() {
  const [theme, setTheme] = useState('dark' as any)

  return (
    <YStack bc="red" fullscreen ai="center" jc="center" gap="$5">
      <Button
        onPress={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        Change Theme
      </Button>
      <Theme debug name={theme}>
        <SandboxThemeChildStatic />
        <SandboxThemeChildDynamic />
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = memo(() => {
  return <Square debug size={100} backgroundColor="$background" />
})

const SandboxThemeChildDynamic = memo(() => {
  return <Square debug animation="bouncy" size={100} backgroundColor="$background" />
})
