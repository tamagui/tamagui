import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function CircularAvatars() {
  return (
    <View flexDirection="row" maxWidth="100%" flexWrap="wrap" gap="$10">
      <Item size="$4" />
      <Item size="$5" />
      <Item size="$6" />
      <Item size="$7" />
    </View>
  )
}

function Item({ size }: { size: SizeTokens }) {
  return (
    <Avatar size={size}>
      <Avatar.Content circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback backgroundColor="$background" />
      </Avatar.Content>
    </Avatar>
  )
}

CircularAvatars.fileName = 'CircularAvatars'
