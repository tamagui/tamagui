import { memo, useMemo, useState } from 'react'
import { Button, Square, Theme, YStack } from 'tamagui'

export function SandboxThemeChange() {
  const [theme, setTheme] = useState('pink' as any)

  console.warn(`🖤 render`)

  return (
    <YStack fullscreen ai="center" jc="center" gap="$5">
      <Button
        onPress={() => {
          setTheme(theme === 'pink' ? 'blue' : 'pink')
        }}
      >
        Change Theme
      </Button>
      <Theme name={theme}>
        {useMemo(
          () => (
            <>
              {/* <SandboxThemeChildStatic /> */}
              <SandboxThemeChildDynamic />
            </>
          ),
          []
        )}
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = memo(() => {
  return <Square debug size={100} backgroundColor="$color10" />
})

const SandboxThemeChildDynamic = memo(() => {
  return (
    <Square debug="verbose" animation="bouncy" size={100} backgroundColor="$color10" />
  )
})
