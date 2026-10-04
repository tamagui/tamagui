import { Pressable } from 'react-native'
import { Image, Text, useThemeName, View } from 'tamagui'
import { tone } from '../../../../tone'

type User = {
  id: string
  name: string
  avatar: string
  status?: string
  new?: boolean
}

export type MessageItem = {
  id: string
  message?: string
  createdAt: number
  user?: User
  seen?: boolean
  sticker?: string
}

type BubbleProps = {
  item: MessageItem
}

export const BubbleChat = (props: BubbleProps) => {
  const { item } = props

  const received = !!item.user
  const theme = useThemeName()

  return (
    <Pressable {...props}>
      <View
        theme={
          theme.includes('level2') || theme === 'light' || theme === 'dark'
            ? 'blue'
            : theme
        }
        self={received ? 'flex-start' : 'flex-end'}
        backgroundColor={received ? tone.fill : 'color-9'}
        rounded="7"
        borderCurve="continuous"
        p="3"
        maxW="80%"
      >
        {item.sticker ? (
          <Image src={item.sticker} />
        ) : (
          <Text fontFamily="body" fontSize="sm" color={received ? 'color-12' : 'white'}>
            {item.message}
          </Text>
        )}
      </View>
    </Pressable>
  )
}
