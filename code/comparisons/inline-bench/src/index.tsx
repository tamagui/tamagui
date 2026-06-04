import { createRoot } from 'react-dom/client'
import { useState, useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import { ITEM_COUNT, scenarios, renderResults, type BenchResult } from '../../shared/bench'

// ── scenario 1: simple ───────────────────────────────

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <div
          key={i + seed * ITEM_COUNT}
          style={{
            width: 20,
            height: 20,
            backgroundColor: 'rgb(99,102,241)',
            borderRadius: 3,
            margin: 1,
          }}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 2: rich ─────────────────────────────────

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <div
          key={i + seed * ITEM_COUNT}
          style={{
            width: 60,
            height: 40,
            borderRadius: 6,
            padding: 4,
            border: '1px solid rgba(0,0,0,0.1)',
            backgroundColor: 'rgb(99,102,241)',
            margin: 1,
          }}
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
      arr.push(
        <div
          key={i + seed * ITEM_COUNT}
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            backgroundColor: 'rgb(59,130,246)',
            margin: 1,
            transition: 'all 0.2s ease-in',
          }}
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
          renderResults(resultsRef.current, 'Inline (baseline)', next)
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
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Inline Benchmark (baseline)</h1>
      <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
        {ITEM_COUNT} components × {scenarios.length} scenarios · raw div + style
      </p>
      <button
        id="bench-start"
        onClick={handleStart}
        disabled={running}
        style={{
          padding: '8px 20px', fontSize: 14, borderRadius: 6,
          border: 'none', background: '#666', color: 'white', cursor: 'pointer', marginBottom: 16,
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
