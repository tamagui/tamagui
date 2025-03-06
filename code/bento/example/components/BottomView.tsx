import { Image, Text, type ThemeName, XStack, YStack } from 'tamagui'
import { colors, insets } from '../constant'
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

type BottomViewProps = {
  title: string
  themeColor: ThemeName
  setThemeColor: (color?: ThemeName) => void
}

const SIZE = 24
const SPACE = 6
const LOGO_SIZE = SIZE * 7 + SPACE * 8

const AnimatedImage = Animated.createAnimatedComponent(Image)

export function BottomView({ title, themeColor, setThemeColor }: BottomViewProps) {
  const position = useSharedValue(-1)

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const x = e.x
      const index = Math.ceil((x / LOGO_SIZE) * 7) - 1

      runOnJS(setThemeColor)(colors?.[index]?.theme)

      position.value = index
    })
    .onEnd((e) => {
      position.value = withTiming(-1, { duration: 100 })
      runOnJS(setThemeColor)(undefined)
    })

  return (
    <YStack pos="absolute" p="$4" pb={insets.paddingBottom} bottom={0} left={0} right={0}>
      <YStack jc="center" ai="center" gap="$3">
        <Text
          theme={themeColor}
          fontWeight="bold"
          textTransform="uppercase"
          fontFamily="$mono"
        >
          {title} BY
        </Text>

        <XStack alignSelf="center">
          <GestureDetector gesture={pan}>
            <XStack
              gap={SPACE}
              data-tauri-drag-region
              position="relative"
              jc="center"
              ai="center"
              mx={SPACE}
            >
              {logoWords.map((image, index) => (
                <ImageWord
                  key={`path-${index}`}
                  image={image}
                  position={position}
                  index={index}
                />
              ))}
            </XStack>
          </GestureDetector>
        </XStack>
      </YStack>
    </YStack>
  )
}

const ImageWord = ({
  image,
  position,
  index,
}: { image: string; position: SharedValue<number>; index: number }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(
          position.value === -1 ? 1 : position.value === index ? 1.3 : 0.9,
          { duration: 350 }
        ),
      },
      { translateY: withTiming(position.value === index ? -4 : 0, { duration: 350 }) },
    ],
    opacity: withTiming(position.value === -1 ? 1 : position.value === index ? 1 : 0.6, {
      duration: 350,
    }),
    width: SIZE,
    height: SIZE,
  }))

  return <AnimatedImage objectFit="contain" src={image} style={animatedStyle} />
}

const logoWords = [
  require('../assets/T.png'),
  require('../assets/A.png'),
  require('../assets/M.png'),
  require('../assets/A1.png'),
  require('../assets/G.png'),
  require('../assets/U.png'),
  require('../assets/I.png'),
]
