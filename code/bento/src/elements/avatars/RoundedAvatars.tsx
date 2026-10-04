import type { ComponentSize } from '@tamagui/core'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function RoundedAvatars() {
  return (
    <View
      flex={1}
      items="center"
      flexDirection="row"
      width="100%"
      maxW="@sm/window:400px"
      justify="center"
      gap="4"
    >
      <Item size="sm" />
      <Item size="md" />
      <Item size="lg" />
      <Item size="xl" />
    </View>
  )
}

RoundedAvatars.fileName = 'RoundedAvatars'

function Item({ size }: { size: ComponentSize }) {
  return (
    <Avatar size={size}>
      <Avatar.Content rounded="3">
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback bg="color-6" />
      </Avatar.Content>
    </Avatar>
  )
}
