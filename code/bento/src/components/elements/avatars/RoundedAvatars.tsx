import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function RoundedAvatars() {
  return (
    <View
      flex={1}
      alignItems="center"
      flexDirection="row"
      width="100%"
      $group-window-gtXs={{ maxWidth: 400 }}
      justifyContent="center"
      gap="$4"
    >
      <Item size="$4" />
      <Item size="$5" />
      <Item size="$6" />
      <Item size="$7" />
    </View>
  )
}

RoundedAvatars.fileName = 'RoundedAvatars'

function Item({ size }: { size: SizeTokens }) {
  return (
    <Avatar size={size}>
      <Avatar.Content borderRadius="$3">
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback backgroundColor="$gray6" />
      </Avatar.Content>
    </Avatar>
  )
}
