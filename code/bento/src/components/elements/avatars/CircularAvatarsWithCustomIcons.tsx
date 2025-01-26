import { Ban, SunDim } from '@tamagui/lucide-icons'
import type { ReactElement } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function CircularAvatarsWithCustomIcons() {
  return (
    <View
      flex={1}
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
      width="100%"
      $group-window-gtXs={{ maxWidth: 400 }}
      gap="$4"
    >
      <Item
        Icon={
          <Avatar.Icon>
            <Ban color="$color11" size="$1" />
          </Avatar.Icon>
        }
        size="$4"
      />
      <Item
        Icon={
          <Avatar.Icon>
            <SunDim color="$color11" />
          </Avatar.Icon>
        }
        size="$5"
      />
      <Item
        Icon={
          <Avatar.Icon backgroundColor="$red9">
            <Avatar.Text color="#fff" size="$2">
              9
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="$6"
      />
      <Item
        Icon={
          <Avatar.Icon backgroundColor="$green8">
            <Avatar.Text color="#fff" size="$3">
              3
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="$8"
      />
    </View>
  )
}

CircularAvatarsWithCustomIcons.fileName = 'CircularAvatarsWithCustomIcons'

function Item({ size, Icon }: { size: SizeTokens; Icon: ReactElement }) {
  return (
    <Avatar size={size}>
      {Icon}
      <Avatar.Content circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback backgroundColor="$background" />
      </Avatar.Content>
    </Avatar>
  )
}
