/**
 * Tamagui native bench harness. Deep-link routed:
 *   exp://HOST/--/?case=<scenarioId>&n=<counter>
 *
 * Each link remounts the scenario (key={url}) so the mount/rerender lifecycle is fresh.
 * Timings collected with performance.now() inside useLayoutEffect (matches web bench) and
 * POSTed to the orchestrator at http://localhost:8091/result.
 *
 * Scenarios match the web bench at code/comparisons/tamagui-bench/src/index.tsx but use
 * ITEM_COUNT=200 (matches Tamagui-runtime web column) to keep iOS sim runs sane.
 */
import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { View as RNView, Text as RNText } from 'react-native'
import { TamaguiProvider, View } from 'tamagui'
import config from './tamagui.config'

const HARNESS_URL = 'http://localhost:8091/result'
const ITEM_COUNT = 200
const HEAVY_COUNT = 60

// ── scenarios (mirror web bench at tamagui-bench/src/index.tsx) ───────

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
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
            $group-row-hover={{ backgroundColor: '$blue7' }}
          />
          <View flex={1}>
            <View
              height={10}
              borderRadius={4}
              backgroundColor="$gray8"
              $group-row-hover={{ backgroundColor: '$blue8' }}
            />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

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
            $group-card-hover={{ opacity: 0.8 }}
          />
          <View flex={1} gap={4}>
            <View
              height={12}
              borderRadius={4}
              backgroundColor="$gray11"
              width={80 + ((i * 17) % 60)}
              $group-card-hover={{ backgroundColor: '$blue9' }}
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
            $group-card-hover={{ backgroundColor: '$blue5' }}
          >
            <View width={24} height={8} borderRadius={3} backgroundColor="$blue9" />
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
          animation="bouncy"
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

const scenarioComponents: Record<string, (props: { seed: number }) => any> = {
  simple: SimpleItems,
  rich: RichItems,
  group: GroupItems,
  heavy: HeavyItems,
  animated: AnimatedItems,
}

// ── runner ────────────────────────────────────────────

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
    <RNView style={{ flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}>
      <Component seed={seed} />
    </RNView>
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
          framework: 'tamagui',
          scenario: valid,
          mount: result.mount,
          rerender: result.rerender,
        }),
      }).catch(() => {})
    },
    [valid]
  )

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <RNView
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          paddingTop: 60,
          alignItems: 'flex-start',
        }}
      >
        {valid ? (
          <RNView key={url ?? ''}>
            <RNText style={{ padding: 8, fontSize: 12, color: '#666' }}>
              tamagui · {valid}
            </RNText>
            <BenchRunner scenarioId={valid} onResult={handleResult} />
          </RNView>
        ) : (
          <RNText style={{ padding: 20 }}>
            {caseName ? `unknown case: ${caseName}` : 'waiting for ?case='}
          </RNText>
        )}
      </RNView>
    </TamaguiProvider>
  )
}
