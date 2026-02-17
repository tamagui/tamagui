/**
 * Real-world test for native style optimization.
 * Uses normal Tamagui components — no direct _TamaguiView or __styles.
 * The compiler should emit __TamaguiView/__TamaguiText with pre-computed styles,
 * and <Theme> should trigger zero-re-render updates via the native registry.
 */

import { memo, useCallback, useRef, useState } from 'react'
import { Button, H3, Separator, Text, Theme, XStack, YStack, ScrollView } from 'tamagui'

const OptimizedCard = memo(function OptimizedCard() {
  const count = useRef(0)
  count.current++

  return (
    <YStack
      backgroundColor="$background"
      padding={20}
      borderRadius={12}
      borderWidth={1}
      borderColor="$borderColor"
      marginBottom={16}
    >
      <Text color="$color" fontSize={16} fontWeight="600">
        Optimized card (renders: {count.current})
      </Text>
      <Text color="$colorFocus" fontSize={13} marginTop={4}>
        Should stay at 1 after theme toggle
      </Text>
      <XStack gap={12} marginTop={12}>
        <YStack width={50} height={50} borderRadius={8} backgroundColor="$color3" />
        <YStack width={50} height={50} borderRadius={8} backgroundColor="$blue5" />
        <YStack width={50} height={50} borderRadius={8} backgroundColor="$green5" />
      </XStack>
    </YStack>
  )
})

const OptimizedBox = memo(function OptimizedBox({ index }: { index: number }) {
  const count = useRef(0)
  count.current++

  return (
    <YStack
      width={80}
      height={60}
      borderRadius={8}
      backgroundColor="$color3"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="$color" fontSize={12}>
        #{index + 1} ({count.current})
      </Text>
    </YStack>
  )
})

export function NativeStyleRealWorld() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')
  const toggleCount = useRef(0)
  const [renderKey, setRenderKey] = useState(0)

  const toggleTheme = useCallback(() => {
    toggleCount.current++
    setCurrentTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const resetCounts = useCallback(() => {
    toggleCount.current = 0
    setRenderKey((k) => k + 1)
  }, [])

  return (
    <Theme name={currentTheme}>
      <ScrollView>
        <YStack flex={1} backgroundColor="$background" padding="$4" gap="$3">
          <H3>Real-World Native Optimization</H3>
          <Text fontSize={12} color="$colorFocus">
            Normal Tamagui components — compiler handles the rest
          </Text>

          <XStack gap="$2" alignItems="center">
            <Button size="$3" onPress={toggleTheme}>
              Toggle ({currentTheme})
            </Button>
            <Button size="$3" theme="gray" onPress={resetCounts}>
              Reset
            </Button>
            <Text fontSize={12}>Toggles: {toggleCount.current}</Text>
          </XStack>

          <Separator />

          <Text fontWeight="bold" fontSize={13}>
            Optimized Card (should stay at 1):
          </Text>
          <OptimizedCard key={`opt-${renderKey}`} />

          <Text fontWeight="bold" fontSize={13}>
            Optimized Boxes (should stay at 1):
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <OptimizedBox key={`box-${i}-${renderKey}`} index={i} />
            ))}
          </XStack>

          <Separator />

          <YStack gap="$2" padding="$3" backgroundColor="$color2" borderRadius="$3">
            <Text fontWeight="bold" fontSize={13}>
              Expected:
            </Text>
            <Text fontSize={12}>• Render counts stay at 1 after toggle</Text>
            <Text fontSize={12}>• Colors change via C++ ShadowTree updates</Text>
            <Text fontSize={12}>• No _TamaguiView in source — compiler emits it</Text>
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  )
}

export default NativeStyleRealWorld
