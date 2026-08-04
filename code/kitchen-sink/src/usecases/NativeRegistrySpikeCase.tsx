// phase 0 spike for @tamagui/native-registry (plans/native-fast-path.md).
// proves/refutes the three interactions the engine design depends on:
//   1. a native ShadowTree commit survives a parent React re-render
//   2. it survives a Reanimated animation on the same view and a sibling
//   3. views under a Suspense boundary link and receive commits after resume
//
// box A renders mirror-consistent styles (resolveSlots): it must NEVER show a
// stale color. box B intentionally renders the styles captured at first render:
// if a parent re-render visually reverts box B, React prop commits clobber
// native updates and the JS mirror is load-bearing; if box B keeps the native
// color, commits are sticky at the platform level. either outcome is a result.
import React, { Suspense, useEffect, useReducer, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import {
  getStats,
  isAvailable,
  link,
  resolveSlots,
  setStateName,
  type ViewSlots,
} from '@tamagui/native-registry'

const SLOTS: ViewSlots = {
  base: { borderRadius: 12 },
  state: {
    light: { backgroundColor: '#f5f5f5', borderColor: '#111111', borderWidth: 2 },
    dark: { backgroundColor: '#111111', borderColor: '#f5f5f5', borderWidth: 2 },
  },
}

function useLinked(slots: ViewSlots) {
  const unlinkRef = useRef<null | (() => void)>(null)
  return {
    ref: (instance: unknown) => {
      unlinkRef.current?.()
      unlinkRef.current = instance ? link(instance, slots) : null
    },
    unlink: () => {
      unlinkRef.current?.()
      unlinkRef.current = null
    },
  }
}

function LinkedBoxA() {
  const { ref } = useLinked(SLOTS)
  // mirror-consistent: any re-render paints what the engine last committed
  return <View ref={ref} style={[styles.box, resolveSlots(SLOTS) as any]} testID="boxA" />
}

function LinkedBoxB() {
  const { ref } = useLinked(SLOTS)
  // deliberately stale: captures first-render styles and re-renders with them
  const initialStyle = useRef(resolveSlots(SLOTS)).current
  return <View ref={ref} style={[styles.box, initialStyle as any]} testID="boxB" />
}

function AnimatedLinkedBox() {
  const { ref } = useLinked(SLOTS)
  const width = useSharedValue(80)
  useEffect(() => {
    width.value = withRepeat(withTiming(160, { duration: 800 }), -1, true)
  }, [width])
  const animStyle = useAnimatedStyle(() => ({ width: width.value }))
  return (
    <Animated.View
      ref={ref as any}
      style={[styles.box, resolveSlots(SLOTS) as any, animStyle]}
      testID="boxAnimated"
    />
  )
}

let suspensePromise: Promise<void> | null = null
let suspenseDone = false
function resetSuspense() {
  suspensePromise = null
  suspenseDone = false
}
function SuspendingChild() {
  if (!suspenseDone) {
    suspensePromise ??= new Promise((resolve) =>
      setTimeout(() => {
        suspenseDone = true
        resolve()
      }, 1000)
    )
    throw suspensePromise
  }
  return <LinkedBoxA />
}

export function NativeRegistrySpikeCase() {
  const [, forceRender] = useReducer((n: number) => n + 1, 0)
  const [renderCount, setRenderCount] = useState(0)
  const [dark, setDark] = useState(false)
  const [showAnimated, setShowAnimated] = useState(false)
  const [showSuspense, setShowSuspense] = useState(false)
  const stats = getStats()

  return (
    <View style={styles.root} testID="spikeRoot">
      <Text testID="available">native: {String(isAvailable())}</Text>
      <Text testID="stats">
        views={stats.viewCount} commits={stats.commitCount} misses={stats.missCount}
      </Text>
      <Text testID="renderCount">parent renders: {renderCount}</Text>

      <Pressable
        testID="toggleState"
        style={styles.button}
        onPress={() => {
          const next = dark ? 'light' : 'dark'
          setDark(!dark)
          // the native commit: no React state involved in the linked boxes
          setStateName(next)
        }}
      >
        <Text>toggle state (now: {dark ? 'dark' : 'light'})</Text>
      </Pressable>

      <Pressable
        testID="rerenderParent"
        style={styles.button}
        onPress={() => {
          setRenderCount((n) => n + 1)
          forceRender()
        }}
      >
        <Text>re-render parent</Text>
      </Pressable>

      <Pressable
        testID="toggleAnimated"
        style={styles.button}
        onPress={() => setShowAnimated((v) => !v)}
      >
        <Text>toggle reanimated box</Text>
      </Pressable>

      <Pressable
        testID="toggleSuspense"
        style={styles.button}
        onPress={() => {
          resetSuspense()
          setShowSuspense((v) => !v)
        }}
      >
        <Text>toggle suspense box</Text>
      </Pressable>

      <View style={styles.row}>
        <LinkedBoxA />
        <LinkedBoxB />
        {showAnimated ? <AnimatedLinkedBox /> : null}
      </View>

      {showSuspense ? (
        <Suspense fallback={<Text>suspending…</Text>}>
          <SuspendingChild />
        </Suspense>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: 12, padding: 20 },
  row: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  box: { width: 80, height: 80 },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
})
