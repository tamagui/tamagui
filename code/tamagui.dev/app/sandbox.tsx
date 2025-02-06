import { Theme, useTheme, useThemeName } from '@tamagui/web'
import { memo, useId, useState } from 'react'
import { Button, Circle, XStack, YStack } from 'tamagui'
import { ThemeToggle } from '../features/site/theme/ThemeToggle'

export default function Sandbox() {
  const [name, setName] = useState('dark')

  return (
    <YStack gap="$2">
      <ThemeToggle />

      <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>change</Button>

      {/* <Circles /> */}

      <Theme debug="visualize" name={name as any}>
        <Circles />
      </Theme>
    </YStack>
  )
}

const Circles = memo(() => {
  return (
    <XStack bg="$color1">
      <Theme debug="visualize" name="accent">
        <Circle size={100} bg="$color10">
          <Nothing />
        </Circle>
      </Theme>

      <Theme name="red">
        <Circle size={100} bg="$color10" />
      </Theme>

      <Theme name="surface3">
        <Circle size={100} bg="$borderColor" />
      </Theme>

      <Theme name="surface2">
        <Circle size={100} bg="$borderColor" />
      </Theme>

      <Theme name="surface1">
        <Circle size={100} bg="$borderColor" />
      </Theme>
    </XStack>
  )
})

const Nothing = () => {
  const theme = useTheme({ debug: true })
  const name = useThemeName()

  console.log('theme.background.val', name, theme.background.val)

  return <Circle size={50} bg={theme.background.val as any} />
}
