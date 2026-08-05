// benchmark proving the native fast path's worth (plans/native-fast-path.md).
// every scenario renders the same COUNT squares with the same visual props:
//   tamagui       uncompiled styled(View) with theme values under <Theme name>,
//                 toggling sub-theme red<->green re-renders every square via the
//                 theme listener. the app-without-compiler baseline.
//   fastpath      the same uncompiled squares with the engine on: runtime mode
//                 intercepts the listener and commits natively.
//   compiled      the compiler-lowered squares with the engine off, which is
//                 today's real shipping path for an app that runs the compiler
//                 (_withStableStyle: flattened element + one theme hook).
//   compiledFast  the same lowered squares with the engine on. requires metro
//                 started with TAMAGUI_NATIVE_FAST_PATH=1 so the compiler emits
//                 _withNativeStyle. the engine call counts in the result line
//                 say which path actually ran: compiler mode is stateName calls
//                 only, runtime mode carries applyViewStates entries (one per
//                 view per toggle), and the React fallback links no views at
//                 all. a module that shipped unlowered reads as runtime mode.
//   native        plain RN views linked to @tamagui/native-registry with
//                 pre-resolved per-state props; a toggle is one setStateName
//                 call, zero React work. the engine's own floor.
//   rn            inline RN views restyled by a parent setState: the cheapest
//                 possible React re-render, the floor bounding any JS approach.
//   rnHost        the same, on RN's `unstable_NativeView` host component
//                 instead of `<View>`, which measures what View's JS wrapper
//                 costs the paths that actually re-render.
// honesty controls: a React.Profiler around each scenario counts commits and
// sums actualDuration (native must show 0 commits during its run), engine
// commit/miss counters and linked view count are read per run, warmup runs are
// dropped and medians reported, and sub-themes (never light/dark) are toggled
// so iOS DynamicColorIOS cannot flatter the baseline.
import React, { Profiler, createElement, useMemo, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Theme, View as TamaguiView, styled, useTheme } from 'tamagui'
import { setNativeStyleEngine, type NativeStyleEngine } from '@tamagui/core'
import * as registry from '@tamagui/native-registry'
import { getStats, isAvailable, link, type ViewSlots } from '@tamagui/native-registry'

const COUNT = 500
const RUNS = 20
const WARMUP = 5

const indices = Array.from({ length: COUNT }, (_, i) => i)

// ── uncompiled (runtime path) scenarios ──

const TamaSquare = styled(TamaguiView, {
  width: 10,
  height: 10,
  borderRadius: 3,
  borderWidth: 1,
  margin: 1,
  backgroundColor: 'background',
  borderColor: 'color',
})

// the compiler lowers any statically resolvable tamagui JSX element, and
// whether a given metro session lowers a given file varies with cache state
// (see the plan-miss trap in plans/native-fast-path-dev-loop.md) — the same
// source measured styled()/createComponent in one session and the lowered
// _withStableStyle path in the next. building these elements with
// createElement keeps them off the compiler's JSX path permanently, so the
// runtime scenarios always measure what their names say. the lowered
// counterpart is the compiled* scenarios below.
const runtimeSquare = (key?: number) =>
  createElement(TamaSquare, key == null ? null : { key })

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

function ThemedGrid({ sub, children }: { sub: string; children: React.ReactNode }) {
  return (
    <Theme name={sub as any}>
      <ThemeReadout />
      {children}
    </Theme>
  )
}

function RuntimeGrid({
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
              {runtimeSquare()}
            </Profiler>
          ) : (
            runtimeSquare(i)
          )
        )}
      </View>
    ),
    [onSquareRender]
  )
  return <ThemedGrid sub={sub}>{squares}</ThemedGrid>
}

// ── compiled (lowered) scenarios ──

// identical props to TamaSquare, written as plain static JSX so the compiler
// lowers every call site: flag off it emits _withStableStyle (today's shipping
// output), flag on it emits _withNativeStyle (the fast path's compiler mode).
function CompiledGrid({
  sub,
  onSquareRender,
}: {
  sub: string
  onSquareRender: () => void
}) {
  const squares = useMemo(
    () => (
      <View style={styles.grid}>
        {indices.map((i) =>
          i === 0 ? (
            <Profiler key={i} id="sq0" onRender={onSquareRender}>
              <TamaguiView
                width={10}
                height={10}
                borderRadius={3}
                borderWidth={1}
                margin={1}
                backgroundColor="background"
                borderColor="color"
              />
            </Profiler>
          ) : (
            <TamaguiView
              key={i}
              width={10}
              height={10}
              borderRadius={3}
              borderWidth={1}
              margin={1}
              backgroundColor="background"
              borderColor="color"
            />
          )
        )}
      </View>
    ),
    [onSquareRender]
  )
  return <ThemedGrid sub={sub}>{squares}</ThemedGrid>
}

// ── native scenario ──

// this is the engine's floor: the same commit with no React and no tamagui.
// its slots MUST mirror what compiler mode links or the comparison is rigged —
// the engine merges base over state per view per commit, so a floor carrying
// two state keys and no base does a fraction of the per-view work and reads
// artificially fast. base is the compiled square's flattened static style
// (what _withNativeStyle passes), state is the same five color keys the
// compiler mapping produces (borderColor expands per side); the values mirror
// v6 defaultConfig light_red / light_green, and timing is color-independent.
const NATIVE_BASE = {
  width: 10,
  height: 10,
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
  borderBottomRightRadius: 3,
  borderBottomLeftRadius: 3,
  borderTopWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  marginTop: 1,
  marginRight: 1,
  marginBottom: 1,
  marginLeft: 1,
  borderStyle: 'solid',
}

const sides = (color: string) => ({
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
})

const SLOTS: ViewSlots = {
  base: NATIVE_BASE,
  state: {
    red: { backgroundColor: '#ffe2e2', ...sides('#c10007') },
    green: { backgroundColor: '#dcfce7', ...sides('#008236') },
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

// ── rn floor scenarios ──

const rnStates = StyleSheet.create({
  red: { backgroundColor: '#ffe2e2', borderColor: '#c10007' },
  green: { backgroundColor: '#dcfce7', borderColor: '#008236' },
})

// RN's <View> is a JS component: it reads TextAncestorContext, destructures
// ~25 aria/accessibility props, and renders <ViewNativeComponent>, so every
// view costs two React elements and a context read per render.
// `unstable_NativeView` IS that inner host component (RN exports it as an
// escape hatch for libraries, no semver guarantee). The compiler emits
// `require('react-native').View` today, so the rnHost row measures the ceiling
// on what emitting the host component instead could buy the re-rendering
// paths. The fast path re-renders nothing, so it can only gain at mount.
const NativeViewPrimitive = (
  require('react-native') as { unstable_NativeView: typeof View }
).unstable_NativeView

function RNGrid({ sub, host }: { sub: 'red' | 'green'; host: boolean }) {
  const Square = host ? NativeViewPrimitive : View
  return (
    <View style={styles.grid}>
      {indices.map((i) => (
        <Square key={i} style={[styles.nativeSq, rnStates[sub]]} />
      ))}
    </View>
  )
}

// ── measurement ──

// every engine entry point goes through this wrapper, which times the
// synchronous native call and counts what kind of traffic a toggle produced.
// that separates ShadowTree commit cost from React/JS overhead inside jsDone,
// and shows whether a toggle rode the warm path (one setStateName) or refilled
// per-view state tables — the difference between compiler mode working and
// compiler mode redoing cold work every toggle.
const engineProbe = {
  applyCalls: 0,
  applyEntries: 0,
  tableCalls: 0,
  tableEntries: 0,
  stateNameCalls: 0,
  ms: 0,
  lastAt: 0,
}

const nativeEngine = registry as unknown as NativeStyleEngine

const timeEngineCall = (call: () => void) => {
  const start = performance.now()
  call()
  engineProbe.lastAt = performance.now()
  engineProbe.ms += engineProbe.lastAt - start
}

const probedEngine: NativeStyleEngine = {
  ...nativeEngine,
  applyViewStates(entries) {
    engineProbe.applyCalls += 1
    engineProbe.applyEntries += entries.length
    timeEngineCall(() => nativeEngine.applyViewStates(entries))
  },
  updateViewStateTables(entries) {
    engineProbe.tableCalls += 1
    engineProbe.tableEntries += entries.length
    timeEngineCall(() => nativeEngine.updateViewStateTables(entries))
  },
  setStateName(stateName, scopeId) {
    engineProbe.stateNameCalls += 1
    timeEngineCall(() => nativeEngine.setStateName(stateName, scopeId))
  },
}

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
  // synchronous time inside engine calls per toggle: the part of jsDone that
  // is native commit work rather than React/JS
  engineMs: ReturnType<typeof summarize>
  // jsDone is the max of these two, which hides which one it is waiting on.
  // engineAt is when the last engine call finished, reactAt when React's last
  // commit landed. a big reactAt with a tiny reactRenderMs means jsDone is
  // trailing an idle React commit that lands after the pixels are already
  // committed, not measuring work.
  engineAt: ReturnType<typeof summarize>
  reactAt: ReturnType<typeof summarize>
  jsDoneMissed: number
  reactCommits: number
  reactRenderMs: number
  sq0Commits: number
  // React.Profiler is compiled out of production React, so in a release build
  // every React counter here reads 0 whether or not the scenario re-rendered.
  // false means sq0Commits/reactRenderMs/jsDone prove nothing for this run;
  // read `frame` instead, and take the per-square re-render control from a dev
  // build.
  profiled: boolean
  engineCommits: number
  engineMisses: number
  // views linked to the engine while this scenario ran: the path proof.
  // an engine scenario reading 0 measured the React fallback, not the engine
  linkedViews: number
  // engine traffic over the measured toggles (warmups excluded)
  applyCalls: number
  applyEntries: number
  tableCalls: number
  tableEntries: number
  stateNameCalls: number
}

type Scenario =
  | 'tamagui'
  | 'fastpath'
  | 'compiled'
  | 'compiledFast'
  | 'native'
  | 'rn'
  | 'rnHost'

const engineScenarios: Scenario[] = ['fastpath', 'compiledFast', 'native']

export function NativeRegistryBenchCase() {
  const [scenario, setScenario] = useState<'none' | Scenario>('none')
  const [sub, setSub] = useState<'red' | 'green'>('red')
  const [results, setResults] = useState<Result[]>([])
  const [running, setRunning] = useState(false)
  // profiler control: commits + actualDuration inside the scenario subtree
  const profilerRef = useRef({ commits: 0, renderMs: 0, lastCommitAt: 0, sq0: 0 })
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

  const runScenario = async (name: Scenario, toggle: (next: 'red' | 'green') => void) => {
    setRunning(true)
    // the experimental core fast path is per-scenario: engine on only for the
    // scenarios whose name says so
    setNativeStyleEngine(engineScenarios.includes(name) ? probedEngine : null)
    setScenario(name)
    // let the scenario mount and settle before measuring
    for (let i = 0; i < 10; i++) await frame()

    profilerRef.current = { commits: 0, renderMs: 0, lastCommitAt: 0, sq0: 0 }
    const engineBefore = getStats()
    const sync: number[] = []
    const jsDone: number[] = []
    const frameTimes: number[] = []
    const engineMs: number[] = []
    const engineAt: number[] = []
    const reactAt: number[] = []
    let jsDoneMissed = 0
    let state: 'red' | 'green' = subRef.current
    let probeAtMeasureStart = { ...engineProbe }

    for (let i = 0; i < RUNS + WARMUP; i++) {
      if (i === WARMUP) probeAtMeasureStart = { ...engineProbe }
      state = state === 'red' ? 'green' : 'red'
      await frame()
      const t0 = performance.now()
      const engineMsBefore = engineProbe.ms
      toggle(state)
      const tSync = performance.now() - t0
      await frame()
      await frame()
      const tFrame = performance.now() - t0
      // js work is done at the later of: last React commit (Profiler) and the
      // last engine call (runtime mode commits in a microtask after the
      // provider commit; compiler mode commits in the provider's layout effect)
      const commitAt = Math.max(profilerRef.current.lastCommitAt, engineProbe.lastAt)
      if (i >= WARMUP) {
        sync.push(tSync)
        frameTimes.push(tFrame)
        engineMs.push(engineProbe.ms - engineMsBefore)
        if (engineProbe.lastAt > t0) engineAt.push(engineProbe.lastAt - t0)
        if (profilerRef.current.lastCommitAt > t0) {
          reactAt.push(profilerRef.current.lastCommitAt - t0)
        }
        if (name === 'native') {
          jsDone.push(tSync)
        } else if (commitAt > t0) {
          jsDone.push(commitAt - t0)
        } else {
          jsDoneMissed += 1
        }
      }
    }

    const engineAfter = getStats()
    const result: Result = {
      scenario: name,
      sync: summarize(sync),
      jsDone: summarize(jsDone.length ? jsDone : [0]),
      frame: summarize(frameTimes),
      engineMs: summarize(engineMs),
      engineAt: summarize(engineAt.length ? engineAt : [0]),
      reactAt: summarize(reactAt.length ? reactAt : [0]),
      jsDoneMissed,
      reactCommits: profilerRef.current.commits,
      reactRenderMs: Number(profilerRef.current.renderMs.toFixed(1)),
      sq0Commits: profilerRef.current.sq0,
      profiled: name === 'native' || profilerRef.current.commits > 0,
      engineCommits: engineAfter.commitCount - engineBefore.commitCount,
      engineMisses: engineAfter.missCount - engineBefore.missCount,
      linkedViews: engineBefore.viewCount,
      applyCalls: engineProbe.applyCalls - probeAtMeasureStart.applyCalls,
      applyEntries: engineProbe.applyEntries - probeAtMeasureStart.applyEntries,
      tableCalls: engineProbe.tableCalls - probeAtMeasureStart.tableCalls,
      tableEntries: engineProbe.tableEntries - probeAtMeasureStart.tableEntries,
      stateNameCalls: engineProbe.stateNameCalls - probeAtMeasureStart.stateNameCalls,
    }
    console.info(`[bench] ${JSON.stringify(result)}`)
    setResults((prev) => [...prev.filter((r) => r.scenario !== name), result])
    setRunning(false)
  }

  const toggleReact = (next: 'red' | 'green') => setSub(next)
  const toggleNative = (next: 'red' | 'green') => probedEngine.setStateName(next)

  return (
    <View style={styles.root} testID="benchRoot">
      <Text style={styles.info}>
        native: {String(isAvailable())} count: {COUNT} runs: {RUNS} (+{WARMUP} warmup)
        {running ? ' RUNNING' : ''}
      </Text>

      <View style={styles.row}>
        {(
          [
            ['runTamagui', 'tamagui', 'tamagui'],
            ['runFastpath', 'fastpath', 'fastpath'],
            ['runCompiled', 'compiled', 'compiled'],
            ['runCompiledFast', 'compiledFast', 'compiled fast'],
            ['runNative', 'native', 'native'],
            ['runRN', 'rn', 'rn floor'],
            ['runRNHost', 'rnHost', 'rn host view'],
          ] as [string, Scenario, string][]
        ).map(([testID, name, label]) => (
          <Pressable
            key={name}
            testID={testID}
            style={styles.button}
            disabled={running}
            onPress={() =>
              runScenario(name, name === 'native' ? toggleNative : toggleReact)
            }
          >
            <Text>run {label}</Text>
          </Pressable>
        ))}
      </View>

      {results.map((r) => (
        <Text key={r.scenario} style={styles.info} testID={`result-${r.scenario}`}>
          {r.scenario}: jsDone {r.jsDone.median}ms (min {r.jsDone.min} max {r.jsDone.max},
          missed {r.jsDoneMissed}) sync {r.sync.median}ms frame {r.frame.median}ms react
          commits {r.reactCommits} render {r.reactRenderMs}
          ms sq0 {r.sq0Commits} engine {r.engineCommits}c/{r.engineMisses}m linked{' '}
          {r.linkedViews} engineMs {r.engineMs.median} calls {r.stateNameCalls}s/
          {r.applyCalls}a({r.applyEntries})/{r.tableCalls}t({r.tableEntries})
          {r.profiled ? '' : ' PROFILER-OFF (react counters and jsDone blind)'}
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
          <RuntimeGrid key={scenario} sub={sub} onSquareRender={onSquareRender} />
        ) : null}
        {scenario === 'compiled' || scenario === 'compiledFast' ? (
          <CompiledGrid key={scenario} sub={sub} onSquareRender={onSquareRender} />
        ) : null}
        {scenario === 'native' ? <NativeGrid /> : null}
        {scenario === 'rn' || scenario === 'rnHost' ? (
          <RNGrid key={scenario} sub={sub} host={scenario === 'rnHost'} />
        ) : null}
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
