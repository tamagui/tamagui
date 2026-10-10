/**
 * Benchmark: style object stability on native re-renders.
 *
 * Measures the cost difference between:
 * 1. Tamagui components (fresh style objects every render)
 * 2. RN StyleSheet.create (stable style references)
 * 3. Tamagui with manual style memoization (what L1 would give us)
 *
 * The key measurement is RE-RENDER time, not mount time.
 * A parent state change forces all children to re-render with identical
 * styles. The difference is entirely React Native's diffNestedProperty
 * cost when style objects have new references vs same references.
 *
 * Use case name: StyleStabilityBench
 * Detox: tap run buttons, read results from accessibilityLabels
 */

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View as RNView, Text as RNText, Pressable } from 'react-native'
import { View as TamaguiView, Text, YStack, XStack, styled } from 'tamagui'

const NODE_COUNT = 500
const SAMPLE_COUNT = 7
const WARMUP_COUNT = 2
const items = Array.from({ length: NODE_COUNT }, (_, i) => i)

// ── 1. Tamagui runtime (current: fresh style objects every render) ──

function TamaguiItem() {
  return (
    <TamaguiView
      width={16}
      height={16}
      backgroundColor="red"
      borderRadius={2}
      margin={1}
    />
  )
}

const StyledItem = styled(TamaguiView, {
  width: 16,
  height: 16,
  backgroundColor: 'red',
  borderRadius: 2,
  margin: 1,
})

function TamaguiStyledItem() {
  return <StyledItem />
}

// ── 2. RN StyleSheet.create (stable references — the gold standard) ──

const rnStyles = StyleSheet.create({
  item: {
    width: 16,
    height: 16,
    backgroundColor: 'red',
    borderRadius: 2,
    margin: 1,
  },
})

function RNItem() {
  return <RNView style={rnStyles.item} />
}

// ── 3. Tamagui with useMemo wrapper (simulates L1 memoization) ──

function MemoizedTamaguiItem() {
  // this is what L1 would do internally — return same ref when style is unchanged
  return useMemo(
    () => (
      <TamaguiView
        width={16}
        height={16}
        backgroundColor="red"
        borderRadius={2}
        margin={1}
      />
    ),
    []
  )
}

// ── harness ──

type ScenarioId =
  | 'tamagui-inline'
  | 'tamagui-styled'
  | 'rn-stylesheet'
  | 'tamagui-memoized'

const scenarioComponents: Record<ScenarioId, React.FC> = {
  'tamagui-inline': TamaguiItem,
  'tamagui-styled': TamaguiStyledItem,
  'rn-stylesheet': RNItem,
  'tamagui-memoized': MemoizedTamaguiItem,
}

const scenarioLabels: Record<ScenarioId, string> = {
  'tamagui-inline': 'Tamagui inline props',
  'tamagui-styled': 'Tamagui styled()',
  'rn-stylesheet': 'RN StyleSheet',
  'tamagui-memoized': 'Tamagui + useMemo',
}

const scenarioIds: ScenarioId[] = [
  'tamagui-inline',
  'tamagui-styled',
  'rn-stylesheet',
  'tamagui-memoized',
]

function ItemGrid({ scenarioId, counter }: { scenarioId: ScenarioId; counter: number }) {
  const Component = scenarioComponents[scenarioId]
  // counter in dep forces re-render of all children
  return useMemo(() => {
    const arr: React.ReactElement[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      arr.push(<Component key={i} />)
    }
    return (
      <RNView style={{ flexDirection: 'row', flexWrap: 'wrap', maxWidth: 300 }}>
        {arr}
      </RNView>
    )
  }, [counter])
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!
}

function BenchRunner({
  scenarioId,
  onComplete,
}: {
  scenarioId: ScenarioId
  onComplete: (results: { mount: number; rerenders: number[] }) => void
}) {
  const [phase, setPhase] = useState<
    'idle' | 'mounting' | 'mounted' | 'rerendering' | 'done'
  >('idle')
  const [counter, setCounter] = useState(0)
  const startRef = useRef(0)
  const mountTimeRef = useRef(0)
  const rerenderTimesRef = useRef<number[]>([])
  const totalSamples = WARMUP_COUNT + SAMPLE_COUNT

  useLayoutEffect(() => {
    if (phase === 'mounting') {
      mountTimeRef.current = performance.now() - startRef.current
      setPhase('mounted')
    } else if (phase === 'mounted') {
      requestAnimationFrame(() => {
        startRef.current = performance.now()
        setPhase('rerendering')
        setCounter((c) => c + 1)
      })
    } else if (phase === 'rerendering') {
      const elapsed = performance.now() - startRef.current
      rerenderTimesRef.current.push(elapsed)

      if (rerenderTimesRef.current.length < totalSamples) {
        // schedule next re-render
        requestAnimationFrame(() => {
          startRef.current = performance.now()
          setCounter((c) => c + 1)
        })
      } else {
        // drop warmup samples
        const measured = rerenderTimesRef.current.slice(WARMUP_COUNT)
        onComplete({
          mount: mountTimeRef.current,
          rerenders: measured,
        })
        setPhase('done')
      }
    }
  }, [phase, counter])

  React.useEffect(() => {
    const t = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('mounting')
      setCounter(1)
    }, 200)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'idle') return null

  return <ItemGrid scenarioId={scenarioId} counter={counter} />
}

type Results = Record<
  ScenarioId,
  { mount: number; rerenderMedian: number; rerenders: number[] } | null
>

export function StyleStabilityBench() {
  const [results, setResults] = useState<Results>({
    'tamagui-inline': null,
    'tamagui-styled': null,
    'rn-stylesheet': null,
    'tamagui-memoized': null,
  })
  const [running, setRunning] = useState<ScenarioId | null>(null)
  const [runKey, setRunKey] = useState(0)

  const handleComplete = (
    scenarioId: ScenarioId,
    data: { mount: number; rerenders: number[] }
  ) => {
    setResults((prev) => ({
      ...prev,
      [scenarioId]: {
        mount: data.mount,
        rerenderMedian: median(data.rerenders)!,
        rerenders: data.rerenders,
      },
    }))
    setRunning(null)
  }

  const runScenario = (id: ScenarioId) => {
    setRunning(id)
    setRunKey((k) => k + 1)
  }

  const runAll = async () => {
    // run sequentially via state machine
    for (const id of scenarioIds) {
      runScenario(id)
      // wait handled by onComplete
      break // first one — chain handled below
    }
  }

  // chain: when one finishes, start the next
  React.useEffect(() => {
    if (running !== null) return
    const nextUnrun = scenarioIds.find((id) => results[id] === null)
    // only auto-chain if at least one result exists (meaning runAll was called)
    const hasAnyResult = scenarioIds.some((id) => results[id] !== null)
    if (nextUnrun && hasAnyResult) {
      const t = setTimeout(() => runScenario(nextUnrun), 300)
      return () => clearTimeout(t)
    }
  }, [running, results])

  const rnResult = results['rn-stylesheet']
  const allDone = scenarioIds.every((id) => results[id] !== null)

  return (
    <YStack
      testID="style-stability-root"
      flex={1}
      padding={16}
      gap={12}
      backgroundColor="background"
    >
      <Text fontSize={18} fontWeight="bold">
        Style Stability Bench ({NODE_COUNT} nodes × {SAMPLE_COUNT} samples)
      </Text>

      <Pressable
        testID="bench-run-all"
        onPress={() => {
          setResults({
            'tamagui-inline': null,
            'tamagui-styled': null,
            'rn-stylesheet': null,
            'tamagui-memoized': null,
          })
          setTimeout(() => runScenario(scenarioIds[0]), 100)
        }}
        style={{
          backgroundColor: '#3b82f6',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 6,
          alignSelf: 'flex-start',
        }}
      >
        <RNText style={{ color: 'white', fontWeight: '600' }}>
          {running ? `Running ${scenarioLabels[running]}...` : 'Run All'}
        </RNText>
      </Pressable>

      {running && (
        <RNView key={`${running}-${runKey}`}>
          <BenchRunner
            scenarioId={running}
            onComplete={(data) => handleComplete(running, data)}
          />
        </RNView>
      )}

      <YStack gap={8}>
        {scenarioIds.map((id) => {
          const r = results[id]
          const speedup =
            r && rnResult
              ? ((r.rerenderMedian - rnResult.rerenderMedian) / rnResult.rerenderMedian) *
                100
              : null

          return (
            <YStack key={id} gap={2}>
              <Text fontSize={14} fontWeight="600">
                {scenarioLabels[id]}
              </Text>
              <Text
                testID={`bench-${id}-mount`}
                accessibilityLabel={`mount:${r?.mount.toFixed(2) ?? 'pending'}`}
                fontSize={12}
              >
                Mount: {r ? `${r.mount.toFixed(2)}ms` : '-'}
              </Text>
              <Text
                testID={`bench-${id}-rerender`}
                accessibilityLabel={`rerender:${r?.rerenderMedian.toFixed(2) ?? 'pending'}`}
                fontSize={12}
              >
                Re-render median: {r ? `${r.rerenderMedian.toFixed(2)}ms` : '-'}
              </Text>
              {speedup !== null && id !== 'rn-stylesheet' && (
                <Text
                  testID={`bench-${id}-vs-rn`}
                  accessibilityLabel={`vs-rn:${speedup.toFixed(1)}`}
                  fontSize={12}
                  color={speedup > 10 ? 'red' : speedup < -5 ? 'green' : 'color'}
                >
                  vs RN StyleSheet: {speedup > 0 ? '+' : ''}
                  {speedup.toFixed(1)}%
                </Text>
              )}
            </YStack>
          )
        })}
      </YStack>

      {allDone && (
        <YStack
          testID="bench-summary"
          gap={4}
          padding={8}
          backgroundColor="background-press"
          borderRadius={8}
        >
          <Text fontSize={14} fontWeight="bold">
            Summary
          </Text>
          <Text
            testID="bench-summary-text"
            accessibilityLabel={`inline:${results['tamagui-inline']?.rerenderMedian.toFixed(2)},styled:${results['tamagui-styled']?.rerenderMedian.toFixed(2)},rn:${results['rn-stylesheet']?.rerenderMedian.toFixed(2)},memo:${results['tamagui-memoized']?.rerenderMedian.toFixed(2)}`}
            fontSize={12}
          >
            {`Inline: ${results['tamagui-inline']?.rerenderMedian.toFixed(2)}ms | ` +
              `Styled: ${results['tamagui-styled']?.rerenderMedian.toFixed(2)}ms | ` +
              `RN: ${results['rn-stylesheet']?.rerenderMedian.toFixed(2)}ms | ` +
              `Memo: ${results['tamagui-memoized']?.rerenderMedian.toFixed(2)}ms`}
          </Text>
          <Text fontSize={12}>
            Re-render gap (inline vs RN):{' '}
            {(
              ((results['tamagui-inline']!.rerenderMedian -
                results['rn-stylesheet']!.rerenderMedian) /
                results['rn-stylesheet']!.rerenderMedian) *
              100
            ).toFixed(1)}
            %
          </Text>
          <Text fontSize={12}>
            Re-render gap (memo vs RN):{' '}
            {(
              ((results['tamagui-memoized']!.rerenderMedian -
                results['rn-stylesheet']!.rerenderMedian) /
                results['rn-stylesheet']!.rerenderMedian) *
              100
            ).toFixed(1)}
            %
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
