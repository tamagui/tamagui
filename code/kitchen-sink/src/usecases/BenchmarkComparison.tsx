import React, { useState, useLayoutEffect, useCallback, useMemo } from 'react'
import { View, Text, XStack, YStack, styled, Button } from 'tamagui'

/**
 * three benchmark scenarios comparing tamagui flat-style performance:
 *
 * 1. simple: all flat-style props, fully compilable, no pseudo states
 * 2. rich: mix of compiled + dynamic, pseudo states, media queries
 * 3. animated: SSR-safe with animation="bouncy" + enterStyle/exitStyle
 *
 * each scenario renders N components and measures mount + re-render time.
 * uses className="" output for all — this is what tamagui compiles to.
 */

const ITEM_COUNT = 500

// ── timing infrastructure ──────────────────────────

function BenchResult({ label, ms }: { label: string; ms: number }) {
  const color = ms < 10 ? 'rgb(34,197,94)' : ms < 30 ? 'rgb(234,179,8)' : 'rgb(239,68,68)'
  return (
    <XStack gap={8} alignItems="baseline">
      <Text fontSize={12} color="$color8" width={80}>
        {label}
      </Text>
      <Text fontSize={16} fontWeight="700" color={color} fontFamily="$mono">
        {ms.toFixed(2)}ms
      </Text>
    </XStack>
  )
}

function useBenchmark() {
  const [mountTime, setMountTime] = useState<number | null>(null)
  const [rerenderTime, setRerenderTime] = useState<number | null>(null)
  const startRef = React.useRef(0)
  const phaseRef = React.useRef<'idle' | 'mount' | 'rerender'>('idle')

  const startMount = useCallback(() => {
    startRef.current = performance.now()
    phaseRef.current = 'mount'
  }, [])

  const startRerender = useCallback(() => {
    startRef.current = performance.now()
    phaseRef.current = 'rerender'
  }, [])

  const onLayout = useCallback(() => {
    if (phaseRef.current === 'idle') return
    const elapsed = performance.now() - startRef.current
    if (phaseRef.current === 'mount') {
      setMountTime(elapsed)
    } else {
      setRerenderTime(elapsed)
    }
    phaseRef.current = 'idle'
  }, [])

  return { mountTime, rerenderTime, startMount, startRerender, onLayout }
}

// wrapper that measures layout timing
function TimedContainer({
  onLayout,
  children,
}: {
  onLayout: () => void
  children: React.ReactNode
}) {
  useLayoutEffect(() => {
    onLayout()
  })

  return (
    <View flexDirection="row" flexWrap="wrap" maxWidth={600}>
      {children}
    </View>
  )
}

// ── benchmark 1: simple flat-style (fully compiled) ──

function SimpleItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <View
          key={i}
          {...({
            $width: 20,
            $height: 20,
            $bg: `hsl(${hue}, 70%, 60%)`,
            $rounded: 3,
            $m: 1,
          } as any)}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function SimpleRegularItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <View
          key={i}
          width={20}
          height={20}
          backgroundColor={`hsl(${hue}, 70%, 60%)`}
          borderRadius={3}
          margin={1}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function SimpleInlineItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <div
          key={i}
          style={{
            width: 20,
            height: 20,
            backgroundColor: `hsl(${hue}, 70%, 60%)`,
            borderRadius: 3,
            margin: 1,
          }}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

// ── benchmark 2: rich (mixed compiled + dynamic) ──

const RichCard = styled(View, {
  width: 60,
  height: 40,
  borderRadius: 6,
  padding: 4,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.1)',

  hoverStyle: {
    scale: 1.02,
    borderColor: 'rgba(0,0,0,0.3)',
  },

  pressStyle: {
    scale: 0.98,
    opacity: 0.8,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: 'rgb(99,102,241)',
      },
      secondary: {
        backgroundColor: 'rgb(34,197,94)',
      },
      accent: {
        backgroundColor: 'rgb(236,72,153)',
      },
    },
  } as const,
})

const variants = ['primary', 'secondary', 'accent'] as const

function RichItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const v = variants[(i + seed) % 3]
      arr.push(
        <RichCard
          key={i}
          variant={v}
          margin={1}
          opacity={0.7 + (i % 4) * 0.1}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function RichFlatItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    const colors = ['rgb(99,102,241)', 'rgb(34,197,94)', 'rgb(236,72,153)']
    for (let i = 0; i < ITEM_COUNT; i++) {
      const color = colors[(i + seed) % 3]
      arr.push(
        <View
          key={i}
          {...({
            $width: 60,
            $height: 40,
            $rounded: 6,
            $p: 4,
            $borderWidth: 1,
            $borderColor: 'rgba(0,0,0,0.1)',
            $bg: color,
            $m: 1,
            $o: 0.7 + (i % 4) * 0.1,
            '$hover:scale': 1.02,
            '$hover:borderColor': 'rgba(0,0,0,0.3)',
            '$press:scale': 0.98,
            '$press:o': 0.8,
          } as any)}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function RichInlineItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    const colors = ['rgb(99,102,241)', 'rgb(34,197,94)', 'rgb(236,72,153)']
    for (let i = 0; i < ITEM_COUNT; i++) {
      const color = colors[(i + seed) % 3]
      arr.push(
        <div
          key={i}
          style={{
            width: 60,
            height: 40,
            borderRadius: 6,
            padding: 4,
            border: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: color,
            margin: 1,
            opacity: 0.7 + (i % 4) * 0.1,
          }}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

// ── benchmark 3: animated with transitions ──

const AnimatedBox = styled(View, {
  width: 24,
  height: 24,
  borderRadius: 4,
  backgroundColor: 'rgb(59,130,246)',
  animation: 'bouncy',

  enterStyle: {
    opacity: 0,
    scale: 0.5,
  },

  hoverStyle: {
    backgroundColor: 'rgb(37,99,235)',
    scale: 1.1,
  },

  pressStyle: {
    scale: 0.95,
  },
})

function AnimatedItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <AnimatedBox
          key={i}
          margin={1}
          backgroundColor={`hsl(${hue}, 70%, 60%)`}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function AnimatedFlatItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <View
          key={i}
          animation="bouncy"
          {...({
            $width: 24,
            $height: 24,
            $rounded: 4,
            $bg: `hsl(${hue}, 70%, 60%)`,
            $m: 1,
            '$enter:o': 0,
            '$enter:scale': 0.5,
            '$hover:bg': `hsl(${hue}, 80%, 50%)`,
            '$hover:scale': 1.1,
            '$press:scale': 0.95,
          } as any)}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

function AnimatedInlineItems({ seed }: { seed: number }) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = ((i * 7 + seed) % 360)
      arr.push(
        <div
          key={i}
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: `hsl(${hue}, 70%, 60%)`,
            margin: 1,
            transition: 'all 0.2s ease-in',
          }}
        />
      )
    }
    return arr
  }, [seed])
  return <>{items}</>
}

// ── benchmark runner ────────────────────────────────

type BenchScenario = {
  name: string
  id: string
  renderers: {
    label: string
    id: string
    component: React.FC<{ seed: number }>
  }[]
}

const scenarios: BenchScenario[] = [
  {
    name: '1. Simple (fully compiled)',
    id: 'simple',
    renderers: [
      { label: 'Flat', id: 'flat', component: SimpleItems },
      { label: 'Regular', id: 'regular', component: SimpleRegularItems },
      { label: 'Inline', id: 'inline', component: SimpleInlineItems },
    ],
  },
  {
    name: '2. Rich (variants + pseudo states)',
    id: 'rich',
    renderers: [
      { label: 'Flat', id: 'flat', component: RichFlatItems },
      { label: 'Styled', id: 'styled', component: RichItems },
      { label: 'Inline', id: 'inline', component: RichInlineItems },
    ],
  },
  {
    name: '3. Animated (transitions + enter)',
    id: 'animated',
    renderers: [
      { label: 'Flat', id: 'flat', component: AnimatedFlatItems },
      { label: 'Styled', id: 'styled', component: AnimatedItems },
      { label: 'Inline', id: 'inline', component: AnimatedInlineItems },
    ],
  },
]

function BenchmarkRunner({
  scenario,
  renderer,
}: {
  scenario: BenchScenario
  renderer: BenchScenario['renderers'][0]
}) {
  const [mounted, setMounted] = useState(false)
  const [seed, setSeed] = useState(0)
  const bench = useBenchmark()
  const Component = renderer.component
  const testId = `bench-${scenario.id}-${renderer.id}`

  const handleMount = useCallback(() => {
    bench.startMount()
    setMounted(true)
    setSeed(1)
  }, [bench])

  const handleRerender = useCallback(() => {
    bench.startRerender()
    setSeed((s) => s + 1)
  }, [bench])

  const handleReset = useCallback(() => {
    setMounted(false)
    setSeed(0)
  }, [])

  return (
    <YStack
      gap={8}
      padding={12}
      backgroundColor="$background"
      borderRadius={8}
      borderWidth={1}
      borderColor="$borderColor"
      id={testId}
    >
      <Text fontSize={13} fontWeight="600" color="$color">
        {renderer.label}
      </Text>

      <XStack gap={8}>
        {!mounted ? (
          <Button size="$2" onPress={handleMount} id={`${testId}-mount`}>
            Mount {ITEM_COUNT}
          </Button>
        ) : (
          <>
            <Button size="$2" onPress={handleRerender} id={`${testId}-rerender`}>
              Re-render
            </Button>
            <Button size="$2" theme="alt2" onPress={handleReset} id={`${testId}-reset`}>
              Reset
            </Button>
          </>
        )}
      </XStack>

      <YStack gap={4} id={`${testId}-results`}>
        {bench.mountTime !== null && (
          <BenchResult label="mount" ms={bench.mountTime} />
        )}
        {bench.rerenderTime !== null && (
          <BenchResult label="re-render" ms={bench.rerenderTime} />
        )}
      </YStack>

      {mounted && (
        <TimedContainer onLayout={bench.onLayout}>
          <Component seed={seed} />
        </TimedContainer>
      )}
    </YStack>
  )
}

function AutoBenchmarkRunner({
  scenario,
  renderer,
  onResult,
}: {
  scenario: BenchScenario
  renderer: BenchScenario['renderers'][0]
  onResult: (result: { mount: number; rerender: number }) => void
}) {
  const [phase, setPhase] = useState<'idle' | 'mounting' | 'mounted' | 'rerendering' | 'done'>('idle')
  const [seed, setSeed] = useState(0)
  const startRef = React.useRef(0)
  const mountTimeRef = React.useRef(0)
  const Component = renderer.component

  useLayoutEffect(() => {
    if (phase === 'mounting') {
      mountTimeRef.current = performance.now() - startRef.current
      setPhase('mounted')
    } else if (phase === 'mounted') {
      // trigger rerender after a tick
      requestAnimationFrame(() => {
        startRef.current = performance.now()
        setPhase('rerendering')
        setSeed((s) => s + 1)
      })
    } else if (phase === 'rerendering') {
      const rerenderTime = performance.now() - startRef.current
      setPhase('done')
      onResult({ mount: mountTimeRef.current, rerender: rerenderTime })
    }
  }, [phase])

  React.useEffect(() => {
    // auto-start after a small delay
    const t = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('mounting')
      setSeed(1)
    }, 100)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'idle') return null

  return (
    <View flexDirection="row" flexWrap="wrap" maxWidth={600}>
      <Component seed={seed} />
    </View>
  )
}

// ── auto-run all benchmarks ──────────────────────────

type AllResults = Record<string, Record<string, { mount: number; rerender: number }>>

function AutoBenchAll() {
  const [results, setResults] = useState<AllResults>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [running, setRunning] = useState(false)

  // flatten all scenario/renderer combos
  const allCombos = useMemo(() => {
    const combos: { scenario: BenchScenario; renderer: BenchScenario['renderers'][0] }[] = []
    for (const s of scenarios) {
      for (const r of s.renderers) {
        combos.push({ scenario: s, renderer: r })
      }
    }
    return combos
  }, [])

  const handleStart = useCallback(() => {
    setResults({})
    setCurrentIdx(0)
    setRunning(true)
  }, [])

  const handleResult = useCallback(
    (result: { mount: number; rerender: number }) => {
      const combo = allCombos[currentIdx]
      setResults((prev) => ({
        ...prev,
        [combo.scenario.id]: {
          ...prev[combo.scenario.id],
          [combo.renderer.id]: result,
        },
      }))
      if (currentIdx + 1 < allCombos.length) {
        // small delay between benchmarks for GC
        setTimeout(() => setCurrentIdx((i) => i + 1), 200)
      } else {
        setRunning(false)
      }
    },
    [currentIdx, allCombos]
  )

  const currentCombo = running ? allCombos[currentIdx] : null

  return (
    <YStack gap={16}>
      <Button
        size="$3"
        theme="blue"
        onPress={handleStart}
        disabled={running}
        id="bench-auto-start"
      >
        {running
          ? `Running ${currentIdx + 1}/${allCombos.length}...`
          : 'Run All Benchmarks'}
      </Button>

      {currentCombo && (
        <YStack key={`${currentCombo.scenario.id}-${currentCombo.renderer.id}-${currentIdx}`}>
          <Text fontSize={12} color="$color8">
            Running: {currentCombo.scenario.name} → {currentCombo.renderer.label}
          </Text>
          <AutoBenchmarkRunner
            scenario={currentCombo.scenario}
            renderer={currentCombo.renderer}
            onResult={handleResult}
          />
        </YStack>
      )}

      {/* results table */}
      {Object.keys(results).length > 0 && (
        <YStack
          gap={12}
          padding={16}
          backgroundColor="$background"
          borderRadius={12}
          borderWidth={1}
          borderColor="$borderColor"
          id="bench-results-table"
        >
          <Text fontSize={16} fontWeight="700" color="$color">
            Results ({ITEM_COUNT} components)
          </Text>

          {scenarios.map((scenario) => {
            const sResults = results[scenario.id]
            if (!sResults) return null
            return (
              <YStack key={scenario.id} gap={6}>
                <Text fontSize={13} fontWeight="600" color="$color">
                  {scenario.name}
                </Text>
                <XStack gap={16} flexWrap="wrap">
                  {scenario.renderers.map((r) => {
                    const rr = sResults[r.id]
                    if (!rr) return null
                    return (
                      <YStack key={r.id} gap={2} minWidth={120}>
                        <Text fontSize={11} color="$color8">
                          {r.label}
                        </Text>
                        <Text
                          fontSize={14}
                          fontWeight="600"
                          fontFamily="$mono"
                          color="$color"
                          id={`bench-result-${scenario.id}-${r.id}-mount`}
                          data-value={rr.mount.toFixed(2)}
                        >
                          mount: {rr.mount.toFixed(2)}ms
                        </Text>
                        <Text
                          fontSize={14}
                          fontWeight="600"
                          fontFamily="$mono"
                          color="$color"
                          id={`bench-result-${scenario.id}-${r.id}-rerender`}
                          data-value={rr.rerender.toFixed(2)}
                        >
                          re-render: {rr.rerender.toFixed(2)}ms
                        </Text>
                      </YStack>
                    )
                  })}
                </XStack>
              </YStack>
            )
          })}
        </YStack>
      )}
    </YStack>
  )
}

// ── main export ──────────────────────────────────────

export function BenchmarkComparison() {
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')

  return (
    <YStack padding={24} gap={24} backgroundColor="$background" minHeight="100vh">
      <YStack gap={4}>
        <Text fontSize={24} fontWeight="bold" color="$color">
          Benchmark Comparison
        </Text>
        <Text fontSize={14} color="$color8">
          {ITEM_COUNT} components × 3 scenarios × 3 renderers
        </Text>
      </YStack>

      <XStack gap={8}>
        <Button
          size="$2"
          theme={mode === 'auto' ? 'blue' : undefined}
          onPress={() => setMode('auto')}
        >
          Auto
        </Button>
        <Button
          size="$2"
          theme={mode === 'manual' ? 'blue' : undefined}
          onPress={() => setMode('manual')}
        >
          Manual
        </Button>
      </XStack>

      {mode === 'auto' ? (
        <AutoBenchAll />
      ) : (
        <YStack gap={24}>
          {scenarios.map((scenario) => (
            <YStack key={scenario.id} gap={12}>
              <Text fontSize={18} fontWeight="bold" color="$color">
                {scenario.name}
              </Text>
              <XStack gap={12} flexWrap="wrap">
                {scenario.renderers.map((renderer) => (
                  <BenchmarkRunner
                    key={renderer.id}
                    scenario={scenario}
                    renderer={renderer}
                  />
                ))}
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  )
}
