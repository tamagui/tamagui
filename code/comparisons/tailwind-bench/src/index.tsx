import './tailwind.css'
import { createRoot } from 'react-dom/client'
import { useState, useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import { ITEM_COUNT, scenarios, renderResults, type BenchResult } from '../../shared/bench'

// ── scenario 1: simple ───────────────────────────────
// tailwind: all styles are static CSS classes, zero runtime cost

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = (i * 7 + seed) % 360
      // tailwind can't do dynamic hsl, so use inline style for bg only
      arr.push(
        <div
          key={i}
          className="w-5 h-5 rounded m-px"
          style={{ backgroundColor: `hsl(${hue}, 70%, 60%)` }}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 2: rich ─────────────────────────────────

const twColors = [
  'bg-indigo-500 hover:bg-indigo-600',
  'bg-green-500 hover:bg-green-600',
  'bg-pink-500 hover:bg-pink-600',
]

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const colorClass = twColors[(i + seed) % 3]
      arr.push(
        <div
          key={i}
          className={`w-[60px] h-10 rounded-md p-1 border border-black/10 m-px hover:scale-[1.02] active:scale-[0.98] active:opacity-80 transition-transform ${colorClass}`}
          style={{ opacity: 0.7 + (i % 4) * 0.1 }}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 3: animated ─────────────────────────────

function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      const hue = (i * 7 + seed) % 360
      arr.push(
        <div
          key={i}
          className="w-6 h-6 rounded m-px transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ backgroundColor: `hsl(${hue}, 70%, 60%)` }}
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
          renderResults(resultsRef.current, 'Tailwind CSS', next)
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
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Tailwind CSS Benchmark</h1>
      <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
        {ITEM_COUNT} components × {scenarios.length} scenarios · pure CSS classes
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
          background: '#06b6d4',
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

createRoot(document.getElementById('root')!).render(<App />)
