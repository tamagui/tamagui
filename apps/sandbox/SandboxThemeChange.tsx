import { memo, useMemo, useState } from 'react'
import { Button, Square, Theme, YStack } from 'tamagui'

export function SandboxThemeChange() {
  return (
    <>
      <Inner>
        <Inner>
          <Inner />
        </Inner>
      </Inner>
    </>
  )
}

export function Inner(props: { children?: any }) {
  const [theme, setTheme] = useState('pink' as any)
  console.log('theme now', theme)

  return (
    <YStack ai="center" jc="center" gap="$5">
      <Button
        onPress={() => {
          setTheme(theme === 'pink' ? 'blue' : 'pink')
        }}
      >
        Change Theme
      </Button>

      {/* @ts-ignore */}
      <Theme name={theme}>
        <SandboxThemeChildStatic />
        <SandboxThemeChildDynamic />
        {props.children}
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = memo(() => {
  console.warn('redner static')
  // @ts-ignore
  return <Square debug="static" size={20} backgroundColor="$color10" />
})

const SandboxThemeChildDynamic = memo(() => {
  console.warn('redner dynamic')
  return (
    // @ts-ignore
    <Square debug="dynamic" animation="bouncy" size={20} backgroundColor="$color10" />
  )
})
