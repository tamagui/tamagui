import { Image, Text, type ThemeName, XStack, YStack } from '@tamagui/ui'
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
import { ReactNode } from 'react'

type ThemePicker = {
  themeColor?: ThemeName
  setThemeColor: (color?: ThemeName) => void
}

const SIZE = 24
const SPACE = 12
const LOGO_SIZE = SIZE * 4 + SPACE * 5

export function ThemePicker({ themeColor, setThemeColor }: ThemePicker) {
  const position = useSharedValue(-1)

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const x = e.x
      const index = Math.ceil((x / LOGO_SIZE) * 4) - 1

      runOnJS(setThemeColor)(colors?.[index]?.theme)

      position.value = index
    })
    .onEnd((e) => {
      position.value = withTiming(-1, { duration: 100 })
      runOnJS(setThemeColor)(undefined)
    })

  return (
    <YStack p="$4" pb={insets.paddingBottom}>
      <XStack alignSelf="center">
        <GestureDetector gesture={pan}>
          <XStack
            gap={SPACE}
            data-tauri-drag-region
            position="relative"
            jc="center"
            ai="center"
            mx={SPACE}
            px={SPACE}
            py={8}
            bg="$background"
            br="$10"
          >
            {colors.map(({ emoji }, index) => (
              <Emoji key={`path-${index}-${emoji}`} position={position} index={index}>
                {emoji}
              </Emoji>
            ))}
          </XStack>
        </GestureDetector>
      </XStack>
    </YStack>
  )
}

const Emoji = ({
  children,
  position,
  index,
}: { children: string; position: SharedValue<number>; index: number }) => {
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
    fontSize: SIZE,
    width: SIZE,
    height: SIZE + 4,
    lineHeight: SIZE + 6,
  }))

  return <Animated.Text style={animatedStyle}>{children}</Animated.Text>
}

// const logoWords = [
//   require('../assets/T.png'),
//   require('../assets/A.png'),
//   require('../assets/M.png'),
//   require('../assets/A1.png'),
//   require('../assets/G.png'),
//   require('../assets/U.png'),
//   require('../assets/I.png'),
// ]
