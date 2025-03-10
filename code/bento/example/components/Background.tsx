import { Dimensions, LayoutAnimation, UIManager } from 'react-native'
import { View, XStack, type ThemeName } from 'tamagui'
import { useEffect, useMemo } from 'react'
import { colors } from '../constant'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const { width } = Dimensions.get('window')

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const SIZE = width / 8

const AnimatedView = Animated.createAnimatedComponent(View)

const RNLayoutAnimation = (
  options: {
    callback?: () => void
    duration?: number
  } = {}
) => {
  LayoutAnimation.configureNext(
    {
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
    () => {
      if (typeof options?.callback === 'function') {
        options?.callback?.()
      }
    }
  )
}

export const Background = ({ themeName }: { themeName?: ThemeName }) => {
  useEffect(() => {
    RNLayoutAnimation()
  }, [themeName])

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
              opacity={0.8}
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
