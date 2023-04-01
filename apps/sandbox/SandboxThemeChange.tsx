import { memo, useMemo, useState } from 'react'
import { Button, Square, Theme, YStack } from 'tamagui'

export function SandboxThemeChange() {
  const [theme, setTheme] = useState('pink' as any)

  console.warn(`🖤 render --theme ${theme}`)

  return (
    <YStack fullscreen ai="center" jc="center" gap="$5">
      <Button
        onPress={() => {
          setTheme(theme === 'pink' ? 'blue' : 'pink')
        }}
      >
        Change Theme
      </Button>
      <Theme debug="THEME" name={theme}>
        <SandboxThemeChildStatic />
        <SandboxThemeChildDynamic />
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = memo(() => {
  return <Square debug="static" size={100} backgroundColor="$color10" />
})

const SandboxThemeChildDynamic = memo(() => {
  return (
    <Square debug="dynamic" animation="bouncy" size={100} backgroundColor="$color10" />
  )
})
