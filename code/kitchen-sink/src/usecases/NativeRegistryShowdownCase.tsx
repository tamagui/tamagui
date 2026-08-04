import React, {
  Profiler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { Theme, View as TamaguiView, styled } from 'tamagui'
import {
  setNativeStyleEngine,
  setNativeStyleEngineFlushListener,
  type NativeStyleEngine,
} from '@tamagui/core'
import * as registry from '@tamagui/native-registry'

const COUNT = 400
const TOGGLE_INTERVAL_MS = 400
const RUN_DURATION_MS = 15_000
const DOT_TRAVEL = 300

const indices = Array.from({ length: COUNT }, (_, index) => index)

const ShowdownSquare = styled(TamaguiView, {
  width: 10,
  height: 10,
  borderRadius: 3,
  borderWidth: 1,
  margin: 1,
  backgroundColor: '$background',
  borderColor: '$color',
})

type SubTheme = 'red' | 'green'

type Hud = {
  toggles: number
  leftMs: number | null
  rightMs: number | null
  leftCommits: number
  rightCommits: number
}

const initialHud: Hud = {
  toggles: 0,
  leftMs: null,
  rightMs: null,
  leftCommits: 0,
  rightCommits: 0,
}

// this component never consumes the theme. its child elements keep stable
// identity, so profiler commits come from square theme listeners, not the
// parent HUD updating.
const ShowdownGrid = memo(function ShowdownGrid({
  disableNativeStyle,
  profilerId,
  onRender,
}: {
  disableNativeStyle: boolean
  profilerId: string
  onRender: React.ProfilerOnRenderCallback
}) {
  const squares = useMemo(
    () => (
      <View style={styles.grid}>
        {indices.map((index) =>
          disableNativeStyle ? (
            <ShowdownSquare key={index} disableNativeStyle />
          ) : (
            <ShowdownSquare key={index} />
          )
        )}
      </View>
    ),
    [disableNativeStyle]
  )

  return (
    <Profiler id={profilerId} onRender={onRender}>
      {squares}
    </Profiler>
  )
})

function ShowdownPanel({
  kind,
  sub,
  hud,
  onRender,
}: {
  kind: 'today' | 'fast'
  sub: SubTheme
  hud: Hud
  onRender: React.ProfilerOnRenderCallback
}) {
  const isToday = kind === 'today'
  const ms = isToday ? hud.leftMs : hud.rightMs
  const commits = isToday ? hud.leftCommits : hud.rightCommits

  return (
    <View style={[styles.panel, isToday ? styles.todayPanel : styles.fastPanel]}>
      <Text style={[styles.panelTitle, isToday ? styles.todayTitle : styles.fastTitle]}>
        {isToday ? 'today' : 'native fast path'}
      </Text>
      <Text style={styles.metricLabel}>
        {isToday ? 'Profiler JS done' : 'native flush JS done'}
      </Text>
      <Text style={styles.metricValue}>{ms === null ? '--' : ms.toFixed(1)} ms</Text>
      <Text style={styles.commitCount}>React commits: {commits}</Text>

      <Theme name={sub as any}>
        <ShowdownGrid
          disableNativeStyle={isToday}
          profilerId={kind}
          onRender={onRender}
        />
      </Theme>
    </View>
  )
}

export function NativeRegistryShowdownCase() {
  const [engineReady, setEngineReady] = useState(false)
  const [sub, setSub] = useState<SubTheme>('red')
  const [running, setRunning] = useState(false)
  const [hud, setHud] = useState(initialHud)

  const runningRef = useRef(false)
  const subRef = useRef<SubTheme>('red')
  const toggleAtRef = useRef(0)
  const metricsRef = useRef(initialHud)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dotProgress = useRef(new Animated.Value(0)).current

  const publishHud = useCallback(() => {
    setHud({ ...metricsRef.current })
  }, [])

  const onLeftRender = useCallback<React.ProfilerOnRenderCallback>(() => {
    if (!runningRef.current || toggleAtRef.current === 0) return
    metricsRef.current.leftCommits += 1
    metricsRef.current.leftMs = performance.now() - toggleAtRef.current
    publishHud()
  }, [publishHud])

  const onRightRender = useCallback<React.ProfilerOnRenderCallback>(() => {
    if (!runningRef.current) return
    metricsRef.current.rightCommits += 1
    publishHud()
  }, [publishHud])

  const onNativeFlush = useCallback(() => {
    if (!runningRef.current || toggleAtRef.current === 0) return
    metricsRef.current.rightMs = performance.now() - toggleAtRef.current
    publishHud()
  }, [publishHud])

  // mount the two grids only after the experimental engine and its honesty
  // instrumentation are installed. cleanup keeps other usecases unaffected.
  useEffect(() => {
    setNativeStyleEngine(registry as unknown as NativeStyleEngine)
    setNativeStyleEngineFlushListener(onNativeFlush)
    setEngineReady(true)

    return () => {
      runningRef.current = false
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
      if (stopTimerRef.current !== null) clearTimeout(stopTimerRef.current)
      setNativeStyleEngineFlushListener(null)
      setNativeStyleEngine(null)
    }
  }, [onNativeFlush])

  useEffect(() => {
    if (!running) {
      dotProgress.setValue(0)
      return
    }

    const startedAt = performance.now()
    let frameId = 0
    const animate = (now: number) => {
      const phase = ((now - startedAt) % 2000) / 1000
      dotProgress.setValue(phase <= 1 ? phase : 2 - phase)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [dotProgress, running])

  const stop = useCallback(() => {
    runningRef.current = false
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (stopTimerRef.current !== null) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    if (runningRef.current || !engineReady) return

    metricsRef.current = { ...initialHud }
    toggleAtRef.current = 0
    runningRef.current = true
    setHud({ ...initialHud })
    setRunning(true)

    const toggle = () => {
      const next = subRef.current === 'red' ? 'green' : 'red'
      subRef.current = next
      toggleAtRef.current = performance.now()
      metricsRef.current.toggles += 1
      setSub(next)
      publishHud()
    }

    toggle()
    intervalRef.current = setInterval(toggle, TOGGLE_INTERVAL_MS)
    stopTimerRef.current = setTimeout(stop, RUN_DURATION_MS)
  }, [engineReady, publishHud, stop])

  const dotTranslate = useMemo(
    () => dotProgress.interpolate({ inputRange: [0, 1], outputRange: [0, DOT_TRAVEL] }),
    [dotProgress]
  )
  const dotStyle = useMemo(
    () => ({ transform: [{ translateX: dotTranslate }] }),
    [dotTranslate]
  )

  if (!engineReady) {
    return (
      <View style={styles.root}>
        <Text style={styles.loading}>preparing native style engine...</Text>
      </View>
    )
  }

  return (
    <View style={styles.root} testID="showdownRoot">
      <Text style={styles.title}>theme switch showdown</Text>
      <Text style={styles.subtitle}>
        {COUNT} identical themed views per side, red ↔ green every {TOGGLE_INTERVAL_MS}ms
      </Text>

      <Pressable
        accessibilityLabel="Start showdown"
        accessibilityRole="button"
        disabled={running}
        onPress={start}
        style={[styles.startButton, running && styles.startButtonRunning]}
        testID="startShowdown"
      >
        <Text style={styles.startButtonText}>
          {running ? `running · ${hud.toggles} toggles` : 'start 15 second showdown'}
        </Text>
      </Pressable>

      <View style={styles.jankCard}>
        <Text style={styles.jankTitle}>shared JS thread jank meter</Text>
        <Text style={styles.jankCaption}>
          baseline renders are the load; rAF dot pauses expose blocked JS frames
        </Text>
        <View style={styles.dotTrack}>
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>
      </View>

      <View style={styles.stateRow}>
        <Text style={styles.stateLabel}>shared sub-theme</Text>
        <View style={[styles.stateChip, stateColors[sub]]}>
          <Text style={styles.stateText}>{sub}</Text>
        </View>
      </View>

      <View style={styles.panels}>
        <ShowdownPanel
          kind="today"
          sub={sub}
          hud={hud}
          onRender={onLeftRender}
        />
        <ShowdownPanel kind="fast" sub={sub} hud={hud} onRender={onRightRender} />
      </View>
    </View>
  )
}

const stateColors = StyleSheet.create({
  red: { backgroundColor: '#ffe2e2', borderColor: '#c10007' },
  green: { backgroundColor: '#dcfce7', borderColor: '#008236' },
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 10,
    padding: 16,
    backgroundColor: '#f7f7f5',
  },
  loading: { color: '#444', fontSize: 18, paddingTop: 40, textAlign: 'center' },
  title: { color: '#111827', fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { color: '#59606d', fontSize: 13, lineHeight: 18 },
  startButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  startButtonRunning: { backgroundColor: '#374151' },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  jankCard: {
    gap: 5,
    borderColor: '#d1d5db',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  jankTitle: { color: '#111827', fontSize: 13, fontWeight: '700' },
  jankCaption: { color: '#6b7280', fontSize: 11 },
  dotTrack: {
    width: DOT_TRAVEL + 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2563eb' },
  stateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stateLabel: { color: '#6b7280', fontSize: 12, fontWeight: '600' },
  stateChip: {
    minWidth: 62,
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stateText: { color: '#111827', fontSize: 12, fontWeight: '700' },
  panels: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  panel: {
    flex: 1,
    gap: 3,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: '#fff',
    padding: 8,
  },
  todayPanel: { borderColor: '#f87171' },
  fastPanel: { borderColor: '#4ade80' },
  panelTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  todayTitle: { color: '#b91c1c' },
  fastTitle: { color: '#15803d' },
  metricLabel: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase' },
  metricValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  commitCount: { color: '#4b5563', fontSize: 11, marginBottom: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
})
