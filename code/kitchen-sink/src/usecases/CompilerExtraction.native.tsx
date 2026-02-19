const __ReactNativeStyleSheet = require('react-native').StyleSheet
const _sheet = __ReactNativeStyleSheet.create({
  '0': {
    flexDirection: 'column',
    width: 44,
    height: 44,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  '1': {
    flexDirection: 'column',
    width: 44,
    height: 44,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderStyle: 'solid',
  },
  '2': {
    fontSize: 13,
  },
  '3': {
    flexDirection: 'column',
    width: 44,
    height: 44,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  '4': {
    fontSize: 12,
  },
  '5': {
    fontSize: 14,
  },
  '6': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  '7': {
    flexDirection: 'column',
    width: 16,
    height: 16,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderStyle: 'solid',
  },
  '8': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  '9': {
    flexDirection: 'column',
    gap: 7,
    paddingTop: 7,
    paddingRight: 7,
    paddingBottom: 7,
    paddingLeft: 7,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  '10': {
    fontSize: 13,
    fontWeight: 'bold',
  },
  '11': {
    flexDirection: 'row',
    gap: 7,
  },
  '12': {
    flexDirection: 'column',
    gap: 2,
  },
  '13': {
    fontSize: 12,
  },
  '14': {
    fontSize: 12,
  },
  '15': {
    fontSize: 12,
    fontWeight: 'bold',
  },
  '16': {},
  '17': {},
  '18': {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    gap: 18,
  },
  '19': {
    fontSize: 13,
  },
  '20': {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
  },
  '21': {
    fontSize: 13,
    marginTop: 7,
  },
  '22': {
    flexDirection: 'row',
    gap: 7,
  },
  '23': {
    fontSize: 13,
    marginTop: 7,
  },
  '24': {
    flexDirection: 'row',
    gap: 7,
  },
  '25': {
    fontSize: 13,
    marginTop: 7,
  },
  '26': {
    flexDirection: 'row',
    gap: 7,
  },
})
import { _withStableStyle } from '@tamagui/core'
const __ReactNativeView = require('react-native').View
const __ReactNativeText = require('react-native').Text
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
  return <_ReactNativeViewStyled0 testID={'compiler-simple-box'} />
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
    <_ReactNativeViewStyled1 testID={'compiler-advanced-box'}>
      <_ReactNativeTextStyled2 testID={'compiler-advanced-text'}>
        Token
      </_ReactNativeTextStyled2>
    </_ReactNativeViewStyled1>
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
      <_ReactNativeViewStyled3 testID={'compiler-subtheme-box'}>
        <_ReactNativeTextStyled4 testID={'compiler-subtheme-text'}>
          {themeName}
        </_ReactNativeTextStyled4>
      </_ReactNativeViewStyled3>
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
    <_ReactNativeTextStyled5 testID={'compiler-theme-name'}>
      Theme: {themeName}
    </_ReactNativeTextStyled5>
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
      <__ReactNativeView testID={'bench-views'} style={_sheet['6']}>
        {Array.from({
          length: 20,
        }).map((_, i) => (
          <_ReactNativeViewStyled6 key={i} />
        ))}
      </__ReactNativeView>
    )
  }
  return (
    <__ReactNativeView testID={'bench-views'} style={_sheet['8']}>
      {Array.from({
        length: 20,
      }).map((_, i) => (
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
    </__ReactNativeView>
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
    <_ReactNativeViewStyled7>
      <_ReactNativeTextStyled8>
        Perf Benchmark (20 views, best of 3)
      </_ReactNativeTextStyled8>

      <__ReactNativeView style={_sheet['11']}>
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
      </__ReactNativeView>

      {mode !== 'off' && (
        <BenchViews key={runKey} optimized={mode === 'opt'} onMeasure={handleMeasure} />
      )}

      <__ReactNativeView style={_sheet['12']}>
        <_ReactNativeTextStyled9
          testID={'bench-opt-result'}
          accessibilityLabel={
            bestOpt !== null ? `opt:${bestOpt.toFixed(4)}` : 'opt:pending'
          }
        >
          Opt best: {bestOpt !== null ? `${bestOpt.toFixed(2)}ms` : '-'} (
          {optTimes.length} runs)
        </_ReactNativeTextStyled9>
        <_ReactNativeTextStyled10
          testID={'bench-noopt-result'}
          accessibilityLabel={
            bestNoOpt !== null ? `noopt:${bestNoOpt.toFixed(4)}` : 'noopt:pending'
          }
        >
          NoOpt best: {bestNoOpt !== null ? `${bestNoOpt.toFixed(2)}ms` : '-'} (
          {noOptTimes.length} runs)
        </_ReactNativeTextStyled10>
        {pctDiff !== null && (
          <_ReactNativeTextStyled11
            testID={'bench-pct'}
            accessibilityLabel={`pct:${pctDiff.toFixed(2)}`}
            _expressions={[pctDiff > 0]}
          >
            {pctDiff > 0
              ? `Opt ${pctDiff.toFixed(1)}% faster`
              : `NoOpt ${Math.abs(pctDiff).toFixed(1)}% faster`}
          </_ReactNativeTextStyled11>
        )}
      </__ReactNativeView>
    </_ReactNativeViewStyled7>
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
      <_ReactNativeViewStyled12 testID={'compiler-extraction-root'}>
        <ThemeInfo />

        <_ReactNativeTextStyled13 testID={'compiler-mode-label'}>
          Mode: {isDark ? 'dark' : 'light'}
        </_ReactNativeTextStyled13>

        <__ReactNativeView style={_sheet['20']}>
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
        </__ReactNativeView>

        <_ReactNativeTextStyled14>Simple (opt | no-opt):</_ReactNativeTextStyled14>
        <__ReactNativeView style={_sheet['22']}>
          <SimpleBox />
          <SimpleBoxNoOpt />
        </__ReactNativeView>

        <_ReactNativeTextStyled15>
          Advanced $colorN (opt | no-opt):
        </_ReactNativeTextStyled15>
        <__ReactNativeView style={_sheet['24']}>
          <AdvancedBox />
          <AdvancedBoxNoOpt />
        </__ReactNativeView>

        <_ReactNativeTextStyled16 testID={'compiler-subtheme-label'}>
          Sub-theme {subTheme} (opt | no-opt):
        </_ReactNativeTextStyled16>
        <__ReactNativeView style={_sheet['26']}>
          <SubThemedBox themeName={subTheme} />
          <SubThemedBoxNoOpt themeName={subTheme} />
        </__ReactNativeView>

        {showBenchmark && <PerfBenchmark />}
      </_ReactNativeViewStyled12>
    </Theme>
  )
}
const _ReactNativeViewStyled0 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['0'],
    {
      backgroundColor: theme.background.get(),
    },
  ]
)
const _ReactNativeViewStyled1 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['1'],
    {
      backgroundColor: theme.color4.get(),
      borderTopColor: theme.color8.get(),
      borderRightColor: theme.color8.get(),
      borderBottomColor: theme.color8.get(),
      borderLeftColor: theme.color8.get(),
    },
  ]
)
const _ReactNativeTextStyled2 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['2'],
    {
      color: theme.color12.get(),
    },
  ]
)
const _ReactNativeViewStyled3 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['3'],
    {
      backgroundColor: theme.color4.get(),
    },
  ]
)
const _ReactNativeTextStyled4 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['4'],
    {
      color: theme.color12.get(),
    },
  ]
)
const _ReactNativeTextStyled5 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['5'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeViewStyled6 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['7'],
    {
      backgroundColor: theme.color4.get(),
      borderTopColor: theme.color8.get(),
      borderRightColor: theme.color8.get(),
      borderBottomColor: theme.color8.get(),
      borderLeftColor: theme.color8.get(),
    },
  ]
)
const _ReactNativeViewStyled7 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['9'],
    {
      backgroundColor: theme.background.get(),
    },
  ]
)
const _ReactNativeTextStyled8 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['10'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled9 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['13'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled10 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['14'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled11 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['15'],
    {
      color: theme.color.get(),
    },
    _sheet['16'],
    _sheet['17'],
    _expressions[0]
      ? {
          color: theme.green10.get(),
        }
      : {
          color: theme.red10.get(),
        },
  ]
)
const _ReactNativeViewStyled12 = _withStableStyle(
  __ReactNativeView,
  (theme, _expressions) => [
    _sheet['18'],
    {
      backgroundColor: theme.background.get(),
    },
  ]
)
const _ReactNativeTextStyled13 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['19'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled14 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['21'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled15 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['23'],
    {
      color: theme.color.get(),
    },
  ]
)
const _ReactNativeTextStyled16 = _withStableStyle(
  __ReactNativeText,
  (theme, _expressions) => [
    _sheet['25'],
    {
      color: theme.color.get(),
    },
  ]
)
