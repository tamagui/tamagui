/**
 * Test case for native style optimization.
 * This verifies that _TamaguiView and _TamaguiText work with pre-computed styles.
 *
 * Goal: When native module is available, theme changes should NOT re-render
 * the optimized components - styles update directly via ShadowTree.
 */

import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { Button, YStack, XStack, Text, H3, Separator, Theme, ScrollView } from 'tamagui'
import { _TamaguiView, _TamaguiText } from '@tamagui/native'
import * as registry from '@tamagui/native-style-registry'
import { View, Text as RNText } from 'react-native'
import { useThemeName } from '@tamagui/core'

// pre-computed styles (what compiler would generate)
const viewStyles = {
  light: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dark: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
}

const textStyles = {
  light: { color: '#000000', fontSize: 16 },
  dark: { color: '#ffffff', fontSize: 16 },
}

const boxStyles = {
  light: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    width: 100,
    height: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  dark: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    width: 100,
    height: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
}

// optimized components - should NOT re-render on theme change
const OptimizedCard = memo(function OptimizedCard() {
  const count = useRef(0)
  count.current++
  return (
    <_TamaguiView __styles={viewStyles} testID="optimized-card">
      <_TamaguiText __styles={textStyles}>
        Optimized card (renders: {count.current})
      </_TamaguiText>
      <_TamaguiText __styles={textStyles}>
        Theme changes via ShadowTree, no re-render.
      </_TamaguiText>
    </_TamaguiView>
  )
})

const OptimizedBox = memo(function OptimizedBox({ index }: { index: number }) {
  const count = useRef(0)
  count.current++
  return (
    <_TamaguiView __styles={boxStyles} testID={`optimized-box-${index}`}>
      <_TamaguiText __styles={textStyles}>{index + 1}</_TamaguiText>
    </_TamaguiView>
  )
})

// regular component using useThemeName - WILL re-render on theme change
function RegularCard() {
  const themeName = useThemeName()
  const count = useRef(0)
  count.current++

  const isLight = themeName === 'light'
  return (
    <View
      style={{
        backgroundColor: isLight ? '#f5f5f5' : '#2a2a2a',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isLight ? '#e0e0e0' : '#444',
      }}
      testID="regular-card"
    >
      <RNText style={{ color: isLight ? '#000' : '#fff', fontSize: 16 }}>
        Regular card (renders: {count.current})
      </RNText>
      <RNText style={{ color: isLight ? '#000' : '#fff', fontSize: 16 }}>
        Uses useThemeName - re-renders on theme change.
      </RNText>
    </View>
  )
}

export function NativeStyleOptimization() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')
  const [stats, setStats] = useState<registry.RegistryStats | null>(null)
  const [renderKey, setRenderKey] = useState(0)
  const toggleCount = useRef(0)

  // update stats on interval
  useEffect(() => {
    const updateStats = () => setStats(registry.getRegistryStats())
    updateStats()
    const interval = setInterval(updateStats, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    toggleCount.current++
    registry.setTheme(newTheme)
    setCurrentTheme(newTheme)
  }, [currentTheme])

  const resetCounts = useCallback(() => {
    toggleCount.current = 0
    setRenderKey((k) => k + 1)
  }, [])

  const isNative = registry.isNativeModuleAvailable()

  return (
    <Theme name={currentTheme}>
      <ScrollView>
        <YStack flex={1} backgroundColor="$background" padding="$4" gap="$3">
          <H3>Native Style Optimization</H3>

          <XStack gap="$2" alignItems="center" flexWrap="wrap">
            <Button size="$3" onPress={toggleTheme} testID="toggle-theme-btn">
              Toggle ({currentTheme})
            </Button>
            <Button
              size="$3"
              theme="gray"
              onPress={resetCounts}
              testID="reset-counts-btn"
            >
              Reset
            </Button>
            <Text fontSize={12}>Toggles: {toggleCount.current}</Text>
          </XStack>

          <YStack gap="$1" padding="$2" borderRadius="$2" backgroundColor="$color3">
            <Text fontWeight="bold" fontSize={12}>
              Registry: {isNative ? '✅ Native' : '⚠️ JS Fallback'}
            </Text>
            {stats && (
              <Text fontSize={11}>
                Views: {stats.viewCount} | Theme: {stats.currentTheme}
              </Text>
            )}
          </YStack>

          <Separator />

          <Text fontWeight="bold" fontSize={13}>
            Optimized Card (should stay at 1):
          </Text>
          <OptimizedCard key={`opt-${renderKey}`} />

          <Text fontWeight="bold" fontSize={13}>
            Optimized Boxes (should stay at 1 each):
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <OptimizedBox key={`box-${i}-${renderKey}`} index={i} />
            ))}
          </XStack>

          <Separator />

          <Text fontWeight="bold" fontSize={13}>
            Regular Card (increments on toggle):
          </Text>
          <RegularCard key={`reg-${renderKey}`} />

          <Separator />

          <YStack gap="$2" padding="$3" backgroundColor="$color2" borderRadius="$3">
            <Text fontWeight="bold" fontSize={13}>
              Expected Behavior:
            </Text>
            <Text fontSize={12}>• Optimized components: render count stays at 1</Text>
            <Text fontSize={12}>
              • Regular component: render count increases each toggle
            </Text>
            <Text fontSize={12}>• Both should visually update themes correctly</Text>
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  )
}

export default NativeStyleOptimization
