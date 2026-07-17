import { createRoot } from 'react-dom/client'
import { TamaguiProvider, View } from 'tamagui'
import config from './tamagui.config'
import { useState, useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  ITEM_COUNT,
  HEAVY_COUNT,
  scenarios as allScenarios,
  renderResults,
  type BenchResult,
} from '../../shared/bench'

// allow a URL ?skip=group,heavy to skip selected scenarios (runtime variant uses this).
const skipSet = new Set(
  (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('skip')
    : null
  )
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? []
)
const scenarios = allScenarios.filter((s) => !skipSet.has(s.id))

// ── scenario 1: simple (fully static — compiler CAN flatten) ──

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      // all props are static literals — compiler should flatten to div
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          width={20}
          height={20}
          backgroundColor="rgb(99,102,241)"
          borderRadius={3}
          margin={1}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 2: rich (static props + pseudo states) ──

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          width={60}
          height={40}
          borderRadius={6}
          padding={4}
          borderWidth={1}
          borderColor="rgba(0,0,0,0.1)"
          backgroundColor="rgb(99,102,241)"
          margin={1}
          hoverStyle={{ scale: 1.02, borderColor: 'rgba(0,0,0,0.3)' }}
          pressStyle={{ scale: 0.98, opacity: 0.8 }}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 3: group (parent group state affects child styles) ──

function GroupItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          group="row"
          flexDirection="row"
          alignItems="center"
          gap={8}
          padding={8}
          borderRadius={8}
          backgroundColor="$gray2"
          hoverStyle={{ backgroundColor: '$gray3' }}
          margin={1}
        >
          <View
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor="$blue5"
            $group-row-hover:backgroundColor="$blue7"
          />
          <View flex={1}>
            <View
              height={10}
              borderRadius={4}
              backgroundColor="$gray8"
              $group-row-hover:backgroundColor="$blue8"
            />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 4: heavy (realistic card list, nested, mixed) ──

const CARD_COLORS = ['$blue5', '$green5', '$pink5', '$orange5']

function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = CARD_COLORS[(i + seed) % 4]
      arr.push(
        <View
          key={i + seed * HEAVY_COUNT}
          group="card"
          flexDirection="row"
          alignItems="center"
          gap={12}
          padding={12}
          borderRadius={10}
          backgroundColor="$gray1"
          borderWidth={1}
          borderColor="$gray4"
          marginBottom={4}
          hoverStyle={{ backgroundColor: '$gray2', borderColor: '$gray6' }}
        >
          <View
            width={44}
            height={44}
            borderRadius={22}
            backgroundColor={color}
            $group-card-hover:opacity={0.8}
          />
          <View flex={1} gap={4}>
            <View
              height={12}
              borderRadius={4}
              backgroundColor="$gray11"
              width={80 + ((i * 17) % 60)}
              $group-card-hover:backgroundColor="$blue9"
            />
            <View
              height={10}
              borderRadius={3}
              backgroundColor="$gray8"
              width={120 + ((i * 13) % 80)}
            />
          </View>
          <View
            paddingHorizontal={8}
            paddingVertical={3}
            borderRadius={6}
            backgroundColor="$blue3"
            $group-card-hover:backgroundColor="$blue5"
          >
            <View width={24} height={8} borderRadius={3} backgroundColor="$blue9" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 5: animated (always deopts — transition prop) ──

function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          transition="bouncy"
          width={24}
          height={24}
          borderRadius={4}
          backgroundColor="rgb(59,130,246)"
          margin={1}
          enterStyle={{ opacity: 0, scale: 0.5 }}
          hoverStyle={{ scale: 1.1 }}
          pressStyle={{ scale: 0.95 }}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── runner ────────────────────────────────────────────

const scenarioComponents = {
  simple: SimpleItems,
  rich: RichItems,
  group: GroupItems,
  heavy: HeavyItems,
  animated: AnimatedItems,
}

function BenchRunner({
  scenarioId,
  onResult,
}: {
  scenarioId: string
  onResult: (result: BenchResult) => void
}) {
  const [phase, setPhase] = useState<
    'idle' | 'mounting' | 'mounted' | 'rerendering' | 'done'
  >('idle')
  const [seed, setSeed] = useState(0)
  const startRef = useRef(0)
  const mountTimeRef = useRef(0)
  const Component = scenarioComponents[scenarioId as keyof typeof scenarioComponents]

  useLayoutEffect(() => {
    if (phase === 'mounting') {
      mountTimeRef.current = performance.now() - startRef.current
      setPhase('mounted')
    } else if (phase === 'mounted') {
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

  useEffect(() => {
    const t = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('mounting')
      setSeed(1)
    }, 100)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'idle') return null

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}
    >
      <Component seed={seed} />
    </div>
  )
}

function App() {
  const [results, setResults] = useState<Record<string, BenchResult>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleStart = useCallback(() => {
    setResults({})
    setCurrentIdx(0)
    setRunning(true)
  }, [])

  const handleResult = useCallback(
    (result: BenchResult) => {
      const scenarioId = scenarios[currentIdx].id
      setResults((prev) => {
        const next = { ...prev, [scenarioId]: result }
        if (currentIdx + 1 >= scenarios.length && resultsRef.current) {
          // label reflects the runtime vs compiled variant for in-page debugging.
          const label =
            new URLSearchParams(window.location.search).get('scale') != null
              ? `Tamagui (runtime, ${ITEM_COUNT}x)`
              : 'Tamagui (compiled)'
          renderResults(resultsRef.current, label, next)
        }
        return next
      })
      if (currentIdx + 1 < scenarios.length) {
        setTimeout(() => setCurrentIdx((i) => i + 1), 200)
      } else {
        setRunning(false)
      }
    },
    [currentIdx]
  )

  const currentScenario = running ? scenarios[currentIdx] : null

  return (
    <div style={{ padding: 24, color: '#eee', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Tamagui Benchmark</h1>
      <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
        {ITEM_COUNT} components × {scenarios.length} scenarios
      </p>

      <button
        id="bench-start"
        onClick={handleStart}
        disabled={running}
        style={{
          padding: '8px 20px',
          fontSize: 14,
          borderRadius: 6,
          border: 'none',
          background: '#3b82f6',
          color: 'white',
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        {running ? `Running ${currentIdx + 1}/${scenarios.length}...` : 'Run Benchmarks'}
      </button>

      {currentScenario && (
        <div key={`${currentScenario.id}-${currentIdx}`}>
          <p style={{ fontSize: 12, color: '#888' }}>Running: {currentScenario.name}</p>
          <BenchRunner scenarioId={currentScenario.id} onResult={handleResult} />
        </div>
      )}

      <div ref={resultsRef} style={{ marginTop: 16 }} />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <TamaguiProvider config={config}>
    <App />
  </TamaguiProvider>
)
