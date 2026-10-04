import { Avatar } from '../../BentoSkins'
import { randRecentDate, randSentence } from '@ngneat/falso'
import { Check } from '../../icons'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { AnimatePresence, Button, Text, Theme, View, styled } from 'tamagui'

const List = styled(FlatList<Message>, {
  bg: 'background',
  gap: '3',
})

const avatars = [
  'https://images.unsplash.com/photo-1588798204072-e5f8e649d269?&w=100',
  'https://images.unsplash.com/photo-1736754079614-8b43bcba9926?&w=100',
]

const getMessages = () =>
  Array.from({ length: 50 })
    .fill(0)
    .map((_, i) => ({
      message: randSentence(),
      time: randRecentDate().toLocaleTimeString(),
      itsMe: i % 2 === 0,
      avatar: avatars[i % 2],
    }))

type Message = ReturnType<typeof getMessages>[0]

const renderItem = ({
  item: message,
  index,
}: {
  item: Message
  index: number
}) => {
  return <ChatItem index={index + 1} key={message.time} item={message} />
}

export function ChatList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    setMessages(getMessages())
  }, [])

  return (
    <List
      p="@gtXs/window:8 @sm/window:4"
      flexDirection="column"
      height="100%"
      flex={1}
      minW="100%"
      maxH={500}
      inverted
      data={messages}
      renderItem={renderItem}
      windowSize={2}
      contentContainerStyle={{
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}

ChatList.fileName = 'ChatList'

function ChatItem({ item, index }: { item: Message; index: number }) {
  const { message, time, avatar, itsMe } = item
  const [showMessage, setShowMessage] = useState(false)
  const showDelay = index * 300
  const [start, setStart] = useState(false)

  useEffect(() => {
    // run animations after initial render calms down
    ;(globalThis.requestIdleCallback || setTimeout)(() => {
      setStart(true)
    })
  }, [])

  useEffect(() => {
    if (!start) return
    const timeout = setTimeout(() => {
      setShowMessage((prev) => !prev)
    }, showDelay)
    return () => clearTimeout(timeout)
  }, [start, showDelay])

  return (
    <AnimatePresence>
      {showMessage && (
        <View
          flexDirection={itsMe ? 'row-reverse' : 'row'}
          items="flex-start"
          gap="4"
          self={itsMe ? 'flex-end' : 'flex-start'}
          maxW="100%"
          minW="100%"
        >
          <Button
            transition="quick"
            opacity="enter:0"
            scale="enter:0"
            size="lg"
            circular
            variant="quiet"
          >
            <View flexDirection="row">
              <Avatar circular size="5">
                <Avatar.Image objectFit="cover" src={avatar} />
                <Avatar.Fallback bg="background" />
              </Avatar>
            </View>
          </Button>
          <View
            flexDirection="column"
            items={itsMe ? 'flex-end' : 'flex-start'}
            gap="2"
            maxW={400}
            justify="center"
            shrink={1}
          >
            <Theme name={itsMe ? 'green' : undefined}>
              <View
                bg="color-2"
                paddingRight="4"
                paddingLeft="4"
                py="3"
                rounded="6"
                shrink={1}
              >
                <Text fontSize="3" fontWeight="3" lineHeight="3" shrink={1} select="text">
                  {message}
                </Text>
              </View>
            </Theme>
            <View flexDirection={itsMe ? 'row' : 'row-reverse'} gap="2">
              <Text color="color-6" fontSize="3" fontWeight="3" lineHeight="3">
                {time}
              </Text>
              <Check size={16} color="green" />
            </View>
          </View>
        </View>
      )}
    </AnimatePresence>
  )
}
