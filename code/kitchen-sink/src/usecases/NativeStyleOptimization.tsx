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
import { NativeModules, TurboModuleRegistry, processColor } from 'react-native'

// debug: check what's in NativeModules
const debugTurbo = TurboModuleRegistry.get('TamaguiStyleRegistry')
const debugBridge = (NativeModules as any).TamaguiStyleRegistry
const debugInfo = {
  turbo: debugTurbo ? 'found' : 'null',
  bridge: debugBridge ? 'found' : 'undefined',
  bridgeKeys: Object.keys(NativeModules).filter(k => k.toLowerCase().includes('tamagui')),
}

// test processColor with HSLA
const colorTests = {
  hex: processColor('#ffffff'),
  hsla: processColor('hsla(0, 0%, 100%, 1)'),
  hsl: processColor('hsl(0, 0%, 100%)'),
  rgba: processColor('rgba(255, 255, 255, 1)'),
}
console.log('[NativeStyleOptimization] processColor tests:', JSON.stringify(colorTests))

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

// render counters - tracked globally
let optimizedRenders = 0
let regularRenders = 0
let boxRenders = 0

// optimized components - should NOT re-render on theme change
const OptimizedCard = memo(function OptimizedCard() {
  optimizedRenders++
  return (
    <_TamaguiView __styles={viewStyles} testID="optimized-card">
      <_TamaguiText __styles={textStyles}>
        Optimized card (renders: {optimizedRenders})
      </_TamaguiText>
      <_TamaguiText __styles={textStyles}>
        Theme changes via ShadowTree, no re-render.
      </_TamaguiText>
    </_TamaguiView>
  )
})

const OptimizedBox = memo(function OptimizedBox({ index }: { index: number }) {
  boxRenders++
  return (
    <_TamaguiView __styles={boxStyles} testID={`optimized-box-${index}`}>
      <_TamaguiText __styles={textStyles}>
        {index + 1}
      </_TamaguiText>
    </_TamaguiView>
  )
})

// regular tamagui - WILL re-render on theme change
function RegularCard() {
  regularRenders++
  return (
    <YStack
      bg="$color3"
      p="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      testID="regular-card"
    >
      <Text color="$color">
        Regular card (renders: {regularRenders})
      </Text>
      <Text color="$color">
        Theme changes trigger full re-render tree.
      </Text>
    </YStack>
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
    setCurrentTheme(newTheme)
    // this should update views without re-render when native module is available
    registry.setTheme(newTheme)
  }, [currentTheme])

  const resetCounts = useCallback(() => {
    optimizedRenders = 0
    regularRenders = 0
    boxRenders = 0
    toggleCount.current = 0
    setRenderKey(k => k + 1)
  }, [])

  const isNative = registry.isNativeModuleAvailable()

  return (
    <Theme name={currentTheme}>
      <ScrollView>
        <YStack flex={1} bg="$background" p="$4" gap="$3">
          <H3>Native Style Optimization</H3>

          <XStack gap="$2" ai="center" flexWrap="wrap">
            <Button size="$3" onPress={toggleTheme} testID="toggle-theme-btn">
              Toggle ({currentTheme})
            </Button>
            <Button size="$3" theme="gray" onPress={resetCounts} testID="reset-counts-btn">
              Reset
            </Button>
            <Text fontSize={12}>Toggles: {toggleCount.current}</Text>
          </XStack>

          <Separator />

          {/* render count comparison */}
          <XStack gap="$4">
            <YStack flex={1} gap="$1" p="$2" borderRadius="$2" bg="$green3">
              <Text fontWeight="bold" fontSize={12} color="$green11">Optimized</Text>
              <Text fontSize={11} testID="optimized-count">Card: {optimizedRenders}</Text>
              <Text fontSize={11} testID="box-count">Boxes: {boxRenders}</Text>
            </YStack>
            <YStack flex={1} gap="$1" p="$2" borderRadius="$2" bg="$red3">
              <Text fontWeight="bold" fontSize={12} color="$red11">Regular</Text>
              <Text fontSize={11} testID="regular-count">Card: {regularRenders}</Text>
            </YStack>
          </XStack>

          <YStack gap="$1" p="$2" borderRadius="$2" bg="$color3">
            <Text fontWeight="bold" fontSize={12}>
              Registry: {isNative ? '✅ Native' : '⚠️ JS Fallback'}
            </Text>
            {stats && (
              <Text fontSize={11}>
                Views: {stats.viewCount} | Theme: {stats.currentTheme}
              </Text>
            )}
            <Text fontSize={9} color="$color8">
              Debug: turbo={debugInfo.turbo}, bridge={debugInfo.bridge}
            </Text>
            <Text fontSize={9} color="$color8">
              Keys: {debugInfo.bridgeKeys.join(', ') || 'none'}
            </Text>
            <Text fontSize={9} color="$color8">
              getTheme: {registry.getTheme()}
            </Text>
          </YStack>

          <Separator />

          <Text fontWeight="bold" fontSize={13}>Optimized Card:</Text>
          <OptimizedCard key={`opt-${renderKey}`} />

          <Text fontWeight="bold" fontSize={13}>Optimized Boxes (6):</Text>
          <XStack gap="$2" flexWrap="wrap">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <OptimizedBox key={`box-${i}-${renderKey}`} index={i} />
            ))}
          </XStack>

          <Separator />

          <Text fontWeight="bold" fontSize={13}>Regular Tamagui Card:</Text>
          <RegularCard />

          <Separator />

          <YStack gap="$2" p="$3" bg="$color2" borderRadius="$3">
            <Text fontWeight="bold" fontSize={13}>Expected Behavior:</Text>
            <Text fontSize={12}>
              • After initial render, "Optimized" counts should stay at 1 + 6 boxes
            </Text>
            <Text fontSize={12}>
              • "Regular" count increases with each theme toggle
            </Text>
            <Text fontSize={12}>
              • With native module: colors change instantly, no re-render
            </Text>
            <Text fontSize={12}>
              • Without native module (JS Fallback): still works, but re-renders
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </Theme>
  )
}

export default NativeStyleOptimization
