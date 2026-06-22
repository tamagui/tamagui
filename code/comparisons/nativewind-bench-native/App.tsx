/**
 * NativeWind native bench harness. Same shape as tamagui-bench-native/App.tsx but
 * uses className on RN View via nativewind. Deep-link routed:
 *   exp://HOST/--/?case=<scenarioId>&n=<counter>
 */
import './global.css'
import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { View, Text } from 'react-native'

const HARNESS_URL = 'http://localhost:8091/result'
const ITEM_COUNT = 200
const HEAVY_COUNT = 60

// ── scenarios (mirror web nativewind-bench/src/index.tsx) ───────

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

const richClasses = [
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-indigo-500 active:scale-[0.98] active:opacity-80',
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-green-500 active:scale-[0.98] active:opacity-80',
  'w-[60px] h-10 rounded-md p-1 border border-black/10 m-px bg-pink-500 active:scale-[0.98] active:opacity-80',
]

function RichItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View key={i + seed * ITEM_COUNT} className={richClasses[(i + seed) % 3]} />
      )
    }
    return <>{arr}</>
  }, [seed])
}

function GroupItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className="group flex-row items-center gap-2 p-2 rounded-lg bg-gray-100 m-px"
        >
          <View className="w-8 h-8 rounded-full bg-blue-500" />
          <View className="flex-1">
            <View className="h-2.5 rounded bg-gray-600" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

const heavyColors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-orange-500']

function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = heavyColors[(i + seed) % 4]
      arr.push(
        <View
          key={i + seed * HEAVY_COUNT}
          className="group flex-row items-center gap-3 p-3 rounded-xl border border-gray-200 mb-1"
        >
          <View className={`w-11 h-11 rounded-full ${color}`} />
          <View className="flex-1 gap-1">
            <View
              className="h-3 rounded bg-gray-800"
              style={{ width: 80 + ((i * 17) % 60) }}
            />
            <View
              className="h-2.5 rounded bg-gray-400"
              style={{ width: 120 + ((i * 13) % 80) }}
            />
          </View>
          <View className="px-2 py-0.5 rounded-md bg-blue-100">
            <View className="w-6 h-2 rounded bg-blue-700" />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

function AnimatedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View
          key={i + seed * ITEM_COUNT}
          className="w-6 h-6 rounded m-px bg-blue-500 transition-all duration-200 active:scale-95"
        />
      )
    }
    return <>{arr}</>
  }, [seed])
}

// themed = simple shape with a color class (apples-to-apples vs tamagui's token
// bg). NW has no lighter "theme" path — every className element rides useNativeCss
// (5 hooks), so this measures NW's per-element wrapper cost for a colored view.
function ThemedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(
        <View key={i + seed * ITEM_COUNT} className="w-5 h-5 rounded bg-blue-500 m-px" />
      )
    }
    return <>{arr}</>
  }, [seed])
}

const scenarioComponents: Record<string, (props: { seed: number }) => any> = {
  simple: SimpleItems,
  themed: ThemedItems,
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
  onResult: (result: { mount: number; rerender: number }) => void
}) {
  const [phase, setPhase] = useState<
    'idle' | 'mounting' | 'mounted' | 'rerendering' | 'done'
  >('idle')
  const [seed, setSeed] = useState(0)
  const startRef = useRef(0)
  const mountTimeRef = useRef(0)
  const Component = scenarioComponents[scenarioId]

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
  }, [phase, onResult])

  useEffect(() => {
    const t = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('mounting')
      setSeed(1)
    }, 100)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'idle' || !Component) return null

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}>
      <Component seed={seed} />
    </View>
  )
}

export function App() {
  const url = useURL()
  let caseName: string | null = null
  if (url) {
    try {
      caseName = (Linking.parse(url).queryParams?.case as string) ?? null
    } catch {}
  }
  const valid = caseName && scenarioComponents[caseName] ? caseName : null

  const handleResult = useCallback(
    (result: { mount: number; rerender: number }) => {
      if (!valid) return
      fetch(HARNESS_URL, {
        method: 'POST',
        body: JSON.stringify({
          framework: 'nativewind',
          scenario: valid,
          mount: result.mount,
          rerender: result.rerender,
        }),
      }).catch(() => {})
    },
    [valid]
  )

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: 60,
        alignItems: 'flex-start',
      }}
    >
      {valid ? (
        <View key={url ?? ''}>
          <Text style={{ padding: 8, fontSize: 12, color: '#666' }}>
            nativewind · {valid}
          </Text>
          <BenchRunner scenarioId={valid} onResult={handleResult} />
        </View>
      ) : (
        <Text style={{ padding: 20 }}>
          {caseName ? `unknown case: ${caseName}` : 'waiting for ?case='}
        </Text>
      )}
    </View>
  )
}
