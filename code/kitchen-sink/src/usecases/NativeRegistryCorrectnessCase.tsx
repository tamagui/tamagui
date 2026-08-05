import { setNativeStyleEngine, type NativeStyleEngine } from '@tamagui/core'
import * as registry from '@tamagui/native-registry'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native'
import { Square, Theme } from 'tamagui'

const listItems = Array.from({ length: 80 }, (_, index) => index)
const nativeEngine = registry as unknown as NativeStyleEngine

type Scenario = 'nested' | 'list' | 'churn'
type Mode = 'fallback' | 'fast'

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const ThemeSwatch = memo(function ThemeSwatch({ testID }: { testID: string }) {
  return (
    <Square
      testID={testID}
      width={56}
      height={56}
      borderRadius="4"
      borderWidth="2"
      backgroundColor="$background"
      borderColor="$color"
    />
  )
})

const ListRow = memo(function ListRow({ item }: { item: number }) {
  return (
    <View style={styles.listRow}>
      <Text style={styles.rowLabel}>row {item}</Text>
      <ThemeSwatch testID={`native-fast-list-row-${item}`} />
    </View>
  )
})

export function NativeRegistryCorrectnessCase() {
  const [mode, setMode] = useState<Mode>('fallback')
  const [scenario, setScenario] = useState<Scenario>('nested')
  const [themeName, setThemeName] = useState<'red' | 'green'>('red')
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [churnStatus, setChurnStatus] = useState('idle')
  const [metrics, setMetrics] = useState('{}')
  const probe = useRef({
    activeLinks: new Set<number>(),
    linkCalls: 0,
    unlinkCalls: 0,
    applyCalls: 0,
    applyEntries: 0,
    tableCalls: 0,
    tableEntries: 0,
    stateNameCalls: 0,
    startCommitCount: 0,
    startMissCount: 0,
    linkedBaseKeys: [] as string[],
    linkedStateNames: [] as string[],
  })

  const probedEngine = useMemo<NativeStyleEngine>(
    () => ({
      ...nativeEngine,
      link(ref, slots, scopeId) {
        probe.current.linkedBaseKeys = Object.keys(slots.base || {})
        probe.current.linkedStateNames = Object.keys(slots.state || {})
        const linked = nativeEngine.link(ref, slots, scopeId)
        if (!linked) return null
        probe.current.linkCalls += 1
        probe.current.activeLinks.add(linked.id)
        return {
          id: linked.id,
          unlink() {
            if (probe.current.activeLinks.delete(linked.id)) {
              probe.current.unlinkCalls += 1
            }
            linked.unlink()
          },
        }
      },
      applyViewStates(entries) {
        probe.current.applyCalls += 1
        probe.current.applyEntries += entries.length
        nativeEngine.applyViewStates(entries)
      },
      updateViewStateTables(entries) {
        probe.current.tableCalls += 1
        probe.current.tableEntries += entries.length
        nativeEngine.updateViewStateTables(entries)
      },
      setStateName(stateName, scopeId) {
        probe.current.stateNameCalls += 1
        nativeEngine.setStateName(stateName, scopeId)
      },
    }),
    []
  )

  useEffect(() => {
    if (ready) return

    const stats = registry.getStats()
    probe.current.startCommitCount = stats.commitCount
    probe.current.startMissCount = stats.missCount
    setNativeStyleEngine(mode === 'fast' ? probedEngine : null)
    const frameId = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frameId)
  }, [mode, probedEngine, ready, scenario])

  useEffect(
    () => () => {
      setNativeStyleEngine(null)
    },
    []
  )

  const prepare = (nextScenario: Scenario, nextMode: Mode) => {
    setReady(false)
    setMounted(true)
    setChurnStatus('idle')
    setThemeName('red')
    setScenario(nextScenario)
    setMode(nextMode)
    probe.current.activeLinks.clear()
    probe.current.linkCalls = 0
    probe.current.unlinkCalls = 0
    probe.current.applyCalls = 0
    probe.current.applyEntries = 0
    probe.current.tableCalls = 0
    probe.current.tableEntries = 0
    probe.current.stateNameCalls = 0
    probe.current.linkedBaseKeys = []
    probe.current.linkedStateNames = []
    setMetrics('{}')
  }

  const refreshMetrics = async () => {
    await frame()
    await frame()
    const stats = registry.getStats()
    const activeId = probe.current.activeLinks.values().next().value
    const activeView = activeId === undefined ? null : registry.getViewState(activeId)
    setMetrics(
      JSON.stringify({
        mode,
        scenario,
        themeName,
        activeLinks: probe.current.activeLinks.size,
        linkCalls: probe.current.linkCalls,
        unlinkCalls: probe.current.unlinkCalls,
        applyCalls: probe.current.applyCalls,
        applyEntries: probe.current.applyEntries,
        tableCalls: probe.current.tableCalls,
        tableEntries: probe.current.tableEntries,
        stateNameCalls: probe.current.stateNameCalls,
        linkedBaseKeys: probe.current.linkedBaseKeys,
        linkedStateNames: probe.current.linkedStateNames,
        commits: stats.commitCount - probe.current.startCommitCount,
        misses: stats.missCount - probe.current.startMissCount,
        activeState: activeView?.activeState,
        activeBackground: activeView?.nativeProps?.backgroundColor,
        stateNames: activeView ? Object.keys(activeView.states || {}) : [],
      })
    )
  }

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<number>) => <ListRow item={item} />,
    []
  )

  const runChurn = async () => {
    setChurnStatus('running')
    let nextTheme: 'red' | 'green' = 'red'
    for (let cycle = 0; cycle < 15; cycle++) {
      setMounted(false)
      await frame()
      nextTheme = nextTheme === 'red' ? 'green' : 'red'
      setThemeName(nextTheme)
      await frame()
      setMounted(true)
      await frame()
      await frame()
      nextTheme = nextTheme === 'red' ? 'green' : 'red'
      setThemeName(nextTheme)
      await frame()
      await frame()
    }
    nextTheme = 'green'
    setThemeName(nextTheme)
    await frame()
    await frame()
    setChurnStatus(`done:15:${nextTheme}`)
  }

  return (
    <View style={styles.root} testID="native-fast-correctness-root">
      <View style={styles.controls}>
        <Pressable
          testID="native-fast-nested-fallback"
          style={styles.button}
          onPress={() => prepare('nested', 'fallback')}
        >
          <Text>nested fallback</Text>
        </Pressable>
        <Pressable
          testID="native-fast-nested-fast"
          style={styles.button}
          onPress={() => prepare('nested', 'fast')}
        >
          <Text>nested fast</Text>
        </Pressable>
        <Pressable
          testID="native-fast-list"
          style={styles.button}
          onPress={() => prepare('list', 'fast')}
        >
          <Text>list</Text>
        </Pressable>
        <Pressable
          testID="native-fast-churn"
          style={styles.button}
          onPress={() => prepare('churn', 'fast')}
        >
          <Text>churn</Text>
        </Pressable>
        <Pressable
          testID="native-fast-toggle-theme"
          style={styles.button}
          onPress={() => setThemeName((name) => (name === 'red' ? 'green' : 'red'))}
        >
          <Text>toggle theme</Text>
        </Pressable>
        <Pressable
          testID="native-fast-refresh-metrics"
          style={styles.button}
          onPress={refreshMetrics}
        >
          <Text>metrics</Text>
        </Pressable>
      </View>

      <Text testID="native-fast-state">
        {scenario}:{mode}:{themeName}:{ready ? 'ready' : 'mounting'}
      </Text>
      <Text testID="native-fast-metrics">{metrics}</Text>

      {ready && scenario === 'nested' ? (
        <Theme name={themeName}>
          <View style={styles.swatches}>
            <ThemeSwatch testID="native-fast-outer" />
            <Theme name="level2">
              <ThemeSwatch testID="native-fast-nested-level2" />
            </Theme>
            <Theme name="blue">
              <ThemeSwatch testID="native-fast-pinned-blue" />
            </Theme>
          </View>
        </Theme>
      ) : null}

      {ready && scenario === 'list' ? (
        <Theme name={themeName}>
          <FlatList
            testID="native-fast-list-view"
            data={listItems}
            renderItem={renderItem}
            keyExtractor={String}
            getItemLayout={(_data, index) => ({ length: 68, offset: 68 * index, index })}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            updateCellsBatchingPeriod={10}
            windowSize={3}
            removeClippedSubviews
          />
        </Theme>
      ) : null}

      {ready && scenario === 'churn' ? (
        <View style={styles.churn}>
          <Pressable
            testID="native-fast-run-churn"
            style={styles.button}
            disabled={churnStatus === 'running'}
            onPress={runChurn}
          >
            <Text>run churn</Text>
          </Pressable>
          <Text testID="native-fast-churn-status">{churnStatus}</Text>
          <Theme name={themeName}>
            {mounted ? <ThemeSwatch testID="native-fast-churn-swatch" /> : null}
          </Theme>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 12, gap: 8 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  button: { backgroundColor: '#ddd', borderRadius: 6, padding: 8 },
  swatches: { flexDirection: 'row', gap: 18, paddingTop: 20 },
  listRow: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  rowLabel: { color: '#777' },
  churn: { gap: 12, alignItems: 'flex-start' },
})
