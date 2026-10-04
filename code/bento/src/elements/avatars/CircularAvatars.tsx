import type { ComponentSize } from '@tamagui/core'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function CircularAvatars() {
  return (
    <View flexDirection="row" maxW="100%" flexWrap="wrap" gap="10">
      <Item size="sm" />
      <Item size="md" />
      <Item size="lg" />
      <Item size="xl" />
    </View>
  )
}

function Item({ size }: { size: ComponentSize }) {
  return (
    <Avatar size={size}>
      <Avatar.Content circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback bg="background" />
      </Avatar.Content>
    </Avatar>
  )
}

CircularAvatars.fileName = 'CircularAvatars'
