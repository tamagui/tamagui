import {
  Ban,
  BellRing,
  Carrot,
  CircleUser,
  Flag,
  Image,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Trash,
  User,
  Video,
} from '../../icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Dimensions, FlatList, Keyboard, KeyboardAvoidingView } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Button,
  Circle,
  Form,
  Input,
  isWeb,
  ScrollView,
  styled,
  Text,
  Theme,
  useThemeName,
  View,
  XStack,
  type ThemeName,
  Avatar,
  Group,
} from 'tamagui'
import { Chip } from '../chips/components/chipsParts'
import { BubbleChat, type MessageItem } from './components/Chat/BubbleChat'
import { ChatContext } from './components/Chat/ChatContext'
import { ThemePicker } from './components/Chat/ThemePicker'
import { AnimatedView } from './components/AnimatedPrimitives'

const { height: mobileHeight } = Dimensions.get('window')

const height = isWeb ? 700 : mobileHeight

const AVATAR_1_URL = 'https://tamagui.dev/bento/images/wheel-list/wl_6.png'

const SPRING_CONFIG = {
  damping: 18,
  mass: 0.5,
  stiffness: 180,
}

const SafeAreaSpacer = () => (isWeb ? <View /> : <SafeAreaView />)

const Label = styled(Text, {
  fontWeight: '500',
  fontFamily: 'mono',
  textTransform: 'uppercase',
  fontSize: '2',
  color: 'color-9',
})

export const Chat = () => {
  const offset = useSharedValue(0)
  const [list, setList] = useState<MessageItem[]>(data)
  const themeName = useThemeName()
  const [theme, setTheme] = useState<ThemeName>()
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    const listener = Keyboard.addListener('keyboardWillShow', () => {
      offset.value = 0
    })
    return () => listener.remove()
  }, [])

  const animatedListViewStyle = useAnimatedStyle(() => {
    const hide = offset.value > height / 2
    return {
      opacity: withSpring(hide ? 0 : 1, SPRING_CONFIG),
      transform: [{ translateY: withSpring(hide ? 30 : 0, SPRING_CONFIG) }],
      flex: 1,
    }
  }, [offset])

  const onSend = (message: string) => {
    setList((prev) => [{ id: `${Date.now()}`, createdAt: Date.now(), message }, ...prev])

    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: 0, animated: true })
    }, 100)
  }

  return (
    <ChatContext.Provider value={{ theme, setTheme }}>
      <View theme={theme} height="100%" flex={1} flexBasis="auto">
        <View
          theme="accent"
          bg={themeName.includes('dark') ? 'white' : 'black'}
          flex={1}
          position="absolute"
          inset={0}
        />
        <KeyboardAvoidingView
          style={{ flex: 1, flexBasis: 'auto' }}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <Header offset={offset} />

          <GestureView offset={offset} />

          <AnimatedView
            bg="background"
            overflow="hidden"
            borderTopLeftRadius="8"
            borderTopRightRadius="8"
            flex={1}
            flexBasis="auto"
            borderCurve="circular"
          >
            <AnimatedView style={animatedListViewStyle}>
              <FlatList
                ref={listRef}
                inverted
                keyboardDismissMode="interactive"
                contentContainerStyle={{ padding: 24, gap: 16 }}
                showsVerticalScrollIndicator={false}
                data={list}
                scrollEventThrottle={16}
                renderItem={({ item }) => <BubbleChat item={item} />}
              />
            </AnimatedView>

            <BottomBar onSend={onSend} offset={offset} />
          </AnimatedView>
        </KeyboardAvoidingView>
      </View>
    </ChatContext.Provider>
  )
}

const BottomBar = ({
  onSend,
  offset,
}: {
  onSend: (message: string) => void
  offset: SharedValue<number>
}) => {
  const theme = useThemeName()

  const { handleSubmit, control } = useForm({
    defaultValues: {
      message: '',
    },
  })

  const onSubmit = (data: { message: string }) => {
    onSend(data.message)
  }

  return (
    <View>
      <Form>
        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, value } }) => {
            const submit = () => {
              handleSubmit(onSubmit)()
              onChange('')
            }

            return (
              <XStack items="center" gap="3" px="4" py="4">
                <Button size="sm" circular>
                  <Plus />
                </Button>
                <Input
                  rounded="10"
                  flex={1}
                  placeholder="Typing..."
                  onSubmitEditing={submit}
                  value={value}
                  onChangeText={onChange}
                  onFocus={() => (offset.value = 0)}
                />
                {value.trim().length > 0 ? (
                  <Button
                    theme={theme.includes('accent') ? 'blue' : theme}
                    style={{ transition: 'transform 200ms ease' }}
                    scale="1 enter:0.2 exit:0.2"
                    size="sm"
                    onPress={submit}
                    circular
                  >
                    <Send />
                  </Button>
                ) : (
                  <Button
                    style={{ transition: 'transform 200ms ease' }}
                    scale="1 enter:0.2 exit:0.2"
                    size="sm"
                    circular
                  >
                    <Smile />
                  </Button>
                )}
              </XStack>
            )
          }}
        />
      </Form>

      <SafeAreaSpacer />
    </View>
  )
}

const Header = ({ offset }: { offset: SharedValue<number> }) => {
  const style = useAnimatedStyle(
    () => ({
      height: withSpring(offset.value > 0 ? offset.value : 16, SPRING_CONFIG),
    }),
    [offset]
  )

  const profileStyle = useAnimatedStyle(
    () => ({
      opacity: withSpring(offset.value > height / 2 ? 0 : 1, SPRING_CONFIG),
      transform: [
        {
          translateY: withSpring(
            interpolate(
              offset.value,
              [0, height],
              [0, -HEADER_HEIGHT * 2],
              Extrapolation.CLAMP
            ),
            SPRING_CONFIG
          ),
        },
      ],
    }),
    [offset]
  )

  return (
    <AnimatedView
      overflow="hidden"
      borderBottomLeftRadius="8"
      borderBottomRightRadius="8"
      borderCurve="circular"
      bg="background"
      justify="center"
    >
      <SafeAreaSpacer />

      <AnimatedView style={profileStyle}>
        <XStack px="4" items="center" pt="4" gap="3">
          <Avatar circular size={AVATAR_SIZE} bg="red">
            <Avatar.Image src={AVATAR_1_URL} objectFit="cover" />
            <Avatar.Fallback />
          </Avatar>
          <View gap="1" flex={1}>
            <Text fontSize="4" fontWeight="bold">
              Jony Ive
            </Text>
            <Text theme="green" fontSize="3" color="color-9">
              online
            </Text>
          </View>

          <View position="relative">
            <Button size="sm" circular>
              <PhoneCall size={'1'} />
            </Button>
            <Circle
              z={1}
              position="absolute"
              height={10}
              width={10}
              t={0}
              r={0}
              bg="green"
            />
          </View>
        </XStack>
      </AnimatedView>
      <AnimatedView style={style}>
        <MenuView offset={offset} />
      </AnimatedView>
    </AnimatedView>
  )
}

const MenuView = ({ offset }: { offset: SharedValue<number> }) => {
  const style = useAnimatedStyle(() => {
    const hide = offset.value < height / 2
    return {
      flex: 1,
      opacity: withSpring(hide ? 0 : 1, SPRING_CONFIG),
      transform: [{ translateY: withSpring(hide ? 100 : 0, SPRING_CONFIG) }],
    }
  }, [offset])

  return (
    <AnimatedView style={style}>
      <ScrollView
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ py: '6' }}
        showsVerticalScrollIndicator={false}
      >
        <View gap="6">
          <View gap="3" items="center">
            <View
              theme="green"
              self="center"
              p="1"
              borderColor="color-9"
              borderWidth={2}
              rounded={1000}
              position="relative"
            >
              <Avatar circular size="8" bg="red">
                <Avatar.Image src={AVATAR_1_URL} objectFit="cover" />
                <Avatar.Fallback />
              </Avatar>
              <Circle
                position="absolute"
                bg="color-9"
                height={16}
                width={16}
                r={4}
                b={4}
                borderWidth={2}
                borderColor="background"
                z={1}
              />
            </View>
            <View gap="2" items="center">
              <Text text="center" fontSize="8" fontWeight="bold">
                Jony Ive
              </Text>
              <Chip circular theme="accent" size="xs">
                <Chip.Text fontFamily="mono">@jony_ive</Chip.Text>
              </Chip>
            </View>
          </View>

          <ButtonGroup />

          <OptionsMenuGroup />

          <View gap="2">
            <Label px="4">Appearance</Label>
            <ThemePicker />
          </View>

          <SettingMenuGroup />
        </View>
      </ScrollView>
    </AnimatedView>
  )
}

const OptionsMenuGroup = () => {
  return (
    <View px="4" gap="3">
      <Label>Options</Label>
      <Group rounded="6" borderCurve="circular">
        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Search />
            </Button.Icon>
            <Button.Text>Search Messages</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Image />
            </Button.Icon>
            <Button.Text>Media</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <CircleUser />
            </Button.Icon>
            <Button.Text>Nickname</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Carrot />
            </Button.Icon>
            <Button.Text>Icon</Button.Text>
          </Button>
        </Group.Item>
      </Group>
    </View>
  )
}

const SettingMenuGroup = () => {
  return (
    <View px="4" gap="3">
      <Label>Settings</Label>
      <Group rounded="6" borderCurve="circular">
        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <ShieldCheck />
            </Button.Icon>
            <Button.Text>end-to-end encryption</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Flag />
            </Button.Icon>
            <Button.Text>Report</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Ban />
            </Button.Icon>
            <Button.Text>Block User</Button.Text>
          </Button>
        </Group.Item>

        <Group.Item>
          <Button justify="flex-start">
            <Button.Icon scaleIcon={1.5}>
              <Trash color="red" />
            </Button.Icon>
            <Button.Text color="red">Delete Chat</Button.Text>
          </Button>
        </Group.Item>
      </Group>
    </View>
  )
}

const ButtonGroup = () => {
  return (
    <XStack items="center" gap="4" justify="center">
      <Theme name="green">
        <Button aspectRatio={1} circular>
          <Phone />
        </Button>
      </Theme>

      <Theme name="blue">
        <Button aspectRatio={1} circular>
          <Video />
        </Button>
      </Theme>

      <Button aspectRatio={1} circular>
        <BellRing />
      </Button>

      <Button aspectRatio={1} circular>
        <User />
      </Button>

      <Button aspectRatio={1} circular>
        <MoreHorizontal />
      </Button>
    </XStack>
  )
}

const AVATAR_SIZE = 48
const SPACE = 16
const HEADER_HEIGHT = 48 + SPACE * 2

Chat.displayName = 'Chat'
Chat.fileName = 'Chat'

const GestureView = ({ offset }: { offset: SharedValue<number> }) => {
  const isDragging = useRef(false)
  const startY = useRef(0)

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss()
  }, [])

  // Native
  const gesture = Gesture.Pan()
    .onChange(({ absoluteY }) => {
      offset.value = absoluteY - HEADER_HEIGHT
    })
    .onEnd(({ velocityY }) => {
      if ((offset.value / height) * 100 > 50 || velocityY > height) {
        // 70% of the height
        offset.value = (height * 70) / 100
      } else {
        offset.value = 0
      }
      runOnJS(dismissKeyboard)()
    })

  // Web
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startY.current = e.clientY
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return

    const deltaY = e.clientY - startY.current
    offset.value = deltaY
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false

    if (offset.value > height / 2) {
      offset.value = (height * 70) / 100
    } else {
      offset.value = 0
    }
  }

  useEffect(() => {
    if (isWeb) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [])

  const Handler = () => (
    <View>
      <View self="center" m="2" height={6} width="4" rounded="4" bg="background" />
    </View>
  )

  return isWeb ? (
    <View onMouseDown={handleMouseDown} style={{ cursor: 'grab' }}>
      {Handler()}
    </View>
  ) : (
    <GestureDetector gesture={gesture}>{Handler()}</GestureDetector>
  )
}

// user mock
const user = {
  id: '1',
  name: 'Jony Ive',
  avatar: AVATAR_1_URL,
}

const data: MessageItem[] = [
  {
    id: '11',
    createdAt: 1714210800,
    message: 'Perfect! Looking forward to it. 👍',
    user,
  },
  {
    id: '10',
    createdAt: 1714210200,
    message: "Sounds like a plan. Let's discuss it more in our next team meeting.",
  },
  {
    id: '9',
    createdAt: 1714209600,
    message: 'Absolutely! I think it would really speed up our development process.',
    user,
  },
  {
    id: '8',
    createdAt: 1714209000,
    message: "That's always helpful. Maybe we can use it in our next project?",
  },
  {
    id: '7',
    createdAt: 1714208400,
    message:
      'Pretty smooth actually. The docs are well-written and there are good examples.',
    user,
  },
  {
    id: '6',
    createdAt: 1714207800,
    message: "Nice! I'll definitely check it out. How's the learning curve?",
  },
  {
    id: '5',
    createdAt: 1714207200,
    message: 'Yeah, the new Accordion and Popover components look really useful!',
    user,
  },
  {
    id: '4',
    createdAt: 1714206600,
    message: "That sounds great! Any specific components you're excited about?",
  },
  {
    id: '3',
    createdAt: 1714206000,
    message: "They've added some cool new components and improved performance.",
    user,
  },
  {
    id: '2',
    createdAt: 1714205400,
    message: "Not yet! What's new in it?",
  },
  {
    id: '1',
    createdAt: 1714204800,
    message: 'Hey, have you seen the new Tamagui update?',
    user,
  },
]
