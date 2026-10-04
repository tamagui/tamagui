import type { ComponentSize } from '@tamagui/core'
import { Ban, SunDim } from '../../icons'
import type { ReactElement } from 'react'
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
      maxW="@sm/window:400px"
      gap="4"
    >
      <Item
        Icon={
          <Avatar.Icon>
            <Ban color="color-10" size="1" />
          </Avatar.Icon>
        }
        size="sm"
      />
      <Item
        Icon={
          <Avatar.Icon>
            <SunDim color="color-10" />
          </Avatar.Icon>
        }
        size="md"
      />
      <Item
        Icon={
          <Avatar.Icon bg="red-9">
            <Avatar.Text color="#fff" size="xs">
              9
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="xl"
      />
      <Item
        Icon={
          <Avatar.Icon bg="green-9">
            <Avatar.Text color="#fff" size="xs">
              3
            </Avatar.Text>
          </Avatar.Icon>
        }
        size="xl"
      />
    </View>
  )
}

function Item({ size, Icon }: { size: ComponentSize; Icon: ReactElement }) {
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
