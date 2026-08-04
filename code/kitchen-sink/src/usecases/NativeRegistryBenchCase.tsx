// benchmark proving the native fast path's worth (plans/native-fast-path.md).
// three scenarios render the same COUNT squares with the same visual props:
//   tamagui  styled(View) with theme values under <Theme name>, toggling
//            sub-theme red<->green re-renders every square. this is the hook
//            path the compiler falls back to today whenever one theme value
//            appears, and the case the fast path exists to kill.
//   native   plain RN views linked to @tamagui/native-registry with
//            pre-resolved per-state props (what the compiler would emit);
//            a toggle is one setStateName call, zero React work.
//   rn       inline RN views restyled by a parent setState: the cheapest
//            possible React re-render, the floor bounding any JS approach.
// honesty controls: a React.Profiler around each scenario counts commits and
// sums actualDuration (native must show 0 commits during its run), engine
// commit/miss counters are read before/after, warmup runs are dropped and
// medians reported, and sub-themes (never light/dark) are toggled so iOS
// DynamicColorIOS cannot flatter the baseline.
import React, { Profiler, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Theme, View as TamaguiView, styled, useTheme } from 'tamagui'
import {
  setNativeStyleEngine,
  setNativeStyleEngineFlushListener,
  type NativeStyleEngine,
} from '@tamagui/core'
import * as registry from '@tamagui/native-registry'
import {
  getStats,
  isAvailable,
  link,
  setStateName,
  type ViewSlots,
} from '@tamagui/native-registry'

const COUNT = 500
const RUNS = 20
const WARMUP = 5

const indices = Array.from({ length: COUNT }, (_, i) => i)

// ── tamagui scenario ──

const TamaSquare = styled(TamaguiView, {
  width: 10,
  height: 10,
  borderRadius: 3,
  borderWidth: 1,
  margin: 1,
  backgroundColor: 'background',
  borderColor: 'color',
})

// visible proof the sub-theme actually resolves and changes: if this readout
// does not alternate between the red/green backgrounds, the scenario measures
// bailouts instead of themed re-renders
function ThemeReadout() {
  const theme = useTheme()
  return (
    <Text style={styles.info} testID="themeReadout">
      resolved bg: {String(theme.background?.val)}
    </Text>
  )
}

function TamaguiGrid({
  sub,
  onSquareRender,
}: {
  sub: string
  onSquareRender: () => void
}) {
  // memoized children: the provider re-renders on toggle but the square
  // elements keep identity, so square re-renders come only from tamagui's
  // theme listener system — the realistic app shape (stable children), and
  // the exact path the native fast path intercepts
  const squares = useMemo(
    () => (
      <View style={styles.grid}>
        {indices.map((i) =>
          i === 0 ? (
            // per-square control: proves whether square 0 re-renders per
            // toggle (baseline: yes via listener; fastpath: must be 0)
            <Profiler key={i} id="sq0" onRender={onSquareRender}>
              <TamaSquare />
            </Profiler>
          ) : (
            <TamaSquare key={i} />
          )
        )}
      </View>
    ),
    [onSquareRender]
  )
  return (
    <Theme name={sub as any}>
      <ThemeReadout />
      {squares}
    </Theme>
  )
}

// ── native scenario ──

// values mirror v6 defaultConfig light_red / light_green background + color;
// exact equality with the theme is cosmetic, timing is color-independent
const SLOTS: ViewSlots = {
  state: {
    red: { backgroundColor: '#ffe2e2', borderColor: '#c10007' },
    green: { backgroundColor: '#dcfce7', borderColor: '#008236' },
  },
}

function NativeSquare() {
  const unlinkRef = useRef<null | (() => void)>(null)
  return (
    <View
      ref={(instance) => {
        unlinkRef.current?.()
        unlinkRef.current = instance ? (link(instance, SLOTS)?.unlink ?? null) : null
      }}
      style={styles.nativeSq}
    />
  )
}

function NativeGrid() {
  return (
    <View style={styles.grid}>
      {indices.map((i) => (
        <NativeSquare key={i} />
      ))}
    </View>
  )
}

// ── rn floor scenario ──

const rnStates = StyleSheet.create({
  red: { backgroundColor: '#ffe2e2', borderColor: '#c10007' },
  green: { backgroundColor: '#dcfce7', borderColor: '#008236' },
})

function RNGrid({ sub }: { sub: 'red' | 'green' }) {
  return (
    <View style={styles.grid}>
      {indices.map((i) => (
        <View key={i} style={[styles.nativeSq, rnStates[sub]]} />
      ))}
    </View>
  )
}

// ── measurement ──

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()))

function summarize(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  return {
    median: Number(median.toFixed(2)),
    min: Number(sorted[0].toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
  }
}

type Result = {
  scenario: string
  sync: ReturnType<typeof summarize>
  // js-thread work per toggle: trigger -> last React commit (Profiler
  // timestamp) for React paths, == sync for the native path (fully sync).
  // unlike the frame metric this has no vsync floor.
  jsDone: ReturnType<typeof summarize>
  frame: ReturnType<typeof summarize>
  jsDoneMissed: number
  reactCommits: number
  reactRenderMs: number
  sq0Commits: number
  engineCommits: number
  engineMisses: number
}

type Scenario = 'tamagui' | 'fastpath' | 'native' | 'rn'

export function NativeRegistryBenchCase() {
  const [scenario, setScenario] = useState<'none' | Scenario>('none')
  const [sub, setSub] = useState<'red' | 'green'>('red')
  const [results, setResults] = useState<Result[]>([])
  const [running, setRunning] = useState(false)
  // profiler control: commits + actualDuration inside the scenario subtree
  const profilerRef = useRef({ commits: 0, renderMs: 0, lastCommitAt: 0, sq0: 0 })
  // native fast path flush timestamp (per toggle)
  const flushAtRef = useRef(0)
  // read inside the runner without closing over stale state
  const subRef = useRef(sub)
  subRef.current = sub
  // stable identity: an inline arrow here would invalidate the grid's
  // memoized squares on every toggle (setSub re-renders this root), making
  // every square re-render from element recreation and hiding what the
  // fast path saves
  const onSquareRender = useRef(() => {
    profilerRef.current.sq0 += 1
  }).current

  const runScenario = async (
    name: Scenario,
    toggle: (next: 'red' | 'green') => void
  ) => {
    setRunning(true)
    // the experimental core fast path is per-scenario: on only for fastpath
    setNativeStyleEngine(
      name === 'fastpath' ? (registry as unknown as NativeStyleEngine) : null
    )
    setNativeStyleEngineFlushListener(() => {
      flushAtRef.current = performance.now()
    })
    setScenario(name)
    // let the scenario mount and settle before measuring
    for (let i = 0; i < 10; i++) await frame()

    profilerRef.current = { commits: 0, renderMs: 0, lastCommitAt: 0, sq0: 0 }
    const engineBefore = getStats()
    const sync: number[] = []
    const jsDone: number[] = []
    const frameTimes: number[] = []
    let jsDoneMissed = 0
    let state: 'red' | 'green' = subRef.current

    for (let i = 0; i < RUNS + WARMUP; i++) {
      state = state === 'red' ? 'green' : 'red'
      await frame()
      const t0 = performance.now()
      toggle(state)
      const tSync = performance.now() - t0
      await frame()
      await frame()
      const tFrame = performance.now() - t0
      // js work is done at the later of: last React commit (Profiler) and
      // last native flush (fast path commits happen in a microtask after
      // the provider commit)
      const commitAt = Math.max(profilerRef.current.lastCommitAt, flushAtRef.current)
      if (i >= WARMUP) {
        sync.push(tSync)
        frameTimes.push(tFrame)
        if (name === 'native') {
          jsDone.push(tSync)
        } else if (commitAt > t0) {
          jsDone.push(commitAt - t0)
        } else {
          jsDoneMissed += 1
        }
      }
    }

    setNativeStyleEngineFlushListener(null)
    const engineAfter = getStats()
    const result: Result = {
      scenario: name,
      sync: summarize(sync),
      jsDone: summarize(jsDone.length ? jsDone : [0]),
      frame: summarize(frameTimes),
      jsDoneMissed,
      reactCommits: profilerRef.current.commits,
      reactRenderMs: Number(profilerRef.current.renderMs.toFixed(1)),
      sq0Commits: profilerRef.current.sq0,
      engineCommits: engineAfter.commitCount - engineBefore.commitCount,
      engineMisses: engineAfter.missCount - engineBefore.missCount,
    }
    console.info(`[bench] ${JSON.stringify(result)}`)
    setResults((prev) => [...prev.filter((r) => r.scenario !== name), result])
    setRunning(false)
  }

  const toggleReact = (next: 'red' | 'green') => setSub(next)
  const toggleNative = (next: 'red' | 'green') => setStateName(next)

  return (
    <View style={styles.root} testID="benchRoot">
      <Text style={styles.info}>
        native: {String(isAvailable())} count: {COUNT} runs: {RUNS} (+{WARMUP} warmup)
        {running ? ' RUNNING' : ''}
      </Text>

      <View style={styles.row}>
        <Pressable
          testID="runTamagui"
          style={styles.button}
          disabled={running}
          onPress={() => runScenario('tamagui', toggleReact)}
        >
          <Text>run tamagui</Text>
        </Pressable>
        <Pressable
          testID="runFastpath"
          style={styles.button}
          disabled={running}
          onPress={() => runScenario('fastpath', toggleReact)}
        >
          <Text>run fastpath</Text>
        </Pressable>
        <Pressable
          testID="runNative"
          style={styles.button}
          disabled={running}
          onPress={() => runScenario('native', toggleNative)}
        >
          <Text>run native</Text>
        </Pressable>
        <Pressable
          testID="runRN"
          style={styles.button}
          disabled={running}
          onPress={() => runScenario('rn', toggleReact)}
        >
          <Text>run rn floor</Text>
        </Pressable>
      </View>

      {results.map((r) => (
        <Text key={r.scenario} style={styles.info} testID={`result-${r.scenario}`}>
          {r.scenario}: jsDone {r.jsDone.median}ms (min {r.jsDone.min} max{' '}
          {r.jsDone.max}, missed {r.jsDoneMissed}) sync {r.sync.median}ms frame{' '}
          {r.frame.median}ms react commits {r.reactCommits} render {r.reactRenderMs}
          ms sq0 {r.sq0Commits} engine {r.engineCommits}c/{r.engineMisses}m
        </Text>
      ))}

      <Profiler
        id="bench"
        onRender={(_id, _phase, actualDuration) => {
          profilerRef.current.commits += 1
          profilerRef.current.renderMs += actualDuration
          profilerRef.current.lastCommitAt = performance.now()
        }}
      >
        {scenario === 'tamagui' || scenario === 'fastpath' ? (
          // key remounts the grid per scenario so hosts re-link (eligibility
          // and engine linking are decided at mount)
          <TamaguiGrid key={scenario} sub={sub} onSquareRender={onSquareRender} />
        ) : null}
        {scenario === 'native' ? <NativeGrid /> : null}
        {scenario === 'rn' ? <RNGrid sub={sub} /> : null}
      </Profiler>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: 8, padding: 16 },
  info: { color: '#888', fontSize: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  nativeSq: {
    width: 10,
    height: 10,
    borderRadius: 3,
    borderWidth: 1,
    margin: 1,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
})
