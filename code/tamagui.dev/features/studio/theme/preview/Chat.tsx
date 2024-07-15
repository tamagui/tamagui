import { Info, Send } from '@tamagui/lucide-icons'
import React, { memo, useState } from 'react'
import {
  Avatar,
  Button,
  Form,
  H4,
  Input,
  Paragraph,
  ScrollView,
  XStack,
  YStack,
} from 'tamagui'
import { AccentTheme } from '../../components/AccentTheme'
import { useDemoProps } from '../hooks/useDemoProps'

const initialMessages = [
  {
    id: 1,
    userId: 1,
    content: 'Hey guys',
    createdAt: new Date(2023, 1, 1, 0, 0, 0),
  },
  {
    id: 2,
    userId: 1,
    content: 'Any updates?',
    createdAt: new Date(2023, 1, 1, 0, 0, 1),
  },
  {
    id: 3,
    userId: 2,
    content: 'Nostrud in cillum...',
    createdAt: new Date(2023, 1, 1, 0, 0, 2),
  },
  {
    id: 4,
    userId: 3,
    content: 'Magna cillum consectetur',
    createdAt: new Date(2023, 1, 1, 0, 0, 3),
  },
  {
    id: 5,
    userId: 3,
    content: 'adipisicing amet officia.',
    createdAt: new Date(2023, 1, 1, 0, 0, 3),
  },
  {
    id: 6,
    userId: 1,
    content: 'Is that latin?',
    createdAt: new Date(2023, 1, 1, 0, 0, 4),
  },
  {
    id: 7,
    userId: 2,
    content: 'Exercitation!',
    createdAt: new Date(2023, 1, 1, 0, 0, 5),
  },
  {
    id: 8,
    userId: 1,
    content: 'What?',
    createdAt: new Date(2023, 1, 1, 0, 0, 6),
  },
  {
    id: 9,
    userId: 3,
    content: 'Esse irure laboris deserunt.',
    createdAt: new Date(2023, 1, 1, 0, 0, 7),
  },
  {
    id: 10,
    userId: 2,
    content: 'Lorem ipsum',
    createdAt: new Date(2023, 1, 1, 0, 0, 10),
  },
  {
    id: 11,
    userId: 3,
    content: '+1',
    createdAt: new Date(2023, 1, 1, 0, 0, 11),
  },
  {
    id: 12,
    userId: 3,
    content: 'Magna anim occaecat...',
    createdAt: new Date(2023, 1, 1, 0, 0, 11),
  },
]

export const ChatScreen = () => {
  const [messages, setMessages] = useState(initialMessages)
  const authUserId = 1

  const [input, setInput] = useState('')

  function sendMessage(content: string) {
    if (!content) return
    setMessages([
      ...messages,
      {
        content,
        id: messages[messages.length - 1].id + 1,
        createdAt: new Date(),
        userId: authUserId,
      },
    ])
    setInput('')
  }
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4">
        <XStack jc="space-between">
          <YStack>
            <H4 {...demoProps.headingFontFamilyProps}>Group Chat</H4>
            <Paragraph {...demoProps.panelDescriptionProps}>
              3 online &mdash; 5 members
            </Paragraph>
          </YStack>
          <Button
            color="$color9"
            als="center"
            chromeless
            size="$5"
            scaleIcon={1.4}
            circular
            icon={Info}
          />
        </XStack>
      </YStack>

      <YStack flex={1}>
        <ScrollView m="$-4" p="$6">
          <YStack {...demoProps.gapPropsMd}>
            {messages.map((message, idx) => {
              const isLastFromUser =
                idx === messages.length - 1 || messages[idx + 1].userId !== message.userId
              return (
                <React.Fragment key={message.id}>
                  <ChatMessage
                    message={message.content}
                    isUser={authUserId === message.userId}
                    avatarSrc={`https://i.pravatar.cc/300?u=tamagui-user-${message.userId}`}
                    includeAvatar={isLastFromUser}
                  />
                  {/* this is nice to separate diff groups but commenting out for now: */}
                  {/* {isLastFromUser && <Spacer size="$1" />} */}
                </React.Fragment>
              )
            })}
          </YStack>
        </ScrollView>
      </YStack>

      <YStack mt="$4">
        <Form flexDirection="row" onSubmit={() => sendMessage(input)} gap="$2">
          <Input
            value={input}
            onChangeText={setInput}
            placeholder="Enter your message..."
            f={1}
            backgroundColor="transparent"
            {...demoProps.borderRadiusProps}
          />
          <AccentTheme>
            <Form.Trigger asChild>
              <Button
                {...demoProps.borderRadiusProps}
                {...demoProps.buttonOutlineProps}
                scaleIcon={1.4}
                icon={Send}
              />
            </Form.Trigger>
          </AccentTheme>
        </Form>
      </YStack>
    </YStack>
  )
}

const ChatMessage = memo(
  ({
    message,
    isUser,
    avatarSrc,
    includeAvatar,
  }: {
    message: string
    isUser?: boolean
    avatarSrc?: string
    includeAvatar?: boolean
  }) => {
    const demoProps = useDemoProps()

    let contents = (
      <YStack
        px="$2.5"
        py="$2"
        {...demoProps.borderRadiusProps}
        {...(isUser ? demoProps.chatFrameActiveProps : demoProps.chatFrameProps)}
      >
        <Paragraph
          lh="$2"
          maxWidth={200}
          {...(isUser ? demoProps.chatTextActiveProps : demoProps.chatTextProps)}
        >
          {message}
        </Paragraph>
      </YStack>
    )

    if (isUser) {
      contents = <AccentTheme>{contents}</AccentTheme>
    }

    return (
      <XStack
        als={isUser ? 'flex-end' : 'flex-start'}
        flexDirection={isUser ? 'row-reverse' : 'row'}
        gap="$2"
      >
        {includeAvatar ? (
          <Avatar size="$2" mt="$1" {...demoProps.borderRadiusProps}>
            <Avatar.Image src={avatarSrc} />
          </Avatar>
        ) : (
          <YStack width="$2" />
        )}
        <XStack ai="flex-end" mb="$1">
          {contents}
        </XStack>
      </XStack>
    )
  }
)
