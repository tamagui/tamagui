import { Ban, Moon } from '@tamagui/lucide-icons'
import type { ReactElement } from 'react'
import type { SizeTokens } from 'tamagui'
import { Circle, View } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */

// <Avatar.Badge top="$-1.5" right="$-1.5">
export function RoundedAvatarsWithCustomIcons() {
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
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Ban color="$color11" />
          </Avatar.Icon>
        }
        size="$4"
      />
      <Item
        Icon={
          <Avatar.Icon placement="bottom-right" offset={5}>
            <Moon color="$color11" />
          </Avatar.Icon>
        }
        size="$5"
      />
      <Item
        Icon={
          <Avatar.Icon backgroundColor="$blue8" placement="bottom-right" offset={5}>
            <Circle />
          </Avatar.Icon>
        }
        size="$6"
      />
      <Item
        Icon={
          <Avatar.Icon backgroundColor="$green8" placement="bottom-right" offset={5}>
            <Circle>
              <Avatar.Text color="#fff" size="$3">
                7
              </Avatar.Text>
            </Circle>
          </Avatar.Icon>
        }
        size="$7"
      />
    </View>
  )
}

RoundedAvatarsWithCustomIcons.fileName = 'RoundedAvatarsWithCustomIcons'

function Item({ size, Icon }: { size: SizeTokens; Icon: ReactElement }) {
  return (
    <Avatar size={size}>
      {Icon}
      <Avatar.Content borderRadius="$3">
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback backgroundColor="$background" />
      </Avatar.Content>
    </Avatar>
  )
}
