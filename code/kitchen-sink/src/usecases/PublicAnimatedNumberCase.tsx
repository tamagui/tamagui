import { useRef } from 'react'
import type { Animated } from 'react-native'
import {
  Button,
  Paragraph,
  View as TamaguiView,
  XStack,
  YStack,
  useAnimatedNumber,
  useAnimatedNumberStyle,
  useConfiguration,
} from 'tamagui'

// exercises the public animation hooks exported from `tamagui`:
// useAnimatedNumber + useAnimatedNumberStyle. pressing the button springs
// translateX between 0 and 200, which must visibly animate and settle on
// every driver.

const CLOSED = 0
const OPEN = 200

export function PublicAnimatedNumberCase() {
  const { animationDriver } = useConfiguration()

  // the driver's animated View consumes the returned style; on the css driver
  // the `transition` prop below drives the visible interpolation.
  const AnimatedView = (animationDriver?.['NumberView'] ??
    animationDriver?.View ??
    TamaguiView) as typeof Animated.View

  const animatedNumber = useAnimatedNumber(CLOSED)
  const openRef = useRef(false)

  const animatedStyle = useAnimatedNumberStyle(animatedNumber, (x: number) => {
    'worklet'
    return { transform: [{ translateX: x }] }
  })

  const toggle = () => {
    openRef.current = !openRef.current
    animatedNumber.setValue(openRef.current ? OPEN : CLOSED, {
      type: 'spring',
      damping: 20,
      stiffness: 90,
    })
  }

  return (
    <YStack gap="$4" padding="$4" flex={1}>
      <Paragraph>Public useAnimatedNumber / useAnimatedNumberStyle</Paragraph>
      <XStack gap="$4" alignItems="center">
        <Button onPress={toggle} data-testid="animated-number-trigger">
          Toggle X
        </Button>
      </XStack>
      <AnimatedView
        // @ts-ignore css/motion drivers attach the transition here
        transition="slow"
        // @ts-ignore
        disableClassName
        // testID maps to data-testid across all drivers (react-native Animated.View
        // only forwards testID, not a raw data-testid prop)
        testID="animated-number-box"
        data-testid="animated-number-box"
        style={[
          {
            width: 60,
            height: 60,
            backgroundColor: 'royalblue',
          },
          animatedStyle,
        ]}
      />
    </YStack>
  )
}
