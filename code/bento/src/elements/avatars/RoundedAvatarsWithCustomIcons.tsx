import { Ban, Moon } from '../../icons'
import type { ReactElement } from 'react'
import type { SizeTokens } from 'tamagui'
import { Circle, View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */

export function RoundedAvatarsWithCustomIcons() {
  return (
    <View
      flex={1}
      items="center"
      flexDirection="row"
      width="100%"
      maxW="@gtXs/window:400px"
      justify="center"
      gap="4"
    >
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Ban color="color-10" />
          </Avatar.Icon>
        }
        size="4"
      />
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Moon color="color-10" />
          </Avatar.Icon>
        }
        size="5"
      />
      <Item
        Icon={
          <Avatar.Icon bg="yellow-500" placement="bottom-right" offset={5}>
            <Circle />
          </Avatar.Icon>
        }
        size="6"
      />
      <Item
        Icon={
          <Avatar.Icon bg="green-500" placement="bottom-right" offset={5}>
            <Circle>
              <Avatar.Text color="#fff" size="2">
                7
              </Avatar.Text>
            </Circle>
          </Avatar.Icon>
        }
        size="7"
      />
    </View>
  )
}

RoundedAvatarsWithCustomIcons.fileName = 'RoundedAvatarsWithCustomIcons'

function Item({ size, Icon }: { size: SizeTokens; Icon: ReactElement }) {
  return (
    <Avatar size={size} position="relative">
      {Icon}
      <Avatar.Content rounded="3">
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback bg="background" />
      </Avatar.Content>
    </Avatar>
  )
}
