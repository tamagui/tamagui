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
  _withNativeStyle,
  _withStableStyle,
  createTamagui,
  forceUpdateThemes,
  setNativeStyleEngine,
  styled,
  type NativeStyleEngine,
  type NativeStyleEngineSlots,
  type NativeViewStateTableUpdate,
  type NativeViewStateUpdate,
} from '@tamagui/core'
import { act, render } from '@testing-library/react-native'
import React, { forwardRef, useMemo, useState } from 'react'
import { View as NativeView } from 'react-native'
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
  const tableBatches: NativeViewStateTableUpdate[][] = []
  const broadcasts: [string, string][] = []
  const links: {
    id: number
    scopeId: string
    slots: NativeStyleEngineSlots
    activeState: string
  }[] = []
  let nextId = 1
  const engine: NativeStyleEngine = {
    link: (_ref, slots, scopeId = '') => {
      const linked = { id: nextId++, scopeId, slots, activeState: '' }
      links.push(linked)
      return {
        id: linked.id,
        unlink: () => {
          const index = links.indexOf(linked)
          if (index >= 0) links.splice(index, 1)
        },
      }
    },
    applyViewStates: (entries) => {
      batches.push(entries)
      for (const entry of entries) {
        const linked = links.find(({ id }) => id === entry.id)
        if (!linked) continue
        if (entry.props) (linked.slots.state ||= {})[entry.state] = entry.props
        linked.activeState = entry.state
      }
    },
    updateViewStateTables: (entries) => {
      tableBatches.push(entries)
      for (const entry of entries) {
        const linked = links.find(({ id }) => id === entry.id)
        if (linked) (linked.slots.state ||= {})[entry.state] = entry.props
      }
    },
    processStyleColors: (props) => props,
    setStateName: (stateName, scopeId = '') => {
      broadcasts.push([scopeId, stateName])
    },
    removeScope: () => {},
  }
  return {
    engine,
    batches,
    broadcasts,
    links,
    tableBatches,
    entries: () => batches.flat(),
    tableEntries: () => tableBatches.flat(),
  }
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

test('compiled mappings resolve once on first activation, then use scope broadcasts', async () => {
  let hostRenders = 0
  const Host = forwardRef<any, any>((props, ref) => {
    hostRenders++
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    Host,
    { width: 10, height: 10 },
    { backgroundColor: 'background', borderColor: 'color' }
  )
  let setCompiledSub: (sub: 'red' | 'blue') => void = () => {}

  function CompiledHarness() {
    const [sub, setSubState] = useState<'red' | 'blue'>('red')
    setCompiledSub = setSubState
    const square = useMemo(() => <CompiledSquare testID="compiled" />, [])
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>{square}</Theme>
      </TamaguiProvider>
    )
  }

  render(<CompiledHarness />, { createNodeMock: () => ({}) })
  expect(hostRenders).toBe(1)
  expect(mock.links).toHaveLength(1)
  expect(Object.keys(mock.links[0].slots.state!)).toEqual(['dark_red'])

  await act(async () => setCompiledSub('blue'))
  expect(hostRenders).toBe(1)
  expect(mock.tableEntries()).toEqual([
    {
      id: mock.links[0].id,
      state: 'dark_blue',
      props: {
        backgroundColor: (config.themes.dark_blue.background as any).val,
        borderColor: (config.themes.dark_blue.color as any).val,
      },
    },
  ])
  expect(mock.entries()).toEqual([])
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_blue')

  await act(async () => setCompiledSub('red'))
  expect(hostRenders).toBe(1)
  expect(mock.tableEntries()).toHaveLength(1)
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_red')
})

test('compiled mapping fallback renders the same live styles as the stable helper', async () => {
  setNativeStyleEngine(null)
  const base = { width: 10, height: 10 }
  const mapping = { backgroundColor: 'background', borderColor: 'color' }
  const CompiledFallback = _withNativeStyle(NativeView, base, mapping)
  const Stable = _withStableStyle(
    NativeView,
    (theme) => [
      base,
      {
        backgroundColor: theme.background?.get(),
        borderColor: theme.color?.get(),
      },
    ],
    true,
    false
  )

  const readStyles = async (Component: React.ComponentType<any>) => {
    let setFallbackSub: (sub: 'red' | 'blue') => void = () => {}
    function FallbackHarness() {
      const [sub, setSubState] = useState<'red' | 'blue'>('red')
      setFallbackSub = setSubState
      return (
        <TamaguiProvider config={config} defaultTheme="dark">
          <Theme name={sub}>
            <Component testID="fallback" />
          </Theme>
        </TamaguiProvider>
      )
    }
    const tree = render(<FallbackHarness />, { createNodeMock: () => ({}) })
    const before = tree.UNSAFE_getByType(NativeView).props.style
    await act(async () => setFallbackSub('blue'))
    const after = tree.UNSAFE_getByType(NativeView).props.style
    tree.unmount()
    return { before, after }
  }

  expect(await readStyles(CompiledFallback)).toEqual(await readStyles(Stable))
})

test('compiled mappings refresh the active native table after a theme mutation', async () => {
  let hostRenders = 0
  const Host = forwardRef<any, any>((props, ref) => {
    hostRenders++
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(Host, {}, { backgroundColor: 'background' })
  const square = <CompiledSquare />
  const original = config.themes.dark_red

  render(
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name="red">{square}</Theme>
    </TamaguiProvider>,
    { createNodeMock: () => ({}) }
  )

  try {
    config.themes.dark_red = {
      ...original,
      background: config.themes.dark_blue.background,
    }
    await act(async () => forceUpdateThemes())

    expect(hostRenders).toBe(1)
    expect(mock.tableEntries().at(-1)).toEqual({
      id: mock.links[0].id,
      state: 'dark_red',
      props: {
        backgroundColor: (config.themes.dark_blue.background as any).val,
      },
    })
  } finally {
    config.themes.dark_red = original
    await act(async () => forceUpdateThemes())
  }
})
