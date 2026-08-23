import { createRoot } from 'react-dom/client'
import { TamaguiProvider, View, styled } from 'tamagui'
import config from './tamagui.config'
import { useState, useLayoutEffect, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  ITEM_COUNT,
  HEAVY_COUNT,
  scenarios,
  renderResults,
  type BenchResult,
} from '../../shared/bench'

const BEHAVIOR_VALIDATION =
  new URLSearchParams(window.location.search).get('behaviorValidation') === '1'

// ── scenario 1: simple (fully static — compiler CAN flatten) ──

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      // all props are static literals — compiler should flatten to div
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="simple"
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

// ── scenario 2: rich (static borders and spacing) ──

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="rich"
          width={60}
          height={40}
          borderRadius={6}
          padding={4}
          borderWidth={1}
          borderColor="rgba(0,0,0,0.1)"
          backgroundColor="rgb(99,102,241)"
          margin={1}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 3: group (nested row layout) ──

function GroupItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="group"
          flexDirection="row"
          alignItems="center"
          gap={8}
          padding={8}
          borderRadius={8}
          backgroundColor="rgb(245,245,245)"
          margin={1}
        >
          <View
            width={32}
            height={32}
            borderRadius={16}
            backgroundColor="rgb(147,197,253)"
          />
          <View flex={1}>
            <View height={10} borderRadius={4} backgroundColor="rgb(115,115,115)" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 4: heavy (realistic card list, nested, mixed) ──

const CARD_COLORS = [
  'rgb(147,197,253)',
  'rgb(134,239,172)',
  'rgb(249,168,212)',
  'rgb(253,186,116)',
]

function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = CARD_COLORS[(i + seed) % 4]
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="heavy"
          flexDirection="row"
          alignItems="center"
          gap={12}
          padding={12}
          borderRadius={10}
          backgroundColor="rgb(250,250,250)"
          borderWidth={1}
          borderColor="rgb(212,212,212)"
          marginBottom={4}
        >
          <View width={44} height={44} borderRadius={22} backgroundColor={color} />
          <View flex={1} gap={4}>
            <View
              height={12}
              borderRadius={4}
              backgroundColor="rgb(64,64,64)"
              width={80 + ((i * 17) % 60)}
            />
            <View
              height={10}
              borderRadius={3}
              backgroundColor="rgb(115,115,115)"
              width={120 + ((i * 13) % 80)}
            />
          </View>
          <View
            paddingHorizontal={8}
            paddingVertical={3}
            borderRadius={6}
            backgroundColor="rgb(219,234,254)"
          >
            <View
              width={24}
              height={8}
              borderRadius={3}
              backgroundColor="rgb(59,130,246)"
            />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

// ── scenario 5: dynamic transition (dynamic values retain the runtime path) ──

function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i}
          data-bench-scenario-item="animated"
          data-bench-dynamic-item={i === 0 ? 'primary' : undefined}
          data-bench-dynamic-seed={seed}
          transition="bouncy"
          width={24}
          height={24}
          borderRadius={4}
          backgroundColor="rgb(59,130,246)"
          margin={1}
          opacity={seed % 2 ? 0.85 : 1}
          scale={seed % 2 ? 0.95 : 1}
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// scenario 6: flat values (runtime grammar, variants, state, and compounds)

const FlatFrame = styled(
  View,
  {
    variants: {
      tone: {
        warm: {
          backgroundColor: 'rgb(253,186,116) web:rgb(249,115,22) hover:rgb(234,88,12)',
        },
        cool: {
          backgroundColor: 'rgb(147,197,253) web:rgb(59,130,246) hover:rgb(37,99,235)',
        },
      },
      elevated: {
        true: {
          borderRadius: '4px web:8px hover:12px',
        },
      },
    },
    compoundVariants: Array.from({ length: 12 }, (_, index) => ({
      tone: index % 2 ? 'warm' : 'cool',
      elevated: true,
      style: {
        borderColor:
          index % 2
            ? 'rgb(154,52,18) web:rgb(124,45,18)'
            : 'rgb(30,64,175) web:rgb(30,58,138)',
        borderWidth: `1px web:${(index % 3) + 1}px`,
      },
    })),
  } as any,
  {
    acceptsClassName: false,
  }
)

function FlatItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <FlatFrame
          key={i}
          data-bench-scenario-item="flat"
          tone={(i + seed) % 2 ? 'warm' : 'cool'}
          elevated
          disabled={(i + seed) % 3 === 0}
          animation="quick"
          width="24px web:28px sm:32px"
          height="24px web:28px hover:30px"
          margin="1px web:2px"
          opacity="1 enter:0.2 disabled:0.5"
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
  flat: FlatItems,
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
      const rerender = () => {
        startRef.current = performance.now()
        setPhase('rerendering')
        setSeed((s) => s + 1)
      }
      if (BEHAVIOR_VALIDATION) {
        setTimeout(rerender, 500)
      } else {
        requestAnimationFrame(rerender)
      }
    } else if (phase === 'rerendering') {
      const rerenderTime = performance.now() - startRef.current
      const finish = () => {
        setPhase('done')
        onResult({ mount: mountTimeRef.current, rerender: rerenderTime })
      }
      if (BEHAVIOR_VALIDATION) {
        setTimeout(finish, 700)
      } else {
        finish()
      }
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
      data-bench-runner-seed={seed}
      style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}
    >
      <Component seed={seed} />
    </div>
  )
}

function App() {
  const requestedScenario = new URLSearchParams(window.location.search).get('scenario')
  const activeScenarios = useMemo(() => {
    if (!requestedScenario) return scenarios
    const selected = scenarios.filter(({ id }) => id === requestedScenario)
    if (!selected.length) {
      throw new Error(`Unknown benchmark scenario: ${requestedScenario}`)
    }
    return selected
  }, [requestedScenario])
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
      const scenarioId = activeScenarios[currentIdx].id
      setResults((prev) => {
        const next = { ...prev, [scenarioId]: result }
        if (currentIdx + 1 >= activeScenarios.length && resultsRef.current) {
          const label =
            new URLSearchParams(window.location.search).get('label') ??
            'Tamagui benchmark'
          renderResults(resultsRef.current, label, next)
        }
        return next
      })
      if (currentIdx + 1 < activeScenarios.length) {
        setTimeout(() => setCurrentIdx((i) => i + 1), 200)
      } else {
        setRunning(false)
      }
    },
    [activeScenarios, currentIdx]
  )

  const currentScenario = running ? activeScenarios[currentIdx] : null

  return (
    <div style={{ padding: 24, color: '#eee', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Tamagui Benchmark</h1>
      <p style={{ color: '#888', margin: '0 0 20px', fontSize: 14 }}>
        {ITEM_COUNT} components × {activeScenarios.length} scenario
        {activeScenarios.length === 1 ? '' : 's'}
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
        {running
          ? `Running ${currentIdx + 1}/${activeScenarios.length}...`
          : 'Run Benchmarks'}
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
  <TamaguiProvider config={config} defaultTheme="light">
    <App />
  </TamaguiProvider>
)
