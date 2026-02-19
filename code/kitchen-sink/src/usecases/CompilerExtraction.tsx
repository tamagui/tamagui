/**
 * Tests compiler extraction with various scenarios:
 * - Simple extraction (static values)
 * - Advanced extraction ($color tokens)
 * - Light/dark mode switching
 * - Sub-theme changes
 * - Performance benchmark (20 views opt vs no-opt)
 *
 * Add a "// debug" comment for extraction debug output during build.
 * If extraction is working, the build output will show optimized styles.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { Button, Text, Theme, XStack, YStack, useThemeName } from 'tamagui'

// simple extracted component - static values only
function SimpleBox() {
  return (
    <YStack
      testID="compiler-simple-box"
      width={44}
      height={44}
      padding="$4"
      borderRadius={8}
      backgroundColor="$background"
    />
  )
}

// non-optimized version for comparison
function SimpleBoxNoOpt() {
  return (
    <YStack
      disableOptimization
      testID="compiler-simple-box-noopt"
      width={44}
      height={44}
      padding="$4"
      borderRadius={8}
      backgroundColor="$background"
    />
  )
}

// advanced extracted component - uses $colorN tokens
function AdvancedBox() {
  return (
    <YStack
      testID="compiler-advanced-box"
      width={44}
      height={44}
      padding="$4"
      borderRadius={8}
      backgroundColor="$color4"
      borderColor="$color8"
      borderWidth={2}
    >
      <Text testID="compiler-advanced-text" color="$color12" fontSize="$3">
        Token
      </Text>
    </YStack>
  )
}

// non-optimized version for comparison
function AdvancedBoxNoOpt() {
  return (
    <YStack
      disableOptimization
      testID="compiler-advanced-box-noopt"
      width={44}
      height={44}
      padding="$4"
      borderRadius={8}
      backgroundColor="$color4"
      borderColor="$color8"
      borderWidth={2}
    >
      <Text
        disableOptimization
        testID="compiler-advanced-text-noopt"
        color="$color12"
        fontSize="$3"
      >
        Token
      </Text>
    </YStack>
  )
}

// sub-themed component
function SubThemedBox({ themeName }: { themeName: string }) {
  return (
    <Theme name={themeName as any}>
      <YStack
        testID="compiler-subtheme-box"
        width={44}
        height={44}
        padding="$4"
        borderRadius={8}
        backgroundColor="$color4"
      >
        <Text testID="compiler-subtheme-text" color="$color12" fontSize="$2">
          {themeName}
        </Text>
      </YStack>
    </Theme>
  )
}

// non-optimized version for comparison
function SubThemedBoxNoOpt({ themeName }: { themeName: string }) {
  return (
    <Theme name={themeName as any}>
      <YStack
        disableOptimization
        testID="compiler-subtheme-box-noopt"
        width={44}
        height={44}
        padding="$4"
        borderRadius={8}
        backgroundColor="$color4"
      >
        <Text
          disableOptimization
          testID="compiler-subtheme-text-noopt"
          color="$color12"
          fontSize="$2"
        >
          {themeName}
        </Text>
      </YStack>
    </Theme>
  )
}

// displays current theme info
function ThemeInfo() {
  const themeName = useThemeName()
  return (
    <Text testID="compiler-theme-name" fontSize="$4">
      Theme: {themeName}
    </Text>
  )
}

// benchmark views - 20 each
function BenchViews({
  optimized,
  onMeasure,
}: {
  optimized: boolean
  onMeasure: (ms: number) => void
}) {
  const startTime = useRef(performance.now())
  const measured = useRef(false)

  useLayoutEffect(() => {
    if (!measured.current) {
      measured.current = true
      onMeasure(performance.now() - startTime.current)
    }
  }, [onMeasure])

  if (optimized) {
    return (
      <YStack testID="bench-views" flexDirection="row" flexWrap="wrap" gap={2}>
        {Array.from({ length: 20 }).map((_, i) => (
          <YStack
            key={i}
            width={16}
            height={16}
            backgroundColor="$color4"
            borderColor="$color8"
            borderWidth={1}
            borderRadius={2}
          />
        ))}
      </YStack>
    )
  }

  return (
    <YStack testID="bench-views" flexDirection="row" flexWrap="wrap" gap={2}>
      {Array.from({ length: 20 }).map((_, i) => (
        <YStack
          disableOptimization
          key={i}
          width={16}
          height={16}
          backgroundColor="$color4"
          borderColor="$color8"
          borderWidth={1}
          borderRadius={2}
        />
      ))}
    </YStack>
  )
}

type BenchMode = 'off' | 'opt' | 'noopt'

function PerfBenchmark() {
  const [mode, setMode] = useState<BenchMode>('off')
  const [optTimes, setOptTimes] = useState<number[]>([])
  const [noOptTimes, setNoOptTimes] = useState<number[]>([])
  const [runKey, setRunKey] = useState(0)

  const runOpt = () => {
    setMode('opt')
    setRunKey((k) => k + 1)
  }
  const runNoOpt = () => {
    setMode('noopt')
    setRunKey((k) => k + 1)
  }
  const reset = () => {
    setMode('off')
    setOptTimes([])
    setNoOptTimes([])
  }

  const handleMeasure = (ms: number) => {
    if (mode === 'opt') {
      setOptTimes((t) => [...t, ms])
    } else if (mode === 'noopt') {
      setNoOptTimes((t) => [...t, ms])
    }
    setMode('off')
  }

  const bestOpt = optTimes.length ? Math.min(...optTimes) : null
  const bestNoOpt = noOptTimes.length ? Math.min(...noOptTimes) : null
  const pctDiff = bestOpt && bestNoOpt ? ((bestNoOpt - bestOpt) / bestNoOpt) * 100 : null

  return (
    <YStack gap="$2" padding="$2" backgroundColor="$background" borderRadius={8}>
      <Text fontSize="$3" fontWeight="bold">
        Perf Benchmark (20 views, best of 3)
      </Text>

      <XStack gap="$2">
        <Button
          size="$2"
          testID="bench-run-opt"
          onPress={runOpt}
          disabled={mode !== 'off'}
        >
          Run Opt ({optTimes.length}/3)
        </Button>
        <Button
          size="$2"
          testID="bench-run-noopt"
          onPress={runNoOpt}
          disabled={mode !== 'off'}
        >
          Run NoOpt ({noOptTimes.length}/3)
        </Button>
        <Button size="$2" testID="bench-reset" onPress={reset}>
          Reset
        </Button>
      </XStack>

      {mode !== 'off' && (
        <BenchViews key={runKey} optimized={mode === 'opt'} onMeasure={handleMeasure} />
      )}

      <YStack gap="$1">
        <Text
          testID="bench-opt-result"
          accessibilityLabel={
            bestOpt !== null ? `opt:${bestOpt.toFixed(4)}` : 'opt:pending'
          }
          fontSize="$2"
        >
          Opt best: {bestOpt !== null ? `${bestOpt.toFixed(2)}ms` : '-'} (
          {optTimes.length} runs)
        </Text>
        <Text
          testID="bench-noopt-result"
          accessibilityLabel={
            bestNoOpt !== null ? `noopt:${bestNoOpt.toFixed(4)}` : 'noopt:pending'
          }
          fontSize="$2"
        >
          NoOpt best: {bestNoOpt !== null ? `${bestNoOpt.toFixed(2)}ms` : '-'} (
          {noOptTimes.length} runs)
        </Text>
        {pctDiff !== null && (
          <Text
            testID="bench-pct"
            accessibilityLabel={`pct:${pctDiff.toFixed(2)}`}
            fontSize="$2"
            fontWeight="bold"
            color={pctDiff > 0 ? '$green10' : '$red10'}
          >
            {pctDiff > 0
              ? `Opt ${pctDiff.toFixed(1)}% faster`
              : `NoOpt ${Math.abs(pctDiff).toFixed(1)}% faster`}
          </Text>
        )}
      </YStack>
    </YStack>
  )
}

export function CompilerExtraction() {
  const [isDark, setIsDark] = useState(false)
  const [subTheme, setSubTheme] = useState<'red' | 'blue' | 'green'>('red')
  const [showBenchmark, setShowBenchmark] = useState(false)

  const toggleTheme = () => setIsDark((d) => !d)
  const cycleSubTheme = () => {
    setSubTheme((t) => {
      if (t === 'red') return 'blue'
      if (t === 'blue') return 'green'
      return 'red'
    })
  }

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <YStack
        testID="compiler-extraction-root"
        flex={1}
        padding="$4"
        gap="$4"
        backgroundColor="$background"
      >
        <ThemeInfo />

        <Text testID="compiler-mode-label" fontSize="$3">
          Mode: {isDark ? 'dark' : 'light'}
        </Text>

        <XStack gap="$2" flexWrap="wrap">
          <Button size="$2" testID="compiler-toggle-mode" onPress={toggleTheme}>
            Toggle Mode
          </Button>
          <Button size="$2" testID="compiler-cycle-subtheme" onPress={cycleSubTheme}>
            Cycle Theme
          </Button>
          <Button
            size="$2"
            testID="compiler-toggle-bench"
            onPress={() => setShowBenchmark((s) => !s)}
          >
            {showBenchmark ? 'Hide' : 'Show'} Bench
          </Button>
        </XStack>

        <Text fontSize="$3" marginTop="$2">
          Simple (opt | no-opt):
        </Text>
        <XStack gap="$2">
          <SimpleBox />
          <SimpleBoxNoOpt />
        </XStack>

        <Text fontSize="$3" marginTop="$2">
          Advanced $colorN (opt | no-opt):
        </Text>
        <XStack gap="$2">
          <AdvancedBox />
          <AdvancedBoxNoOpt />
        </XStack>

        <Text testID="compiler-subtheme-label" fontSize="$3" marginTop="$2">
          Sub-theme {subTheme} (opt | no-opt):
        </Text>
        <XStack gap="$2">
          <SubThemedBox themeName={subTheme} />
          <SubThemedBoxNoOpt themeName={subTheme} />
        </XStack>

        {showBenchmark && <PerfBenchmark />}
      </YStack>
    </Theme>
  )
}
