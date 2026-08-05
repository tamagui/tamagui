// correctness parity for the native fast path runtime mode
// (plans/native-fast-path.md). unlike the bench case (which proves speed),
// this proves the engine commits the SAME styles a real re-render would, in
// the situations that can break it:
//   - many prop kinds (colors, radius, opacity, shadow, spacing, sm: media)
//   - nested sub-themes: a pinned inner theme must receive NO updates when
//     the outer theme toggles; followers must all update
//   - warm-path integrity: re-toggling an already-pushed theme sends bare
//     {id, state} entries (no style computation), with zero engine misses
//   - render invalidation: a real re-render resets the warm cache, so the
//     next toggle is cold again (pushed props can never outlive the render
//     that produced them)
//   - engine table introspection via getViewState (activeState + both theme
//     tables present + sticky nativeProps synced)
//   - media flips (rotate the sim): sm: activates in landscape (minWidth
//     640), adds paddingBottom; rotating back must push paddingBottom: null
//     (reset-to-default), never leave it stuck
// run with ?test=NativeRegistryParityCase / -directUseCase, tap "run parity",
// read [parity] lines or the on-screen PASS/FAIL list. rotation checks are
// reported live in the media section as you rotate.
import React, { Profiler, useEffect, useMemo, useRef, useState } from 'react'
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Theme, View as TamaguiView, styled } from 'tamagui'
import {
  getConfig,
  setNativeStyleEngine,
  setNativeStyleEngineFlushListener,
  type NativeStyleEngine,
  type NativeViewStateUpdate,
} from '@tamagui/core'
import * as registry from '@tamagui/native-registry'
import { getStats, getViewState, isAvailable } from '@tamagui/native-registry'

const FOLLOWERS = 6

const PSquare = styled(TamaguiView, {
  width: 56,
  height: 56,
  margin: '2',
  padding: '2',
  borderRadius: '4',
  opacity: 0.9,
  backgroundColor: 'background',
  borderColor: 'color',
  shadowColor: 'shadow-color',
  shadowOpacity: 0.5,
  shadowRadius: 4,
  // v3 flat candidates. sm (minWidth 640) is landscape-only on iPhone:
  // paddingBottom exists ONLY there, so rotating back exercises the
  // dropped-key null push
  borderWidth: '2 sm:6',
  paddingBottom: 'sm:30',
  // sm-ONLY key with no base value: rotating back must push minHeight: null
  // (padding/border above always exist via base values, so they can never
  // exercise the dropped-key reset)
  minHeight: 'sm:70',
})

type Check = { name: string; pass: boolean; detail?: string }

// memoized like real apps (and the bench case): the Theme provider re-renders
// on toggle but square elements keep identity, so square re-renders can only
// come from tamagui's theme listeners — the exact path the fast path
// intercepts. renderBump changing produces new elements = a real re-render.
function ParityGrid({
  outer,
  renderBump,
  onSq0Render,
}: {
  outer: 'red' | 'green'
  renderBump: number
  onSq0Render: () => void
}) {
  const squares = useMemo(
    () => (
      <View style={styles.grid}>
        {Array.from({ length: FOLLOWERS }, (_, i) =>
          i === 0 ? (
            <Profiler key={i} id="sq0" onRender={onSq0Render}>
              <PSquare margin={renderBump % 2 ? 9 : 8} />
            </Profiler>
          ) : (
            <PSquare key={i} margin={renderBump % 2 ? 9 : 8} />
          )
        )}
        <Theme name="blue">
          {/* pinned: outer toggles must never touch this view */}
          <PSquare testID="pinned" margin={renderBump % 2 ? 9 : 8} />
        </Theme>
      </View>
    ),
    [renderBump, onSq0Render]
  )
  return <Theme name={outer}>{squares}</Theme>
}

export function NativeRegistryParityCase() {
  const [outer, setOuter] = useState<'red' | 'green'>('red')
  // bumping forces a real re-render of every square (margin changes)
  const [renderBump, setRenderBump] = useState(0)
  const [checks, setChecks] = useState<Check[]>([])
  const [running, setRunning] = useState(false)
  // linking happens in each square's ref callback at mount, so the engine
  // must be set BEFORE the grid mounts: gate the grid on it (same pattern as
  // the showdown case)
  const [engineReady, setEngineReady] = useState(false)
  const [mediaLog, setMediaLog] = useState('rotate the sim to test media')
  const flushesRef = useRef<NativeViewStateUpdate[][]>([])
  const sq0Renders = useRef(0)
  const onSq0Render = useRef(() => {
    sq0Renders.current += 1
  }).current

  // engine on for the case's lifetime; flushes recorded for assertions.
  // media-driven flushes (rotation) are reported live outside runParity.
  useEffect(() => {
    setNativeStyleEngine(registry as unknown as NativeStyleEngine)
    setEngineReady(true)
    setNativeStyleEngineFlushListener((entries) => {
      flushesRef.current.push(entries)
      const cold = entries.filter((e) => e.props)
      const nulled = cold.filter(
        (e) => e.props && Object.values(e.props).some((v) => v === null)
      )
      const withPB = cold.filter((e) => e.props && e.props.paddingBottom != null)
      const dist = (key: string) => {
        const counts: Record<string, number> = {}
        for (const e of cold) {
          const v = e.props ? e.props[key] : undefined
          counts[String(v)] = (counts[String(v)] || 0) + 1
        }
        return JSON.stringify(counts)
      }
      console.info(
        `[mediaflush] entries=${entries.length} cold=${cold.length} withPB=${withPB.length} nulled=${nulled.length} pb=${dist('paddingBottom')} minH=${dist('minHeight')}`
      )
      setMediaLog(
        `last flush: ${entries.length} entries, ${cold.length} cold, ` +
          `${withPB.length} with paddingBottom, ${nulled.length} with null resets` +
          (nulled[0]?.props
            ? ` (${Object.entries(nulled[0].props)
                .filter(([, v]) => v === null)
                .map(([k]) => k)
                .join(',')})`
            : '')
      )
    })
    return () => {
      setNativeStyleEngineFlushListener(null)
      setNativeStyleEngine(null)
    }
  }, [])

  const settle = async () => {
    // theme listener -> microtask flush -> commit; two frames covers it
    await new Promise<void>((r) => requestAnimationFrame(() => r()))
    await new Promise<void>((r) => requestAnimationFrame(() => r()))
  }

  const runParity = async () => {
    setRunning(true)
    const results: Check[] = []
    const themes = getConfig().themes

    // resolved through the same color pipeline the engine pushes through
    const expectedBg = (sub: 'red' | 'green') => {
      const raw = themes[`light_${sub}`]?.background?.val
      return raw == null
        ? undefined
        : (registry.processStyleColors({ backgroundColor: raw })
            .backgroundColor as unknown)
    }

    await settle()
    const statsBefore = getStats()
    results.push({
      name: 'views linked',
      pass: statsBefore.viewCount >= FOLLOWERS + 1,
      detail: `viewCount ${statsBefore.viewCount}`,
    })

    // 1: cold toggle red -> green. all followers push props, pinned view
    // receives nothing, square renders stay at zero
    flushesRef.current = []
    sq0Renders.current = 0
    setOuter('green')
    await settle()
    let flushed = flushesRef.current.flat()
    let cold = flushed.filter((e) => e.props)
    results.push({
      name: 'cold toggle pushes all followers',
      pass: flushed.length === FOLLOWERS && cold.length === FOLLOWERS,
      detail: `${flushed.length} entries, ${cold.length} cold (want ${FOLLOWERS})`,
    })
    results.push({
      name: 'pinned inner theme untouched',
      pass: flushed.every((e) => e.state === 'light_green'),
      detail: [...new Set(flushed.map((e) => e.state))].join(','),
    })
    const wantBg = expectedBg('green')
    const gotBg = cold[0]?.props?.backgroundColor
    results.push({
      name: 'pushed bg matches theme value',
      pass: wantBg !== undefined && JSON.stringify(gotBg) === JSON.stringify(wantBg),
      detail: `got ${JSON.stringify(gotBg)} want ${JSON.stringify(wantBg)}`,
    })
    const propKeys = cold[0]?.props ? Object.keys(cold[0].props) : []
    // border props expand per-side in computed styles
    const expectKeys = [
      'backgroundColor',
      'borderTopColor',
      'shadowColor',
      'shadowOpacity',
      'opacity',
      'borderTopWidth',
      'borderTopLeftRadius',
    ]
    const missing = expectKeys.filter((k) => !propKeys.includes(k))
    // padding may stay shorthand or expand per-side depending on style mode
    if (!propKeys.some((k) => k.startsWith('padding'))) missing.push('padding*')
    results.push({
      name: 'pushed style covers all prop kinds',
      pass: missing.length === 0,
      detail: `missing: ${missing.join(',') || 'none'}`,
    })
    results.push({
      name: 'zero square re-renders on toggle',
      pass: sq0Renders.current === 0,
      detail: `sq0 renders ${sq0Renders.current}`,
    })

    // 2: returning to the mount state is still cold (the mounting render's
    // state is never pushed); re-toggling an already-pushed state rides the
    // warm cache: bare entries, no misses
    flushesRef.current = []
    setOuter('red')
    await settle()
    flushed = flushesRef.current.flat()
    const firstReturnCold =
      flushed.length === FOLLOWERS && flushed.every((e) => !!e.props)
    flushesRef.current = []
    const missesBefore = getStats().missCount
    setOuter('green')
    await settle()
    flushed = flushesRef.current.flat()
    results.push({
      name: 'warm toggle sends bare entries',
      pass:
        firstReturnCold &&
        flushed.length === FOLLOWERS &&
        flushed.every((e) => e.props === undefined),
      detail: `${flushed.length} entries, ${flushed.filter((e) => e.props).length} carried props${firstReturnCold ? '' : ' (first-return not cold)'}`,
    })
    results.push({
      name: 'zero engine misses',
      pass: getStats().missCount === missesBefore,
      detail: `misses +${getStats().missCount - missesBefore}`,
    })

    // 3: engine tables via introspection
    const sampleId = flushed[0]?.id
    const snap = sampleId != null ? getViewState(sampleId) : null
    results.push({
      name: 'getViewState: active + both tables + sticky synced',
      pass:
        !!snap &&
        snap.activeState === 'light_green' &&
        !!snap.states?.light_red &&
        !!snap.states?.light_green &&
        snap.nativeProps?.backgroundColor !== undefined,
      detail: snap
        ? `active ${snap.activeState}, tables ${Object.keys(snap.states || {}).join(',')}`
        : 'no snapshot',
    })

    // 4: a real re-render invalidates the warm cache -> next toggle is cold
    setRenderBump((b) => b + 1)
    await settle()
    flushesRef.current = []
    setOuter('red')
    await settle()
    flushed = flushesRef.current.flat()
    results.push({
      name: 're-render resets warm cache (cold again)',
      pass: flushed.length === FOLLOWERS && flushed.every((e) => !!e.props),
      detail: `${flushed.length} entries, ${flushed.filter((e) => e.props).length} cold`,
    })

    console.info(
      `[parity] ${JSON.stringify({ pass: results.every((r) => r.pass), results })}`
    )
    setChecks(results)
    setRunning(false)
  }

  const available = isAvailable()

  return (
    <ScrollView style={styles.root} testID="parityRoot">
      <Text style={styles.info}>
        native: {String(available)} {running ? 'RUNNING' : ''}
      </Text>
      <Pressable
        testID="runParity"
        style={styles.button}
        disabled={running || !available}
        onPress={runParity}
      >
        <Text>run parity</Text>
      </Pressable>

      <Pressable
        testID="flipMedia"
        style={styles.button}
        onPress={() => {
          // fires the same Dimensions change event a rotation does, which is
          // all the media driver listens to — lets us exercise $sm without
          // GUI-rotating the simulator
          const win = Dimensions.get('window')
          const screen = Dimensions.get('screen')
          const swap = (d: typeof win) => ({ ...d, width: d.height, height: d.width })
          console.info(
            `[mediaflip] ${win.width}x${win.height} -> ${win.height}x${win.width}`
          )
          ;(Dimensions as any).set({ window: swap(win), screen: swap(screen) })
        }}
      >
        <Text>flip media (w: {Dimensions.get('window').width})</Text>
      </Pressable>

      <Text
        style={styles.info}
        testID="parityResult"
        accessibilityLabel={
          checks.length
            ? checks.every((c) => c.pass)
              ? 'PARITY PASS'
              : 'PARITY FAIL'
            : 'PARITY IDLE'
        }
      >
        {checks.length
          ? checks.every((c) => c.pass)
            ? 'ALL PASS'
            : 'FAILURES PRESENT'
          : 'not run yet'}
      </Text>
      {checks.map((c) => (
        <Text
          key={c.name}
          style={[styles.info, { color: c.pass ? '#008236' : '#c10007' }]}
        >
          {c.pass ? 'PASS' : 'FAIL'} {c.name} — {c.detail}
        </Text>
      ))}

      <Text style={styles.info} testID="mediaLog">
        {mediaLog}
      </Text>

      {engineReady ? (
        <ParityGrid outer={outer} renderBump={renderBump} onSq0Render={onSq0Render} />
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  info: { color: '#888', fontSize: 12, marginVertical: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
})
