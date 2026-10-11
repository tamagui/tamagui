import Animated from 'react-native-reanimated'
import { createStyledHOC, Text, View, isWeb } from 'tamagui'

type AnimationProps = {
  forwardedRef?: any
  nativeID?: string
}

const ViewFrame = createStyledHOC(
  View,
  ({ forwardedRef, nativeID, ...props }: AnimationProps, ref) => (
    <View
      ref={forwardedRef || ref}
      {...props}
      {...(!isWeb && nativeID ? { nativeID } : {})}
    />
  )
)

const TextFrame = createStyledHOC(
  Text,
  ({ forwardedRef, nativeID, ...props }: AnimationProps, ref) => (
    <Text
      ref={forwardedRef || ref}
      {...props}
      {...(!isWeb && nativeID ? { nativeID } : {})}
    />
  )
)

export const AnimatedView = Animated.createAnimatedComponent(ViewFrame)
export const AnimatedText = Animated.createAnimatedComponent(TextFrame)
