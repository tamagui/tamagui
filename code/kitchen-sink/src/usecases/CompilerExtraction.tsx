/**
 * Tests compiler extraction with various scenarios:
 * - Simple extraction (static values)
 * - Advanced extraction ($color tokens)
 * - Light/dark mode switching
 * - Sub-theme changes
 * - Performance benchmark (warmup + shuffled median sampling)
 *
 * Add a "// debug" comment for extraction debug output during build.
 * If extraction is working, the build output will show optimized styles.
 */

import { useLayoutEffect, useRef, useState } from 'react'
import { Text, Theme, XStack, YStack, useThemeName } from 'tamagui'
import { Button } from '../components/Button'

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

type BenchMode = 'opt' | 'noopt'
type BenchScenario = 'simple' | 'nested'

const simpleBenchItems = Array.from({ length: 200 }, (_, index) => index)
const nestedBenchItems = Array.from({ length: 60 }, (_, index) => index)

function OptimizedSimpleBenchItem() {
  return (
    <YStack
      width={16}
      height={16}
      backgroundColor="$color4"
      borderColor="$color8"
      borderWidth={1}
      borderRadius={2}
    />
  )
}

function UnoptimizedSimpleBenchItem() {
  return (
    <YStack
      disableOptimization
      width={16}
      height={16}
      backgroundColor="$color4"
      borderColor="$color8"
      borderWidth={1}
      borderRadius={2}
    />
  )
}

function OptimizedNestedBenchItem({ index }: { index: number }) {
  return (
    <XStack gap={2} alignItems="center">
      <YStack
        width={16}
        height={16}
        backgroundColor="$color4"
        borderColor="$color8"
        borderWidth={1}
        borderRadius={2}
      />
      <Text color="$color12" fontSize="$2">
        Row {index}
      </Text>
    </XStack>
  )
}

function UnoptimizedNestedBenchItem({ index }: { index: number }) {
  return (
    <XStack disableOptimization gap={2} alignItems="center">
      <YStack
        disableOptimization
        width={16}
        height={16}
        backgroundColor="$color4"
        borderColor="$color8"
        borderWidth={1}
        borderRadius={2}
      />
      <Text disableOptimization color="$color12" fontSize="$2">
        Row {index}
      </Text>
    </XStack>
  )
}

function BenchViews({
  mode,
  scenario,
  onMeasure,
}: {
  mode: BenchMode
  scenario: BenchScenario
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

  if (scenario === 'simple') {
    if (mode === 'opt') {
      return (
        <YStack testID="bench-views" flexDirection="row" flexWrap="wrap" gap={2}>
          {simpleBenchItems.map((index) => (
            <OptimizedSimpleBenchItem key={index} />
          ))}
        </YStack>
      )
    }
    return (
      <YStack testID="bench-views" flexDirection="row" flexWrap="wrap" gap={2}>
        {simpleBenchItems.map((index) => (
          <UnoptimizedSimpleBenchItem key={index} />
        ))}
      </YStack>
    )
  }

  if (mode === 'opt') {
    return (
      <YStack testID="bench-views" gap={2}>
        {nestedBenchItems.map((index) => (
          <OptimizedNestedBenchItem key={index} index={index} />
        ))}
      </YStack>
    )
  }

  return (
    <YStack testID="bench-views" gap={2}>
      {nestedBenchItems.map((index) => (
        <UnoptimizedNestedBenchItem key={index} index={index} />
      ))}
    </YStack>
  )
}

type BenchSamples = Record<BenchScenario, Record<BenchMode, number[]>>

function emptyBenchSamples(): BenchSamples {
  return {
    simple: { opt: [], noopt: [] },
    nested: { opt: [], noopt: [] },
  }
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[middle - 1]! + sorted[middle]!) / 2
    : sorted[middle]!
}

function PerfBenchmark() {
  const [active, setActive] = useState<{
    mode: BenchMode
    scenario: BenchScenario
  } | null>(null)
  const [samples, setSamples] = useState<BenchSamples>(emptyBenchSamples)
  const [runKey, setRunKey] = useState(0)

  const run = (scenario: BenchScenario, mode: BenchMode) => {
    setActive({ scenario, mode })
    setRunKey((k) => k + 1)
  }
  const reset = () => {
    setActive(null)
    setSamples(emptyBenchSamples())
  }

  const handleMeasure = (ms: number) => {
    if (!active) return
    const { mode, scenario } = active
    setSamples((current) => ({
      ...current,
      [scenario]: {
        ...current[scenario],
        [mode]: [...current[scenario][mode], ms],
      },
    }))
    setActive(null)
  }

  return (
    <YStack gap="$2" padding="$2" backgroundColor="$background" borderRadius={8}>
      <Text fontSize="$3" fontWeight="bold">
        Perf Benchmark (warmup + median of 7)
      </Text>

      <XStack gap="$2" flexWrap="wrap">
        {(['simple', 'nested'] as const).flatMap((scenario) =>
          (['opt', 'noopt'] as const).map((mode) => (
            <Button
              key={`${scenario}-${mode}`}
              size="small"
              testID={`bench-run-${scenario}-${mode}`}
              onPress={() => run(scenario, mode)}
              disabled={active !== null}
            >
              {scenario} {mode} ({samples[scenario][mode].length})
            </Button>
          ))
        )}
        <Button size="small" testID="bench-reset" onPress={reset}>
          Reset
        </Button>
      </XStack>

      {active && (
        <BenchViews
          key={runKey}
          mode={active.mode}
          scenario={active.scenario}
          onMeasure={handleMeasure}
        />
      )}

      <YStack gap="$1">
        {(['simple', 'nested'] as const).map((scenario) => {
          const optMedian = median(samples[scenario].opt)
          const noOptMedian = median(samples[scenario].noopt)
          const pctDiff =
            optMedian !== null && noOptMedian !== null
              ? ((noOptMedian - optMedian) / noOptMedian) * 100
              : null
          return (
            <YStack key={scenario} gap="$1">
              {(['opt', 'noopt'] as const).map((mode) => {
                const value = mode === 'opt' ? optMedian : noOptMedian
                return (
                  <YStack key={mode} gap="$1">
                    <Text
                      testID={`bench-${scenario}-${mode}-result`}
                      accessibilityLabel={`${scenario}:${mode}:${value?.toFixed(4) ?? 'pending'}`}
                      fontSize="$2"
                    >
                      {scenario} {mode} median:{' '}
                      {value !== null ? `${value.toFixed(2)}ms` : '-'} (
                      {samples[scenario][mode].length} samples)
                    </Text>
                    <Text
                      testID={`bench-${scenario}-${mode}-count`}
                      accessibilityLabel={`count:${samples[scenario][mode].length}`}
                      fontSize="$2"
                    >
                      {scenario} {mode} samples: {samples[scenario][mode].length}
                    </Text>
                  </YStack>
                )
              })}
              <Text
                testID={`bench-${scenario}-count`}
                accessibilityLabel={`count:${Math.min(samples[scenario].opt.length, samples[scenario].noopt.length)}`}
                fontSize="$2"
              >
                {scenario} paired samples:{' '}
                {Math.min(samples[scenario].opt.length, samples[scenario].noopt.length)}
              </Text>
              {pctDiff !== null && (
                <Text
                  testID={`bench-${scenario}-pct`}
                  accessibilityLabel={`${scenario}:pct:${pctDiff.toFixed(2)}`}
                  fontSize="$2"
                  fontWeight="bold"
                  color={pctDiff > 0 ? '$green10' : '$red10'}
                >
                  {scenario}:{' '}
                  {pctDiff > 0
                    ? `Opt ${pctDiff.toFixed(1)}% faster`
                    : `NoOpt ${Math.abs(pctDiff).toFixed(1)}% faster`}
                </Text>
              )}
            </YStack>
          )
        })}
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
          <Button size="small" testID="compiler-toggle-mode" onPress={toggleTheme}>
            Toggle Mode
          </Button>
          <Button size="small" testID="compiler-cycle-subtheme" onPress={cycleSubTheme}>
            Cycle Theme
          </Button>
          <Button
            size="small"
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
