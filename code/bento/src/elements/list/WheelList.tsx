import { useState } from 'react'
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import {
  type ColorTokens,
  Image,
  isWeb,
  styled,
  Text,
  type ThemeName,
  View,
  YStack,
} from 'tamagui'
import { useWheelScrollHandler } from './useWheelScrollHandler'
import { AnimatedView } from './components/AnimatedPrimitives'

const AnimatedList = styled(Animated.FlatList<CardData>, {
  flex: 1,
})

export function WheelList({
  onChange,
}: {
  onChange?: (item: CardData, index: number) => void
}) {
  const [index, setIndex] = useState(0)

  const scrollY = useSharedValue(0)

  const scrollHandler = useWheelScrollHandler({
    index,
    itemStride: ITEM_SIZE + SPACING,
    items: data,
    onChange,
    scrollY,
    setIndex,
  })

  return (
    <View
      flex={1}
      flexBasis="auto"
      position="relative"
      height={isWeb ? '80vh' : '100%'}
      maxH="xl:600px"
      width="100%"
      justify="center"
      theme={data[index]?.theme}
    >
      <View position="absolute" inset={0}>
        {data.map((item, index) => (
          <BackgroundView key={item.id} index={index} scrollY={scrollY} />
        ))}
      </View>
      <Slider scrollY={scrollY} />

      <AnimatedList
        onScroll={scrollHandler}
        renderItem={({ item, index }) => (
          <CardItem index={index} cardItem={item} scrollY={scrollY} />
        )}
        data={data}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={SIZE_RANGE}
        snapToEnd={true}
        pagingEnabled={!isWeb}
        contentContainerStyle={{
          gap: SPACING,
          paddingTop: isWeb ? 300 : '100%',
          paddingBottom: isWeb ? 0 : '100%',
          paddingHorizontal: SPACING,
        }}
      />

      <View position="absolute" z={1} gap="2" t={0} l={0} r={0} p="4">
        <Text fontWeight="800" fontFamily="heading" fontSize="10">
          Influencer
        </Text>
        <Text fontWeight="500" fontFamily="mono" color="color-9" fontSize="8">
          {data.length} Contacts
        </Text>
      </View>
    </View>
  )
}

const CardItem = ({
  scrollY,
  cardItem,
  index,
}: {
  scrollY: SharedValue<number>
  cardItem: CardData
  index: number
}) => {
  const inputRange = getInputRange(index)

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollY.value,
      inputRange,
      [60, 45, 20, 0, -20, -45, 60],
      Extrapolation.CLAMP
    )

    const translateY = interpolate(scrollY.value, inputRange, [
      SPACING * 12,
      SPACING * 10,
      SPACING * 2,
      0,
      -SPACING * 2,
      -SPACING * 10,
      -SPACING * 12,
    ])

    const translateX = interpolate(
      scrollY.value,
      inputRange,
      [-SPACING * 6, 0, 0, 0, 0, 0, SPACING * 6],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ rotate: `${rotate}deg` }, { translateY }, { translateX }],
    }
  }, [scrollY, inputRange])

  return (
    <AnimatedView
      theme={cardItem.theme}
      width="95% md:300px"
      height={ITEM_SIZE}
      bg={cardItem.backgroundColor as ColorTokens}
      p="2"
      rounded="8"
      style={animatedStyle}
      flexDirection="row"
      items="center"
      gap="4"
      boxShadow="0 0 32px shadow-3"
      borderWidth={2}
      borderColor="color-3"
    >
      <View
        position="relative"
        height="100%"
        overflow="hidden"
        aspectRatio={1}
        rounded="6"
        bg="color-1"
      >
        <Image
          height="100%"
          width="100%"
          src={cardItem.image.uri}
          objectFit="contain"
          position="absolute"
          inset={0}
        />
      </View>
      <YStack px="2" gap="2" flex={1}>
        <Text
          color="white"
          textTransform="capitalize"
          fontFamily="heading"
          fontWeight="bold"
          fontSize="8"
        >
          {cardItem.title}
        </Text>
        <Text fontSize="3" fontFamily="mono" color="white" opacity={0.8}>
          {cardItem.description}
        </Text>
      </YStack>
    </AnimatedView>
  )
}

const BackgroundView = ({
  index,
  scrollY,
}: {
  index: number
  scrollY: SharedValue<number>
}) => {
  const inputRange = getInputRange(index)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, inputRange, [0, 0, 0.2, 1, 0.2, 0, 0]),
    }
  }, [scrollY, inputRange])

  return (
    <AnimatedView
      theme={data[index].theme}
      bg="color-3"
      position="absolute"
      inset={0}
      style={animatedStyle}
      justify="space-between"
    />
  )
}

const Slider = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  return (
    <YStack
      t={0}
      position="absolute"
      b={0}
      l={0}
      justify="center"
      items="flex-end"
      self="center"
      r="4"
      gap="2"
    >
      {data.map((item, index) => (
        <SliderItem scrollY={scrollY} key={item.id} index={index} />
      ))}
    </YStack>
  )
}

const SliderItem = ({
  scrollY,
  index,
}: {
  scrollY: SharedValue<number>
  index: number
}) => {
  const inputRange = getInputRange(index + 1)

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollY.value,
      inputRange,
      [8, 16, 24, 16, 8],
      Extrapolation.CLAMP
    )

    return {
      width: width || 8,
      h: 4,
    }
  }, [scrollY, inputRange])

  return <AnimatedView rounded="6" height={4} bg="color-9" style={animatedStyle} />
}

type CardData = {
  id: number
  title: string
  image: {
    uri: string
  }
  backgroundColor: string
  theme?: ThemeName
  description: string
}

const data: CardData[] = [
  {
    id: 1,
    title: 'MR Beast',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_1.png`,
    },

    description: '100M Subscribers',
    backgroundColor: '#205781',
    theme: 'blue',
  },
  {
    id: 2,
    title: 'Lionel',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_2.png`,
    },
    description: '10M Subscribers',
    backgroundColor: '#4F959D',
    theme: 'teal',
  },
  {
    id: 3,
    title: 'Kylie Jenner',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_3.png`,
    },
    description: '32M Subscribers',
    backgroundColor: '#1B4D3E',
    theme: 'green',
  },
  {
    id: 4,
    title: 'Selena Gomez',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_4.png`,
    },
    description: '94M Subscribers',
    backgroundColor: '#034C53',
    theme: 'teal',
  },
  {
    id: 5,
    title: 'Dwayne Johnson',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_5.png`,
    },
    backgroundColor: '#C14600',
    description: '8M Subscribers',
    theme: 'orange',
  },
  {
    id: 6,
    title: 'Ariana Grande',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_6.png`,
    },
    description: '22M Subscribers',
    backgroundColor: '#872341',
    theme: 'red',
  },
  {
    id: 7,
    title: 'Hailey Baldwin',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_7.png`,
    },
    backgroundColor: '#261FB3',
    description: '32M Subscribers',
    theme: 'blue',
  },
  {
    id: 8,
    title: 'Justin Bieber',
    image: {
      uri: `https://tamagui.dev/bento/images/wheel-list/wl_8.png`,
    },
    description: '12M Subscribers',
    backgroundColor: '#D84040',
    theme: 'purple',
  },
]

const SPACING = 40
const ITEM_SIZE = 125

const SIZE_RANGE = ITEM_SIZE + SPACING

const getInputRange = (index: number) => [
  Math.round((index - 3) * SIZE_RANGE),
  Math.round((index - 2) * SIZE_RANGE),
  Math.round((index - 1) * SIZE_RANGE),
  Math.round(index * SIZE_RANGE),
  Math.round((index + 1) * SIZE_RANGE),
  Math.round((index + 2) * SIZE_RANGE),
  Math.round((index + 3) * SIZE_RANGE),
]

WheelList.fileName = 'WheelList'
