import React from 'react'
import { Button, Card, Square, Theme, YStack, Text } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

export function ThemeChange() {
  return (
    <>
      <Inner level={0}>
        <Inner level={1}>
          <Card width={100} height={100} />
        </Inner>
      </Inner>
    </>
  )
}

export function Inner({
  children,
  level,
}: { children?: React.ReactNode; level: number }) {
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
      <Text id={`${TEST_IDS.themeInfo}-${level}`}>
        <Text fontWeight="bold">Inner</Text> {JSON.stringify({ theme })}
      </Text>

      <Button
        id={`${TEST_IDS.changeThemeButton}-${level}`}
        onPress={() => {
          cycleTheme()
        }}
      >
        Change Theme
      </Button>

      <Theme name={theme}>
        <SandboxThemeChildStatic level={level} />
        <SandboxThemeChildDynamic level={level} />
        <YStack gap="$2">
          <Button themeInverse>Inverse</Button>
          <Button>Normal</Button>
        </YStack>

        {children}
      </Theme>
    </YStack>
  )
}

const SandboxThemeChildStatic = React.memo(({ level }: { level: number }) => {
  return (
    <Square
      id={`${TEST_IDS.staticSquare}-${level}`}
      size={20}
      backgroundColor="$color10"
    />
  )
})

const SandboxThemeChildDynamic = React.memo(({ level }: { level: number }) => {
  return (
    <Square
      id={`${TEST_IDS.dynamicSquare}-${level}`}
      animation="bouncy"
      size={20}
      backgroundColor="$color10"
      animateOnly={['backgroundColor']}
    />
  )
})
