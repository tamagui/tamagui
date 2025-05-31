import { Dimensions } from 'react-native'
import { View, XStack, type ThemeName } from '@tamagui/ui'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const SIZE = width / 8

const AnimatedView = Animated.createAnimatedComponent(View)

export const Background = ({ themeName }: { themeName?: ThemeName }) => {
  return (
    <AnimatedView
      entering={FadeIn}
      exiting={FadeOut}
      bg={'$color3'}
      position="absolute"
      inset={0}
      flex={1}
    >
      <XStack flexWrap="wrap" flex={1}>
        {Array.from({ length: 150 }).map((_, index) => {
          return (
            <View
              width={SIZE}
              height={SIZE}
              borderWidth={0.3}
              opacity={0.5}
              borderColor="$borderColor"
              key={index}
              ai="center"
              jc="center"
            />
          )
        })}
      </XStack>
    </AnimatedView>
  )
}
