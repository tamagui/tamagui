import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const HARNESS_URL = 'http://localhost:8091/result'
const ITEM_COUNT = 200
const HEAVY_COUNT = 60

function SimpleItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(<View key={i + seed * ITEM_COUNT} style={styles.simpleItem} />)
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
          style={[styles.richItem, richColorStyles[(i + seed) % 3]]}
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
        <View key={i + seed * ITEM_COUNT} style={styles.groupItem}>
          <View style={styles.groupAvatar} />
          <View style={styles.groupContent}>
            <View style={styles.groupLine} />
          </View>
        </View>
      )
    }
    return <>{arr}</>
  }, [seed])
}

const heavyColors = ['#3b82f6', '#22c55e', '#ec4899', '#f97316']

function HeavyItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < HEAVY_COUNT; i++) {
      const color = heavyColors[(i + seed) % 4]
      arr.push(
        <View key={i + seed * HEAVY_COUNT} style={styles.heavyItem}>
          <View style={[styles.heavyAvatar, { backgroundColor: color }]} />
          <View style={styles.heavyContent}>
            <View style={[styles.heavyLineStrong, { width: 80 + ((i * 17) % 60) }]} />
            <View style={[styles.heavyLineMuted, { width: 120 + ((i * 13) % 80) }]} />
          </View>
          <View style={styles.heavyBadge}>
            <View style={styles.heavyBadgeLine} />
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
      arr.push(<View key={i + seed * ITEM_COUNT} style={styles.animatedItem} />)
    }
    return <>{arr}</>
  }, [seed])
}

// themed = simple shape, raw RN baseline (no wrapper, no theme concept). this is
// the ×RN denominator for the themed scenario — a plain colored view.
function ThemedItems({ seed }: { seed: number }) {
  return useMemo(() => {
    const arr = []
    for (let i = 0; i < ITEM_COUNT; i++) {
      arr.push(<View key={i + seed * ITEM_COUNT} style={styles.themedItem} />)
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
    <View style={styles.runner}>
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
          framework: 'rn',
          scenario: valid,
          mount: result.mount,
          rerender: result.rerender,
        }),
      }).catch(() => {})
    },
    [valid]
  )

  return (
    <View style={styles.app}>
      {valid ? (
        <View key={url ?? ''}>
          <Text style={styles.title}>react native · {valid}</Text>
          <BenchRunner scenarioId={valid} onResult={handleResult} />
        </View>
      ) : (
        <Text style={styles.waiting}>
          {caseName ? `unknown case: ${caseName}` : 'waiting for ?case='}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
    alignItems: 'flex-start',
  },
  title: {
    padding: 8,
    fontSize: 12,
    color: '#666666',
  },
  waiting: {
    padding: 20,
  },
  runner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 600,
  },
  simpleItem: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: 'rgb(99,102,241)',
    margin: 1,
  },
  themedItem: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: 'rgb(59,130,246)',
    margin: 1,
  },
  richItem: {
    width: 60,
    height: 40,
    borderRadius: 6,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 1,
  },
  richIndigo: {
    backgroundColor: '#6366f1',
  },
  richGreen: {
    backgroundColor: '#22c55e',
  },
  richPink: {
    backgroundColor: '#ec4899',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    margin: 1,
  },
  groupAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
  },
  groupContent: {
    flex: 1,
  },
  groupLine: {
    height: 10,
    borderRadius: 4,
    backgroundColor: '#4b5563',
  },
  heavyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
  },
  heavyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  heavyContent: {
    flex: 1,
    gap: 4,
  },
  heavyLineStrong: {
    height: 12,
    borderRadius: 4,
    backgroundColor: '#1f2937',
  },
  heavyLineMuted: {
    height: 10,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
  },
  heavyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#dbeafe',
  },
  heavyBadgeLine: {
    width: 24,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#1d4ed8',
  },
  animatedItem: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    margin: 1,
  },
})

const richColorStyles = [styles.richIndigo, styles.richGreen, styles.richPink]
