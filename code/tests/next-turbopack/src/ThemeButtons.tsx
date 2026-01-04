'use client'

import { Stack, Text, styled } from '@tamagui/core'
import { useThemeSetting } from '@tamagui/next-theme'

const XStack = styled(Stack, { flexDirection: 'row' })
const Button = styled(Stack, {
  tag: 'button',
  padding: '$3',
  backgroundColor: '$blue10',
  borderRadius: '$4',
  cursor: 'pointer',
  pressStyle: { opacity: 0.8 },
})

export function ThemeButtons() {
  const themeSetting = useThemeSetting()

  return (
    <>
      <XStack gap="$2">
        <Button onPress={() => themeSetting.set('light')}>
          <Text color="white">Light</Text>
        </Button>
        <Button onPress={() => themeSetting.set('dark')}>
          <Text color="white">Dark</Text>
        </Button>
        <Button onPress={() => themeSetting.set('system')}>
          <Text color="white">System</Text>
        </Button>
        <Button onPress={() => themeSetting.toggle?.()}>
          <Text color="white">Toggle Theme</Text>
        </Button>
      </XStack>
      <Text color="$color10">Current theme: {themeSetting.current}</Text>
    </>
  )
}
