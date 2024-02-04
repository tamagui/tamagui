import { memo, useMemo, useState } from 'react'
import { Button, Card, Square, Theme, YStack } from 'tamagui'

export function ThemeChange() {
  return <Button themeInverse>inverse</Button>

  return (
    <>
      <Inner>
        <Inner>
          <Card w={100} h={100} />
        </Inner>
      </Inner>
    </>
  )
}

export function Inner(props: { children?: any }) {
  const [theme, setTheme] = useState('yellow' as any)

  return (
    <YStack bw={1} bc="red" p="$4" ai="center" jc="center" gap="$5">
      <pre>
        <code>
          <b>Inner</b>{' '}
          {JSON.stringify({
            theme,
          })}
        </code>
      </pre>

      <Button
        onPress={() => {
          setTheme(theme === 'yellow' ? 'blue' : 'yellow')
        }}
      >
        Change Theme
      </Button>

      {/* @ts-ignore */}
      <Theme name={theme}>
        <SandboxThemeChildStatic />
        <SandboxThemeChildDynamic />

        <Button themeInverse>inverse</Button>

        {props.children}
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = memo(() => {
  // @ts-ignore
  return <Square size={20} backgroundColor="$color10" />
})

const SandboxThemeChildDynamic = memo(() => {
  return (
    // @ts-ignore
    <Square animation="bouncy" size={20} backgroundColor="$color10" />
  )
})
