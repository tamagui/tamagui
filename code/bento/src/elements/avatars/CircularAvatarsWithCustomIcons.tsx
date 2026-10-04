import { Ban, SunDim } from '../../icons'
import type { ReactElement } from 'react'
import type { SizeTokens } from 'tamagui'
import { View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function CircularAvatarsWithCustomIcons() {
  return (
    <View
      flex={1}
      items="center"
      justify="center"
      flexDirection="row"
      width="100%"
      maxW="@gtXs/window:400px"
      gap="4"
    >
      <Item
        Icon={
          <Avatar.Icon>
            <Ban color="color-10" size="1" />
          </Avatar.Icon>
        }
        size="4"
      />
      <Item
        Icon={
          <Avatar.Icon>
            <SunDim color="color-10" />
          </Avatar.Icon>
        }
        size="5"
      />
      <Item
        Icon={
          <Avatar.Icon bg="red-500">
            <Avatar.Text color="#fff" size="2">
              9
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="7"
      />
      <Item
        Icon={
          <Avatar.Icon bg="green-500">
            <Avatar.Text color="#fff" size="3">
              3
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="8"
      />
    </View>
  )
}

CircularAvatarsWithCustomIcons.fileName = 'CircularAvatarsWithCustomIcons'

function Item({ size, Icon }: { size: SizeTokens; Icon: ReactElement }) {
  return (
    <Avatar size={size} position="relative">
      {Icon}
      <Avatar.Content circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback bg="background" />
      </Avatar.Content>
    </Avatar>
  )
}
