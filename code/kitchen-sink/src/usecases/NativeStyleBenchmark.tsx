/**
 * Benchmark for native style optimization.
 * Measures theme toggle performance with different approaches.
 *
 * Approaches compared:
 * 1. Regular RN View/Text - baseline
 * 2. Regular Tamagui - uses theme context
 * 3. Optimized Tamagui - uses _TamaguiView with pre-computed styles (memo)
 * 4. With Native Module - zero re-render via ShadowTree (when available)
 */

import { useState, useCallback, useRef, memo } from 'react'
import {
  View as RNView,
  Text as RNText,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Button, YStack, XStack, Text, H3, Separator, Theme } from 'tamagui'
import { _TamaguiView, _TamaguiText } from '@tamagui/native'
import * as registry from '@tamagui/native-style-registry'

// number of items in benchmark list
const ITEM_COUNT = 100

// pre-computed styles for optimized approach
const optimizedStyles = {
  light: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dark: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
}

const optimizedTextStyles = {
  light: { color: '#333333', fontSize: 14 },
  dark: { color: '#f0f0f0', fontSize: 14 },
}

// benchmark result type
interface BenchmarkResult {
  approach: string
  avgToggleTime: number
  renderCount: number
  toggleCount: number
}

// regular RN list item
const RNListItem = memo(function RNListItem({
  index,
  isDark,
}: {
  index: number
  isDark: boolean
}) {
  return (
    <RNView style={[styles.item, isDark ? styles.itemDark : styles.itemLight]}>
      <RNText style={isDark ? styles.textDark : styles.textLight}>
        RN Item {index + 1}
      </RNText>
    </RNView>
  )
})

// regular Tamagui list item
function TamaguiListItem({ index }: { index: number }) {
  return (
    <YStack
      bg="$color3"
      p="$3"
      my="$1"
      mx="$2"
      borderRadius="$2"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Text color="$color" fontSize={14}>
        Tamagui Item {index + 1}
      </Text>
    </YStack>
  )
}

// optimized Tamagui list item
const OptimizedListItem = memo(function OptimizedListItem({
  index,
}: {
  index: number
}) {
  return (
    <_TamaguiView __styles={optimizedStyles}>
      <_TamaguiText __styles={optimizedTextStyles}>
        Optimized Item {index + 1}
      </_TamaguiText>
    </_TamaguiView>
  )
})

// generate list data
const listData = Array.from({ length: ITEM_COUNT }, (_, i) => ({ id: i }))

export function NativeStyleBenchmark() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')
  const [approach, setApproach] = useState<'rn' | 'tamagui' | 'optimized'>('optimized')
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const renderCountRef = useRef(0)
  const toggleTimesRef = useRef<number[]>([])

  // track parent renders
  renderCountRef.current++

  const toggleTheme = useCallback(() => {
    const start = performance.now()
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    registry.setTheme(newTheme)
    // measure after state update completes
    requestAnimationFrame(() => {
      const end = performance.now()
      toggleTimesRef.current.push(end - start)
    })
  }, [currentTheme])

  const runBenchmark = useCallback(async () => {
    setIsRunning(true)
    renderCountRef.current = 0
    toggleTimesRef.current = []

    // run 20 toggles
    const toggleCount = 20
    for (let i = 0; i < toggleCount; i++) {
      toggleTheme()
      await new Promise((r) => setTimeout(r, 50))
    }

    // calculate results
    await new Promise((r) => setTimeout(r, 200))
    const times = toggleTimesRef.current
    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0

    const result: BenchmarkResult = {
      approach: approach === 'rn' ? 'Regular RN' : approach === 'tamagui' ? 'Regular Tamagui' : 'Optimized',
      avgToggleTime: Math.round(avgTime * 100) / 100,
      renderCount: renderCountRef.current,
      toggleCount,
    }

    setResults((prev) => [...prev, result])
    setIsRunning(false)
  }, [approach, toggleTheme])

  const clearResults = useCallback(() => {
    setResults([])
    renderCountRef.current = 0
    toggleTimesRef.current = []
  }, [])

  const isNative = registry.isNativeModuleAvailable()

  return (
    <Theme name={currentTheme}>
      <YStack flex={1} bg="$background">
        <YStack p="$3" gap="$2">
          <H3>Native Style Benchmark</H3>
          <Text fontSize={12} color="$color11">
            {isNative ? '✅ Native Module Active' : '⚠️ JS Fallback Mode'}
          </Text>

          <XStack gap="$2" flexWrap="wrap">
            <Button
              size="$2"
              theme={approach === 'rn' ? 'blue' : 'gray'}
              onPress={() => setApproach('rn')}
            >
              RN
            </Button>
            <Button
              size="$2"
              theme={approach === 'tamagui' ? 'blue' : 'gray'}
              onPress={() => setApproach('tamagui')}
            >
              Tamagui
            </Button>
            <Button
              size="$2"
              theme={approach === 'optimized' ? 'blue' : 'gray'}
              onPress={() => setApproach('optimized')}
            >
              Optimized
            </Button>
          </XStack>

          <XStack gap="$2">
            <Button
              size="$2"
              onPress={runBenchmark}
              disabled={isRunning}
              testID="run-benchmark-btn"
            >
              {isRunning ? 'Running...' : 'Run Benchmark'}
            </Button>
            <Button size="$2" theme="gray" onPress={clearResults}>
              Clear
            </Button>
            <Button size="$2" theme="gray" onPress={toggleTheme}>
              Toggle
            </Button>
          </XStack>

          {results.length > 0 && (
            <YStack gap="$1" p="$2" bg="$color2" borderRadius="$2">
              <Text fontWeight="bold" fontSize={12}>Results:</Text>
              {results.map((r, i) => (
                <Text key={i} fontSize={11}>
                  {r.approach}: {r.avgToggleTime}ms avg, {r.renderCount} renders
                </Text>
              ))}
            </YStack>
          )}
        </YStack>

        <Separator />

        <Text p="$2" fontSize={12} fontWeight="bold">
          {ITEM_COUNT} items ({approach})
        </Text>

        {approach === 'rn' && (
          <FlatList
            data={listData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <RNListItem index={item.id} isDark={currentTheme === 'dark'} />
            )}
            testID="benchmark-list"
          />
        )}

        {approach === 'tamagui' && (
          <FlatList
            data={listData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <TamaguiListItem index={item.id} />}
            testID="benchmark-list"
          />
        )}

        {approach === 'optimized' && (
          <FlatList
            data={listData}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <OptimizedListItem index={item.id} />}
            testID="benchmark-list"
          />
        )}
      </YStack>
    </Theme>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemLight: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  itemDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444444',
  },
  textLight: {
    color: '#333333',
    fontSize: 14,
  },
  textDark: {
    color: '#f0f0f0',
    fontSize: 14,
  },
})

export default NativeStyleBenchmark
