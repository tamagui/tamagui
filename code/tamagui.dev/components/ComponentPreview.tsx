import {
  Check,
  CheckCircle2,
  Laptop2,
  Mail,
  Share,
  ShoppingCart,
  Upload,
  User,
} from '@tamagui/lucide-icons'

import {
  Avatar,
  Button,
  Checkbox,
  getTokenValue,
  Label,
  RadioGroup,
  styled,
  Switch,
  View,
  XStack,
  ZStack,
} from 'tamagui'
import { CardFrame, Text, YStack } from 'tamagui'
import { BentoIcon } from '~/features/icons/BentoIcon'

const Chip = styled(View, {
  name: 'Chip',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 1000_000_000,
  gap: '$2',
  py: '$2',
  px: '$3',
})

const WindowMacView = () => {
  return (
    <XStack
      bg="$backgroundPress"
      borderBottomWidth={1}
      borderColor="$borderColor"
      $theme-light={{
        borderColor: '$gray6',
      }}
      p="$2"
      gap="$2"
    >
      {['$red10', '$yellow10', '$green10'].map((color, index) => (
        <View bg={color as any} h={6} w={6} borderRadius={1_000_000_000} key={index} />
      ))}
      <View flex={1} />
    </XStack>
  )
}

const WindowLayout = ({ children, ...props }) => {
  return (
    <YStack h="100%" w="100%" justifyContent="flex-start" alignItems="center" {...props}>
      <YStack
        w="100%"
        h={200}
        bg="$background"
        borderRadius="$4"
        overflow="hidden"
        borderWidth={1}
        borderColor={'$borderColor'}
        $theme-light={{
          borderColor: '$gray6',
          bg: '$gray3',
        }}
      >
        <WindowMacView />
        {children}
      </YStack>
    </YStack>
  )
}

const CardItem = ({ title, children }) => {
  return (
    <CardFrame
      flexDirection="row"
      flexShrink={1}
      alignItems="flex-start"
      gap="$3"
      minWidth="100%"
      padding="$2.5"
      hoverStyle={{
        borderColor: '$color7',
      }}
    >
      {children}

      <Label
        cursor="pointer"
        alignItems="flex-start"
        lineHeight="$2"
        flexDirection="column"
      >
        {title}
      </Label>
    </CardFrame>
  )
}

const ComponentPreview = {
  Inputs: () => (
    <YStack minWidth="100%">
      <Label mt={0} mb={0}>
        Full Name
      </Label>
      <View
        bg="$background"
        bw={1}
        borderColor="$borderColor"
        p="$2"
        px="$3"
        borderRadius="$4"
      >
        <Text color="$gray7">Bento 🍱</Text>
      </View>
    </YStack>
  ),

  Layouts: () => {
    return (
      <WindowLayout>
        <YStack gap="$4" overflow="hidden" w="100%" bg="$background" p="$4">
          <Text fontSize={'$1'} textAlign="center" fontWeight="bold">
            Sign Up
          </Text>
          <XStack gap="$4" w="100%" justifyContent="space-between">
            <View flex={1} h={20} bg="$gray4" borderRadius="$2" />
            <View flex={1} h={20} bg="$gray4" borderRadius="$2" />
          </XStack>
          <View w="100%" h={20} bg="$gray4" borderRadius="$2" />
          <View w="100%" h={'100%'} bg="$gray4" borderRadius="$2" />
        </YStack>
      </WindowLayout>
    )
  },

  Checkboxes: () => {
    return (
      <YStack w="100%" gap="$3">
        <CardItem title="PayPal">
          <Checkbox checked={true}>
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        </CardItem>
        <CardItem title="Visa">
          <Checkbox>
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        </CardItem>
      </YStack>
    )
  },

  RadioGroups: () => {
    return (
      <YStack w="100%">
        <RadioGroup defaultValue="2" gap="$3">
          <CardItem title="PayPal">
            <RadioGroup.Item value={'1'}>
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </CardItem>
          <CardItem title="Visa">
            <RadioGroup.Item value={'2'}>
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </CardItem>
        </RadioGroup>
      </YStack>
    )
  },

  Switches: () => {
    return (
      <YStack
        flexDirection="row"
        maxWidth="100%"
        borderColor="$borderColor"
        $theme-light={{
          borderColor: '$gray6',
        }}
        borderWidth={1}
        paddingHorizontal="$4"
        paddingVertical="$3"
        $group-window-sm={{ marginTop: '$6', marginHorizontal: '$5' }}
        borderRadius="$3"
        width={'100%'}
        height="auto"
        alignItems="center"
        gap="$2.5"
        theme="surface1"
        animation="medium"
      >
        <Label size="$1.5" htmlFor={'switch'}>
          Switch
        </Label>

        <Switch
          id={'switch'}
          checked={true}
          onCheckedChange={() => {}}
          marginLeft="auto"
          bg="$green10"
          // Note: replace the following code with "$2" only
          size={'$2'}
          scale={1}
        >
          <Switch.Thumb borderColor="$color1" bg="$white1" animation="200ms" />
        </Switch>
      </YStack>
    )
  },

  TextAreas: () => {
    return (
      <View
        width="100%"
        $group-window-sm={{
          marginVertical: '$6',
        }}
        backgroundColor="$background04"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$4"
        ov={'hidden'}
      >
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="$2"
          bg="$background"
        >
          <Text fontWeight="bold" p="$2" fontSize={12} bg="$backgroundFocus">
            Write
          </Text>
          <Text fontWeight="300" p="$2" fontSize={12}>
            Preview
          </Text>
        </View>

        <View paddingHorizontal={0} borderRadius={0} p="$4">
          <Text fontWeight="300" fontSize={12}>
            Your comment here
          </Text>
        </View>
      </View>
    )
  },

  'Image Pickers': () => {
    return (
      <View
        width="100%"
        borderWidth={1.5}
        borderStyle="dashed"
        borderColor="$gray6"
        py="$5"
        justifyContent="center"
        alignItems="center"
        br="$4"
      >
        <Upload size="$1" />
      </View>
    )
  },

  List: () => {
    return (
      <WindowLayout>
        <YStack bg="$background" ov="hidden" p="$4" width="100%" mb="$-8" gap="$4">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <View flexDirection="row" alignItems="center" key={index} gap="$2">
                <User color="$gray8" />

                <View gap="$2" flex={1}>
                  <View height={4} bg={'$gray8'} width="80%" />
                  <View height={4} bg={'$gray8'} width="45%" />
                  <View />
                </View>
              </View>
            )
          })}
        </YStack>
      </WindowLayout>
    )
  },

  Avatars: () => {
    return (
      <View flexDirection="row">
        {[
          'https://images.unsplash.com/photo-1588798204072-e5f8e649d269',
          'https://images.unsplash.com/photo-1736754079614-8b43bcba9926',
          'https://images.unsplash.com/photo-1736267740362-0c10963c8047',
        ].map((img, index) => (
          <View
            key={img}
            zIndex={index}
            marginLeft={
              index !== 0 ? -(getTokenValue('$2' as any) ?? 20) * 1.5 : undefined
            }
            animation="bouncy"
            position="relative"
            x={0}
          >
            <Avatar bw={1.5} borderColor={'$background'} circular size="$5">
              <Avatar.Image accessibilityLabel="Nate Wienert" src={`${img}?&w=100`} />
              <Avatar.Fallback delayMs={600} backgroundColor="$color3" />
            </Avatar>
          </View>
        ))}
      </View>
    )
  },

  Buttons: () => {
    return (
      <ZStack>
        <Button
          mb={'$-6'}
          mr={'$-6'}
          alignSelf="center"
          icon={User}
          size="$4"
          themeInverse
        >
          Follow
        </Button>
        <Button mt={'$-6'} ml={'$-6'} alignSelf="center" icon={Share} size="$4">
          Share
        </Button>
      </ZStack>
    )
  },

  DatePickers: () => {
    return (
      <YStack h="100%" w="100%" justifyContent="flex-start" alignItems="center">
        <YStack
          borderWidth={1}
          w="100%"
          borderColor="$borderColor"
          $theme-light={{
            borderColor: '$gray7',
          }}
          borderRadius="$4"
          gap="$2"
          bg="$background"
          overflow="hidden"
        >
          <XStack
            bg="$backgroundFocus"
            justifyContent="center"
            alignItems="center"
            w="100%"
          >
            <YStack
              p="$3"
              gap="$1"
              alignItems="center"
              justifyContent="center"
              flex={1}
              borderBottomWidth={1}
              borderColor="$borderColor"
            >
              <Text textAlign="center" fontSize="$1">
                {new Date().getFullYear()}
              </Text>
              <Text textAlign="center" fontWeight="bold" fontSize="$3">
                {new Date().toLocaleString('default', { month: 'long' })}
              </Text>
            </YStack>
          </XStack>

          <XStack px="$2">
            {['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Text key={index} flex={1} textAlign="center" fontSize={8}>
                {day}
              </Text>
            ))}
          </XStack>

          <XStack px="$2" flexWrap="wrap">
            {Array.from(
              {
                length: 15,
              },
              (_, i) => {
                const date = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  i + 1
                )
                const dayOfWeek = date.getDay()
                const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1

                return (
                  <XStack
                    key={i}
                    w="14.28%"
                    h={'$2'}
                    justifyContent="center"
                    alignItems="center"
                    ml={i === 0 ? `${offset * 14.28}%` : 0}
                  >
                    <Text fontSize={10}>{i + 1}</Text>
                  </XStack>
                )
              }
            )}
          </XStack>
        </YStack>
      </YStack>
    )
  },

  Tables: () => {
    return (
      <WindowLayout>
        <XStack
          bg="$backgroundPress"
          borderBottomWidth={1}
          borderColor={'$borderColor'}
          $theme-light={{
            borderColor: '$gray6',
            bg: '$gray4',
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              flex={1}
              h={'$2'}
              borderLeftWidth={1}
              borderRightWidth={1}
              borderColor={index === 1 ? '$borderColor' : 'transparent'}
              $theme-light={{
                borderColor: index === 1 ? '$gray6' : 'transparent',
              }}
              key={index}
            />
          ))}
        </XStack>
        <YStack w="100%" bg="$background">
          {Array.from({ length: 10 }).map((_, index) => (
            <XStack
              borderBottomWidth={1}
              borderColor={'$borderColor'}
              key={index}
              h={'$1.5'}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <View
                  key={index}
                  borderLeftWidth={1}
                  borderRightWidth={1}
                  borderColor={index === 1 ? '$borderColor' : 'transparent'}
                  $theme-light={{
                    borderColor: index === 1 ? '$gray6' : 'transparent',
                  }}
                  flex={1}
                  h="100%"
                />
              ))}
            </XStack>
          ))}
        </YStack>
      </WindowLayout>
    )
  },

  Chips: () => {
    return (
      <YStack gap="$2" justifyContent="center" alignItems="center">
        <Chip rotate={'5deg'} mr={'$-6'} alignSelf="center" bg="$green10">
          <Text fontSize="$1" color="$white1">
            Success
          </Text>
          <CheckCircle2 size={12} color="$white1" />
        </Chip>

        <Chip rotate={'-2deg'} ml={'$-6'} alignSelf="center" bg="$gray10">
          <Text fontSize="$1" color="$white1">
            Offline
          </Text>
        </Chip>

        <Chip rotate={'-5deg'} gap="$2" mr={'$-6'} alignSelf="center" bg="$red10">
          <Text fontSize="$1" color="$white1">
            Online
          </Text>
        </Chip>
      </YStack>
    )
  },

  Dialogs: () => {
    return (
      <YStack
        w="100%"
        borderRadius="$4"
        borderWidth={1}
        borderColor={'$borderColor'}
        $theme-light={{
          borderColor: '$gray6',
        }}
        gap="$2"
      >
        <YStack w="100%" p="$2" py="$3" gap="$2">
          <Text textAlign="center" fontSize="$2" fontWeight={'bold'}>
            Dialog
          </Text>
          <Text textAlign="center" fontSize="$1" fontWeight={'300'}>
            Hey, Hello there!
          </Text>
        </YStack>

        <YStack justifyContent="space-between">
          <Text
            color="$red10"
            p="$2"
            textAlign="center"
            fontSize={10}
            borderTopWidth={1}
            borderColor="$borderColor"
            $theme-light={{
              borderColor: '$gray6',
            }}
          >
            Cancel
          </Text>
          <Text
            borderTopWidth={1}
            borderColor="$borderColor"
            $theme-light={{
              borderColor: '$gray6',
            }}
            textAlign="center"
            fontSize={10}
            p="$2"
            color="$blue10"
          >
            Hi
          </Text>
        </YStack>
      </YStack>
    )
  },

  Navbar: () => {
    return (
      <WindowLayout>
        <XStack
          alignItems="center"
          bg="$backgroundPress"
          borderBottomWidth={1}
          borderColor={'$borderColor'}
          $theme-light={{
            borderColor: '$gray6',
          }}
          p="$2"
          gap="$2"
        >
          <BentoIcon />
          <XStack px="$2" gap="$4" flex={1}>
            {Array.from({ length: 3 }).map((_, index) => (
              <View bg="$gray8" flex={1} h={6} key={index} />
            ))}
          </XStack>
        </XStack>
      </WindowLayout>
    )
  },

  Sidebar: () => {
    return (
      <WindowLayout>
        <YStack
          alignItems="flex-start"
          bg="$backgroundPress"
          w="33%"
          h="100%"
          borderBottomWidth={1}
          borderColor={'$borderColor'}
          $theme-light={{
            borderColor: '$gray6',
          }}
          justifyContent="flex-start"
          p="$2"
          gap="$4"
        >
          <BentoIcon />
          <YStack h="100%" w="100%" gap="$3" flex={1}>
            <View w="90%" bg="$gray8" h={6} />
            <View w="70%" bg="$gray8" h={6} />
            <View w="50%" bg="$gray8" h={6} />
            <View w="90%" bg="$gray8" h={6} />
          </YStack>
        </YStack>
      </WindowLayout>
    )
  },

  Tabbar: () => {
    return (
      <WindowLayout>
        <XStack
          alignItems="center"
          bg="$backgroundPress"
          borderBottomWidth={1}
          borderColor={'$borderColor'}
          $theme-light={{
            borderColor: '$gray6',
          }}
        >
          {['Home', 'Explorer', 'Profile'].map((tab, index) => (
            <View
              flex={1}
              p="$2"
              key={index}
              justifyContent="center"
              alignItems="center"
              borderBottomWidth={1}
              borderColor={index === 0 ? '$accentColor' : 'transparent'}
            >
              <Text opacity={index === 0 ? 1 : 0.5} textAlign="center" fontSize={8}>
                {tab}
              </Text>
            </View>
          ))}
        </XStack>
        <YStack
          p="$4"
          w="100%"
          justifyContent="center"
          alignItems="center"
          bg="$background"
          gap="$2"
        >
          <Text fontWeight="bold">Hero</Text>
          <View w="100%" mt="$2" h={6} bg="$gray8" />
          <View w="80%" h={6} bg="$gray8" />
        </YStack>
      </WindowLayout>
    )
  },
  Microinteractions: () => {
    return (
      <YStack>
        <View
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="$2"
        >
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="$3"
            bg="$background"
            height="$3"
            paddingHorizontal="$4"
            borderRadius="$8"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={index}
                width={index === 1 ? '$2' : '$0.75'}
                height="$0.75"
                borderRadius="$5"
                backgroundColor={index === 1 ? '$accentColor' : '$gray10'}
                animation="200ms"
              />
            ))}
          </View>
        </View>
      </YStack>
    )
  },

  Slide: () => {
    return (
      <XStack w="100%" h="100%">
        <View
          mt="10%"
          w={100}
          h={100}
          rotate={'-16deg'}
          borderWidth={2}
          borderColor="$gray6"
          bg="$background"
          br="$4"
          opacity={0.6}
          scale={0.78}
        />
        <View
          w={100}
          h={100}
          rotate={'-7deg'}
          ml="-30%"
          mb="10%"
          borderWidth={2}
          aspectRatio={1}
          br="$4"
          bg="$background"
          borderColor="$gray6"
          opacity={0.7}
          scale={0.8}
        />
        <View
          rotate={'4deg'}
          w={100}
          h={100}
          ml="-30%"
          mb="10%"
          borderWidth={2}
          aspectRatio={1}
          br="$4"
          bg="$background"
          justifyContent="center"
          borderColor="$gray6"
          alignItems="center"
        >
          <BentoIcon />
        </View>
      </XStack>
    )
  },

  Cart: () => {
    return (
      <WindowLayout>
        <YStack gap="$4" p="$4">
          <ShoppingCart rotate={'-16deg'} />
          <YStack gap="$4">
            {Array.from({ length: 3 }).map((_, index) => (
              <XStack gap="$2" key={index}>
                <View aspectRatio={1} bg="$gray8" h={'$1.5'} br="$2" />
                <YStack flex={1} gap="$2">
                  <View bg="$gray8" h={6} width={'70%'} />
                  <View bg="$gray8" h={6} width={'20%'} />
                </YStack>

                <View bg="$gray8" h={6} width={'10%'} />
              </XStack>
            ))}
          </YStack>
        </YStack>
      </WindowLayout>
    )
  },

  'Product Page': () => {
    return (
      <WindowLayout>
        <XStack gap="$4" justifyContent="flex-start" p="$4">
          <YStack flex={3} gap="$1.5">
            <View w={'100%'} bg="$gray8" aspectRatio={3 / 2} />
            <XStack gap="$1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} bg="$gray8" flex={1} aspectRatio={1} />
              ))}
            </XStack>
          </YStack>
          <YStack gap="$2" flex={1}>
            <Text fontSize={10}>Product</Text>

            <XStack gap="$1.5">
              {['$red10', '$blue10', '$green10'].map((color, index) => (
                <View
                  bg={color as any}
                  h={6}
                  w={6}
                  borderRadius={1_000_000_000}
                  key={index}
                />
              ))}
            </XStack>

            <View w="100%" mt="$2" h={6} bg="$gray8" />
            <View w="80%" h={6} bg="$gray8" />
          </YStack>
        </XStack>
      </WindowLayout>
    )
  },

  Preferences: () => {
    return (
      <WindowLayout>
        <YStack
          m="$4"
          p="$4"
          br="$4"
          gap="$2"
          borderWidth={1.5}
          borderColor={'$gray8'}
          height={200}
        >
          <Mail />
          <View w="100%" mt="$2" h={6} bg="$gray8" />
          <View w="80%" h={6} bg="$gray8" />
        </YStack>
      </WindowLayout>
    )
  },

  'Event Reminders': () => {
    return (
      <YStack
        w="100%"
        // h="100%"
        bg="$background"
        borderWidth={1}
        borderColor={'$borderColor'}
        overflow="hidden"
        br="$4"
      >
        <XStack
          alignItems="center"
          p="$2"
          gap="$2"
          borderBottomWidth={1}
          borderColor={'$borderColor'}
          bg="$backgroundPress"
        >
          <Laptop2 size={16} />
          <Text fontSize={10}>Status Tracker</Text>
        </XStack>
        <YStack p="$2" gap="$2">
          {[1, 2].map((_, i) => (
            <XStack key={i} alignItems="center" gap="$2">
              <View bg="$gray8" h={'$2'} aspectRatio={1} borderRadius={1_000_000_000} />
              <View flex={1} gap="$2">
                <View bg="$gray8" h={6} w="80%" />
                <View bg="$gray8" h={6} w="20%" />
              </View>
            </XStack>
          ))}
        </YStack>
      </YStack>
    )
  },
}

export default ComponentPreview
