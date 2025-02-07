import { Theme, useThemeWithState } from '@tamagui/web'
import { memo, useId, useState } from 'react'
import { Circle, Switch, Text, XStack, YStack } from 'tamagui'

export default function Sandbox() {
  const [name, setName] = useState('dark')

  return (
    <YStack gap="$2">
      <Theme name="blue">
        <Switch>
          <Switch.Thumb animation="quicker" />
        </Switch>
      </Theme>

      {/* <ThemeToggle /> */}

      {/* <Link href="/sandbox2">Go to sandbox2</Link> */}

      {/* <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>change</Button> */}

      {/* <Circles /> */}

      {/* <Theme name={name as any}>
        <Circles />
      </Theme> */}

      {/* <Theme inverse>
        <Circles />
      </Theme> */}
    </YStack>
  )
}

const Circles = memo(() => {
  console.warn('cirlcers', useId())

  return (
    <XStack bg="$color1">
      <Theme name="accent">
        <Circle size={100} bg="$color10">
          <Slow />
          <Fast />
        </Circle>
      </Theme>

      {/* <Theme name="red">
        <Circle size={100} bg="$color10" />
      </Theme> */}

      {/* <Theme name="surface3">
        <Circle size={100} bg="$borderColor" />
      </Theme> */}

      {/* <Theme name="surface2">
        <Circle size={100} bg="$borderColor" />
      </Theme> */}

      <Theme name="surface1">
        <Circle size={100} bg="$borderColor" />
      </Theme>

      <MemoTest />
    </XStack>
  )
})

const MemoTest = memo(() => <Circle debug="verbose" size={100} bg="$color" />)

const Slow = () => {
  const [theme, state] = useThemeWithState({ debug: true })

  console.log('theme.background.val', theme.background.val, state)

  return (
    <Circle size={50} bg={theme.background.val as any}>
      <Text>🐢</Text>
    </Circle>
  )
}

const Fast = () => {
  const [theme, state] = useThemeWithState({})

  console.log('theme.background.get()', theme.background.get(), state)

  return (
    <Circle size={50} bg={theme.background.get() as any}>
      <Text>🐰</Text>
    </Circle>
  )
}
