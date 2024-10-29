import React from 'react'
import { Button, Card, Square, Theme, YStack, Text } from 'tamagui'

export function ThemeChange() {
  return (
    <>
      <Inner>
        <Inner>
          <Card width={100} height={100} />
        </Inner>
      </Inner>
    </>
  )
}

export function Inner({ children }: { children?: React.ReactNode }) {
  const themes = [
    'yellow',
    'blue',
    'orange',
    'green',
    'purple',
    'pink',
    'red',
    'gray',
  ] as const
  const [themeIndex, setThemeIndex] = React.useState(0)
  const theme = themes[themeIndex]

  const cycleTheme = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % themes.length)
  }

  return (
    <YStack
      borderWidth={1}
      borderColor="red"
      padding="$4"
      alignItems="center"
      justifyContent="center"
      gap="$5"
    >
      <Text>
        <Text fontWeight="bold">Inner</Text> {JSON.stringify({ theme })}
      </Text>

      <Button
        onPress={() => {
          // setTheme(theme === 'yellow' ? 'blue' : 'yellow')
          cycleTheme()
        }}
      >
        Change Theme
      </Button>

      <Theme name={theme}>
        <SandboxThemeChildStatic />
        <SandboxThemeChildDynamic />
        <YStack gap="$2">
          <Button themeInverse>Inverse</Button>
          <Button>Normal</Button>
        </YStack>

        {children}
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = React.memo(() => {
  return <Square size={20} backgroundColor="$color10" />
})

const SandboxThemeChildDynamic = React.memo(() => {
  return <Square animation="bouncy" size={20} backgroundColor="$color10" />
})
