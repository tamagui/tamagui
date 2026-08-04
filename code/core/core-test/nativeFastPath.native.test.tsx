process.env.TAMAGUI_TARGET = 'native'

// runtime fast path integration (plans/native-fast-path.md): a mock engine
// stands in for @tamagui/native-registry, the rest is the real pipeline —
// createComponent eligibility + linking, useThemeState interception, warm
// cache, dropped-key null semantics, disableNativeStyle opt-out. the theme
// listener path only engages for memoized children (same as real apps): the
// provider re-renders on toggle but square elements keep identity.
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  Theme,
  View,
  createTamagui,
  setNativeStyleEngine,
  styled,
  type NativeStyleEngine,
  type NativeViewStateUpdate,
} from '@tamagui/core'
import { act, render } from '@testing-library/react-native'
import React, { useMemo, useState } from 'react'
import { afterEach, beforeEach, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Square = styled(View, {
  width: 10,
  height: 10,
  backgroundColor: 'background',
  borderColor: 'color',
})

type Batch = NativeViewStateUpdate[]

function createMockEngine() {
  const batches: Batch[] = []
  let nextId = 1
  const engine: NativeStyleEngine = {
    link: () => ({ id: nextId++, unlink: () => {} }),
    applyViewStates: (entries) => {
      batches.push(entries)
    },
    processStyleColors: (props) => props,
  }
  return { engine, batches, entries: () => batches.flat() }
}

let mock: ReturnType<typeof createMockEngine>

beforeEach(() => {
  mock = createMockEngine()
  setNativeStyleEngine(mock.engine)
})

afterEach(() => {
  setNativeStyleEngine(null)
})

let setSub: (sub: string) => void
let bumpRender: () => void

function Harness({
  extraProps,
}: {
  extraProps?: Record<string, unknown>
}) {
  const [sub, _setSub] = useState('red')
  const [bump, setBump] = useState(0)
  setSub = _setSub
  bumpRender = () => setBump((b) => b + 1)
  const squares = useMemo(
    () => <Square testID="sq" {...extraProps} margin={bump % 2 ? 3 : 2} />,
    [bump, extraProps]
  )
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name={sub as any}>{squares}</Theme>
    </TamaguiProvider>
  )
}

const flush = async () => {
  // queueNativeViewState flushes in a microtask
  await act(async () => {})
}

test('theme toggle commits through the engine with zero re-renders', async () => {
  const tree = render(<Harness />, { createNodeMock: () => ({}) })
  await flush()
  expect(mock.entries()).toHaveLength(0)

  const before = JSON.stringify(tree.toJSON())

  await act(async () => setSub('blue'))
  await flush()

  // one batch, one cold entry carrying the recomputed style
  const entries = mock.entries()
  expect(entries).toHaveLength(1)
  expect(entries[0].state).toBe('dark_blue')
  expect(entries[0].props?.backgroundColor).toBe(
    (config.themes.dark_blue.background as any).val
  )
  // border colors expand per-side in computed styles
  expect(entries[0].props?.borderTopColor).toBe(
    (config.themes.dark_blue.color as any).val
  )

  // the React tree did NOT re-render: it still holds the old committed style
  // (the engine, not React, owns the visual update on this path)
  expect(JSON.stringify(tree.toJSON())).toBe(before)
})

test('re-toggling a pushed theme is warm: bare entry, no style computation', async () => {
  render(<Harness />, { createNodeMock: () => ({}) })
  await act(async () => setSub('blue'))
  await flush()
  await act(async () => setSub('red'))
  await flush()
  await act(async () => setSub('blue'))
  await flush()

  const entries = mock.entries()
  expect(entries).toHaveLength(3)
  // the initial render's theme (dark_red) was never pushed, so the first
  // toggle back is cold too; only the SECOND visit to dark_blue is warm
  expect(entries[1].state).toBe('dark_red')
  expect(entries[1].props).toBeTruthy()
  expect(entries[2]).toEqual({ id: entries[0].id, state: 'dark_blue' })
})

test('a real re-render resets the warm cache', async () => {
  render(<Harness />, { createNodeMock: () => ({}) })
  await act(async () => setSub('blue'))
  await flush()
  await act(async () => bumpRender())
  await act(async () => setSub('red'))
  await flush()

  const entries = mock.entries()
  // both toggles cold: the re-render invalidated the pushed set
  expect(entries).toHaveLength(2)
  expect(entries.every((e) => !!e.props)).toBe(true)
})

test('keys dropped by a re-render are pushed as null resets', async () => {
  const tree = render(<Harness extraProps={{ borderWidth: 4 }} />, { createNodeMock: () => ({}) })
  await act(async () => setSub('blue'))
  await flush()
  expect(mock.entries()[0].props?.borderTopWidth).toBe(4)

  // re-render without borderWidth: the render itself must re-push with a
  // null reset so RN's sticky nativeProps merge cannot resurrect the 4
  tree.rerender(<Harness />, { createNodeMock: () => ({}) })
  await flush()

  const entries = mock.entries()
  const last = entries[entries.length - 1]
  expect(last.props).toBeTruthy()
  expect(last.props!.borderTopWidth).toBeNull()
})

test('disableNativeStyle opts out: no entries, normal re-render', async () => {
  const tree = render(<Harness extraProps={{ disableNativeStyle: true }} />, { createNodeMock: () => ({}) })
  await flush()
  const before = JSON.stringify(tree.toJSON())

  await act(async () => setSub('blue'))
  await flush()

  expect(mock.entries()).toHaveLength(0)
  // the tree re-rendered with the new theme color
  expect(JSON.stringify(tree.toJSON())).not.toBe(before)
  expect(JSON.stringify(tree.toJSON())).toContain(
    (config.themes.dark_blue.background as any).val
  )
})
