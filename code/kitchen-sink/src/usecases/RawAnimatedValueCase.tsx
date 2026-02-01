import { useEffect, useRef, useState } from 'react'
import { Animated, View as RNView, Text as RNText, StyleSheet } from 'react-native'
import { Button, Paragraph, YStack, XStack } from 'tamagui'

/**
 * Test case for raw Animated.Value with Animated.createAnimatedComponent
 *
 * This tests the core react-native-web-lite animated implementation
 * to verify AnimatedValue objects are properly consumed/interpolated.
 *
 * Key things being tested:
 * 1. Animated.Value with direct numeric style (opacity)
 * 2. Animated.Value with interpolation (color)
 * 3. Animated.Value with transform
 * 4. Animated.timing driving updates
 */

const AnimatedView = Animated.createAnimatedComponent(RNView)

export function RawAnimatedValueCase() {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(50)).current
  const scale = useRef(new Animated.Value(0.5)).current

  const [isAnimated, setIsAnimated] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // log the style value to debug
  useEffect(() => {
    const styleObj = {
      opacity,
      transform: [{ translateY }, { scale }],
    }

    // check what __getValue returns
    // @ts-expect-error
    const opacityValue = opacity.__getValue?.() ?? 'no __getValue'
    // @ts-expect-error
    const translateYValue = translateY.__getValue?.() ?? 'no __getValue'
    // @ts-expect-error
    const scaleValue = scale.__getValue?.() ?? 'no __getValue'

    setDebugInfo(
      JSON.stringify(
        {
          opacityValue,
          translateYValue,
          scaleValue,
          opacityType: typeof opacity,
          opacityConstructor: opacity?.constructor?.name,
        },
        null,
        2
      )
    )

    console.log('[RAW_ANIMATED] Initial values:', {
      opacity: opacityValue,
      translateY: translateYValue,
      scale: scaleValue,
    })
  }, [opacity, translateY, scale])

  const animateIn = () => {
    console.log('[RAW_ANIMATED] Starting animation IN')
    setIsAnimated(true)

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      console.log('[RAW_ANIMATED] Animation IN complete')
    })
  }

  const animateOut = () => {
    console.log('[RAW_ANIMATED] Starting animation OUT')
    setIsAnimated(false)

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      console.log('[RAW_ANIMATED] Animation OUT complete')
    })
  }

  // interpolated color
  const backgroundColor = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)'],
  })

  return (
    <YStack gap="$4" padding="$4" flex={1}>
      <Paragraph fontWeight="bold">Raw Animated.Value Test</Paragraph>
      <Paragraph size="$2" color="$color10">
        Tests Animated.createAnimatedComponent with AnimatedValue styles
      </Paragraph>

      <XStack gap="$4">
        <Button testID="animate-in-trigger" onPress={animateIn} disabled={isAnimated}>
          Animate In
        </Button>
        <Button testID="animate-out-trigger" onPress={animateOut} disabled={!isAnimated}>
          Animate Out
        </Button>
      </XStack>

      {/* The animated box */}
      <AnimatedView
        testID="animated-box"
        style={[
          styles.box,
          {
            opacity,
            backgroundColor,
            transform: [{ translateY }, { scale }],
          },
        ]}
      />

      {/* Debug info */}
      <YStack
        backgroundColor="$background"
        padding="$2"
        borderRadius="$2"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Paragraph size="$1" fontFamily="$mono">
          Debug Info:
        </Paragraph>
        <Paragraph testID="debug-info" size="$1" fontFamily="$mono" whiteSpace="pre">
          {debugInfo}
        </Paragraph>
      </YStack>

      {/* Display computed style for testing */}
      <ComputedStyleDisplay targetId="animated-box" />
    </YStack>
  )
}

/**
 * Component that polls and displays the computed style of a target element
 */
function ComputedStyleDisplay({ targetId }: { targetId: string }) {
  const [computedStyles, setComputedStyles] = useState<string>('')

  useEffect(() => {
    let rafId: number
    let running = true

    const poll = () => {
      if (!running) return

      const el = document.querySelector(`[data-testid="${targetId}"]`) as HTMLElement
      if (el) {
        const style = getComputedStyle(el)
        const info = {
          opacity: style.opacity,
          transform: style.transform,
          backgroundColor: style.backgroundColor,
        }

        const newStyles = JSON.stringify(info, null, 2)
        setComputedStyles((prev) => {
          if (prev !== newStyles) {
            console.log('[RAW_ANIMATED] Computed style changed:', info)
          }
          return newStyles
        })
      }

      rafId = requestAnimationFrame(poll)
    }

    poll()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [targetId])

  return (
    <YStack backgroundColor="$backgroundHover" padding="$2" borderRadius="$2">
      <Paragraph size="$1" fontFamily="$mono">
        Computed Styles:
      </Paragraph>
      <Paragraph testID="computed-styles" size="$1" fontFamily="$mono" whiteSpace="pre">
        {computedStyles}
      </Paragraph>
    </YStack>
  )
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
})
