import {
  Check,
  CheckCircle,
  CheckCircle2,
  Share,
  Upload,
  User,
} from '@tamagui/lucide-icons'
import React from 'react'
import {
  Avatar,
  Button,
  Checkbox,
  getTokenValue,
  Group,
  GroupFrame,
  Label,
  RadioGroup,
  Separator,
  styled,
  Switch,
  View,
  XStack,
  ZStack,
} from 'tamagui'
import { CardFrame, Input, Text, YStack } from 'tamagui'

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
      <Input placeholder="Bento 🍱" />
    </YStack>
  ),

  Layouts: () => {
    return (
      <YStack mt="$2" justifyContent="flex-start" h="100%" w="100%">
        <YStack
          gap="$4"
          borderRadius="$4"
          overflow="hidden"
          borderWidth={1}
          borderColor="$borderColor"
          $theme-light={{
            borderColor: '$gray6',
          }}
          justifyContent="flex-start"
          alignItems="center"
          w="100%"
          bg="$background"
          h={200}
          p="$4"
        >
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
      </YStack>
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
        backgroundColor="$background05"
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
      <YStack
        bw={1.5}
        borderTopLeftRadius={'$4'}
        borderTopRightRadius={'$4'}
        ov="hidden"
        p="$4"
        borderColor="$borderColor"
        width="100%"
        bg="$background"
        mb="$-8"
        gap="$4"
      >
        {Array(3)
          .fill(0)
          .map((_, index) => {
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
        <Button
          theme={'active'}
          mt={'$-6'}
          ml={'$-6'}
          alignSelf="center"
          icon={Share}
          size="$4"
        >
          Share
        </Button>
      </ZStack>
    )
  },

  DatePickers: () => {
    return (
      <YStack h="100%" w="100%" justifyContent="flex-start" alignItems="center">
        <YStack
          // p="$4"
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
      <YStack h="100%" w="100%" justifyContent="flex-start" alignItems="center">
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
          }}
        >
          <XStack
            bg="$backgroundPress"
            borderBottomWidth={1}
            borderColor={'$borderColor'}
            $theme-light={{
              borderColor: '$gray6',
            }}
          >
            {Array(3)
              .fill(0)
              .map((_, index) => (
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
          <YStack w="100%">
            {Array(10)
              .fill(0)
              .map((_, index) => (
                <XStack
                  borderBottomWidth={1}
                  borderColor={'$borderColor'}
                  key={index}
                  h={'$1.5'}
                >
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
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
        </YStack>
      </YStack>
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
  // Navbar: PanelTop,
  // Sidebar: PanelLeft,
  // Tabbar: NotebookTabs,
  // Microinteractions: MousePointerClick,
  // Slide: Banana,
  // Cart: ShoppingCart,
  // 'Product Page': ShoppingBag,
  // Preferences: Cog,
  // 'Event Reminders': BellDot,
}

export default ComponentPreview
