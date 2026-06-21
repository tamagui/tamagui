import './global.css'
import { createRoot } from 'react-dom/client'
import { View } from 'react-native'
import { useState, useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import { ITEM_COUNT, HEAVY_COUNT, scenarios, renderResults, type BenchResult } from '../../shared/bench'

// ── scenario 1: simple ───────────────────────────────

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className="w-5 h-5 rounded bg-indigo-500 m-px"
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 2: rich ─────────────────────────────────

const richClasses = [
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] active:opacity-80',
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-green-500 hover:scale-[1.02] active:scale-[0.98] active:opacity-80',
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-pink-500 hover:scale-[1.02] active:scale-[0.98] active:opacity-80',
]

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className={richClasses[(i + seed) % 3]}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 3: group ────────────────────────────────

function GroupItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className="group flex-row items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 m-px"
        >
          <View className="w-8 h-8 rounded-full bg-blue-500 group-hover:bg-blue-700" />
          <View className="flex-1">
            <View className="h-2.5 rounded bg-gray-600 group-hover:bg-blue-600" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 4: heavy ────────────────────────────────

const heavyColors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500']

function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = heavyColors[(i + seed) % 4]
      arr.push(
        <View
          key={i + seed * HEAVY_COUNT}
          className="group flex-row items-center gap-3 p-3 rounded-xl border border-gray-200 mb-1 hover:bg-gray-50 hover:border-gray-400"
        >
          <View className={`w-11 h-11 rounded-full group-hover:opacity-80 ${color}`} />
          <View className="flex-1 gap-1">
            <View className="h-3 rounded bg-gray-800 group-hover:bg-blue-800" style={{ width: 80 + ((i * 17) % 60) }} />
            <View className="h-2.5 rounded bg-gray-400" style={{ width: 120 + ((i * 13) % 80) }} />
          </View>
          <View className="px-2 py-0.5 rounded-md bg-blue-100 group-hover:bg-blue-300">
            <View className="w-6 h-2 rounded bg-blue-700" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 5: animated ─────────────────────────────

function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className="w-6 h-6 rounded m-px bg-blue-500 transition-all duration-200 hover:scale-110 active:scale-95"
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
  const [phase, setPhase] = useState<'idle' | 'mounting' | 'mounted' | 'rerendering' | 'done'>('idle')
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
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}>
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
          renderResults(resultsRef.current, 'NativeWind v5', next)
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
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>NativeWind v5 Benchmark</h1>
      <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
        {ITEM_COUNT} components × {scenarios.length} scenarios · className on RN View
      </p>
      <button
        id="bench-start"
        onClick={handleStart}
        disabled={running}
        style={{
          padding: '8px 20px', fontSize: 14, borderRadius: 6,
          border: 'none', background: '#f472b6', color: 'white', cursor: 'pointer', marginBottom: 16,
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

createRoot(document.getElementById('root')!).render(<App />)
