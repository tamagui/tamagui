import { LayoutAnimation, UIManager } from 'react-native'
import { View, type ThemeName } from 'tamagui'
import { useEffect, useMemo } from 'react'
import { colors } from '../constant'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

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

export const Background = ({ themeName }: { themeName: ThemeName }) => {
  //

  const emoji = useMemo(() => {
    return colors.find((color) => color.theme === themeName)?.emoji
  }, [themeName])

  useEffect(() => {
    // console.log(themeName)
    RNLayoutAnimation()
  }, [themeName])

  return (
    <AnimatedView
      entering={FadeIn}
      exiting={FadeOut}
      bg={'$color2'}
      position="absolute"
      inset={0}
      flex={1}
    ></AnimatedView>
  )
}
