import { styled, Theme, View } from '@tamagui/web'
import { useState } from 'react'
import { Button, Circle, XStack, YStack } from 'tamagui'

export default function Sandbox() {
  const [name, setName] = useState('dark')

  return (
    <YStack gap="$2">
      <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>change</Button>

      {/* <Circles /> */}

      {name}

      <Theme name={name as any}>
        <Circles />
      </Theme>
    </YStack>
  )
}

const Circles = () => {
  return (
    <XStack bg="$color1">
      <Theme name="accent">
        <Circle size={100} bg="$color10" />
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
}

const Test = styled(View, {
  width: 100,
  height: 100,
  backgroundColor: 'red',

  $md: {
    '$platform-web': {
      position: 'fixed',
      gridColumnGap: 12,
      backgroundColor: 'green',
    },
  },
})
