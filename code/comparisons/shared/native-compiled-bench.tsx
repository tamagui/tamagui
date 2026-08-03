import * as Linking from 'expo-linking'
import { useURL } from 'expo-linking'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Text as RNText, View as RNView } from 'react-native'
import { styled, TamaguiProvider, View } from 'tamagui'
import {
  NATIVE_COMPILED_FIXTURE_VERSION,
  NATIVE_COMPILED_SCENARIOS,
  type NativeCompiledScenario,
} from './native-bench-spec'
import { NativeDynamicCompilerCorpus } from '../../compiler/static-tests/fixtures/native-compiled-dynamic-corpus'

export {
  NATIVE_COMPILED_FIXTURE_VERSION,
  NATIVE_COMPILED_SCENARIOS,
  type NativeCompiledScenario,
} from './native-bench-spec'

const ITEM_COUNT = 200
const NESTED_COUNT = 60
const HARNESS_URL = 'http://localhost:8091/result'

void NativeDynamicCompilerCorpus

const FixtureCard = styled(View, {
  width: 120,
  height: 48,
  padding: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: 'rgb(209,213,219)',
  backgroundColor: 'rgb(249,250,251)',
})

type RenderState = { instance: number; revision: number }

function SimpleItems({ instance, revision }: RenderState) {
  const items = useMemo(
    () => (
      <>
        {Array.from({ length: ITEM_COUNT }, (_, index) => (
          <View
            key={index + instance * ITEM_COUNT}
            width={20}
            height={20}
            backgroundColor="rgb(99,102,241)"
            borderRadius={3}
            margin={1}
          />
        ))}
      </>
    ),
    [instance]
  )
  return <RNView style={{ opacity: revision === 0 ? 1 : 0.8 }}>{items}</RNView>
}

function NestedStaticItems({ instance, revision }: RenderState) {
  const items = useMemo(
    () => (
      <>
        {Array.from({ length: NESTED_COUNT }, (_, index) => (
          <View
            key={index + instance * NESTED_COUNT}
            flexDirection="row"
            alignItems="center"
            gap={8}
            padding={8}
            borderRadius={8}
            borderWidth={1}
            borderColor="rgb(229,231,235)"
            margin={1}
          >
            <View
              width={32}
              height={32}
              borderRadius={16}
              backgroundColor="rgb(96,165,250)"
            />
            <View flex={1} gap={4}>
              <View
                width={120}
                height={10}
                borderRadius={4}
                backgroundColor="rgb(55,65,81)"
              />
              <View
                width={180}
                height={8}
                borderRadius={4}
                backgroundColor="rgb(156,163,175)"
              />
            </View>
          </View>
        ))}
      </>
    ),
    [instance]
  )
  return <RNView style={{ opacity: revision === 0 ? 1 : 0.8 }}>{items}</RNView>
}

function StyledStaticItems({ instance, revision }: RenderState) {
  const items = useMemo(
    () => (
      <>
        {Array.from({ length: NESTED_COUNT }, (_, index) => (
          <FixtureCard key={`${index + instance * NESTED_COUNT}`} />
        ))}
      </>
    ),
    [instance]
  )
  return <RNView style={{ opacity: revision === 0 ? 1 : 0.8 }}>{items}</RNView>
}

const scenarioComponents: Record<NativeCompiledScenario, any> = {
  simple: SimpleItems,
  'nested-static': NestedStaticItems,
  'styled-static': StyledStaticItems,
}

function BenchRunner({
  scenario,
  onResult,
}: {
  scenario: NativeCompiledScenario
  onResult(result: { mount: number; update: number; remount: number }): void
}) {
  const [phase, setPhase] = useState('idle')
  const [instance, setInstance] = useState(0)
  const [revision, setRevision] = useState(0)
  const startRef = useRef(0)
  const mountTimeRef = useRef(0)
  const updateTimeRef = useRef(0)
  const Component = scenarioComponents[scenario]

  useLayoutEffect(() => {
    if (phase === 'mounting') {
      mountTimeRef.current = performance.now() - startRef.current
      setPhase('mounted')
    } else if (phase === 'mounted') {
      requestAnimationFrame(() => {
        startRef.current = performance.now()
        setPhase('updating')
        setRevision(1)
      })
    } else if (phase === 'updating') {
      updateTimeRef.current = performance.now() - startRef.current
      setPhase('updated')
    } else if (phase === 'updated') {
      requestAnimationFrame(() => {
        startRef.current = performance.now()
        setPhase('remounting')
        setInstance(2)
      })
    } else if (phase === 'remounting') {
      onResult({
        mount: mountTimeRef.current,
        update: updateTimeRef.current,
        remount: performance.now() - startRef.current,
      })
      setPhase('done')
    }
  }, [phase, onResult])

  useEffect(() => {
    const timeout = setTimeout(() => {
      startRef.current = performance.now()
      setPhase('mounting')
      setInstance(1)
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  if (phase === 'idle') return null

  return (
    <RNView style={{ flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 }}>
      <Component instance={instance} revision={revision} />
    </RNView>
  )
}

export function createNativeCompiledBenchApp({
  config,
  framework: defaultFramework,
  buildId,
}: {
  config: any
  framework: string
  buildId: string | undefined
}) {
  if (!buildId) {
    throw new Error('EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID is required')
  }
  return function NativeCompiledBenchApp() {
    const url = useURL()
    let scenario: NativeCompiledScenario | null = null
    let framework = defaultFramework
    let run = ''
    if (url) {
      const params = Linking.parse(url).queryParams
      const requestedScenario = String(params?.case ?? '')
      if ((NATIVE_COMPILED_SCENARIOS as readonly string[]).includes(requestedScenario)) {
        scenario = requestedScenario as NativeCompiledScenario
      }
      if (params?.fw) framework = String(params.fw)
      if (params?.run) run = String(params.run)
    }

    const handleResult = useCallback(
      (result: { mount: number; update: number; remount: number }) => {
        if (!scenario || !run) return
        fetch(HARNESS_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            framework,
            buildId,
            scenario,
            run,
            fixtureVersion: NATIVE_COMPILED_FIXTURE_VERSION,
            ...result,
          }),
        }).catch(() => {})
      },
      [buildId, framework, run, scenario]
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
          {scenario ? (
            <RNView key={url ?? ''}>
              <RNText style={{ padding: 8, fontSize: 12, color: '#666' }}>
                {framework} · {scenario} · {run}
              </RNText>
              <BenchRunner scenario={scenario} onResult={handleResult} />
            </RNView>
          ) : (
            <RNText style={{ padding: 20 }}>waiting for a benchmark deep link</RNText>
          )}
        </RNView>
      </TamaguiProvider>
    )
  }
}
