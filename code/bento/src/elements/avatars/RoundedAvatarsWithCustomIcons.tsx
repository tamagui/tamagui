import type { ComponentSize } from '@tamagui/core'
import { Ban, Moon } from '../../icons'
import type { ReactElement } from 'react'
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
      maxW="@sm/window:400px"
      justify="center"
      gap="4"
    >
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Ban color="color-10" />
          </Avatar.Icon>
        }
        size="sm"
      />
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Moon color="color-10" />
          </Avatar.Icon>
        }
        size="md"
      />
      <Item
        Icon={
          <Avatar.Icon bg="yellow-9" placement="bottom-right" offset={5}>
            <Circle />
          </Avatar.Icon>
        }
        size="lg"
      />
      <Item
        Icon={
          <Avatar.Icon bg="green-9" placement="bottom-right" offset={5}>
            <Circle>
              <Avatar.Text color="#fff" size="xs">
                7
              </Avatar.Text>
            </Circle>
          </Avatar.Icon>
        }
        size="xl"
      />
    </View>
  )
}

RoundedAvatarsWithCustomIcons.fileName = 'RoundedAvatarsWithCustomIcons'

function Item({ size, Icon }: { size: ComponentSize; Icon: ReactElement }) {
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
