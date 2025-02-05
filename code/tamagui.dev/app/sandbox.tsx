import { styled, Theme, View } from '@tamagui/web'
import { Circle, XStack } from 'tamagui'

export default function Sandbox() {
  return (
    <XStack gap="$2">
      <Circle size={100} bg="red" />

      <Theme name="accent">
        <Circle size={100} bg="$color1" />
      </Theme>

      <Theme name="red">
        <Circle size={100} bg="$color1" />
      </Theme>

      <Theme name="surface3">
        <Circle size={100} bg="$background" />
      </Theme>

      <Theme name="surface2">
        <Circle size={100} bg="$background" />
      </Theme>

      <Theme name="surface1">
        <Circle size={100} bg="$background" />
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
