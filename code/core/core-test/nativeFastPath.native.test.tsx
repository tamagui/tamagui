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
  flushNativeStyleLinks,
  forceUpdateThemes,
  getMedia,
  getThemeProviderChainSizes,
  setMediaState,
  setNativeStyleEngine,
  styled,
  updateMediaListeners,
  useTheme,
  type NativeStyleEngine,
  type NativeStyleEngineSlots,
  type NativeViewStateUpdate,
} from '@tamagui/core'
import { act, cleanup, render } from '@testing-library/react-native'
import React, { Suspense, forwardRef, useMemo, useState } from 'react'
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import { View as NativeView } from 'react-native'
import { afterEach, beforeEach, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

// react native provides requestIdleCallback, which runs the engine's fiber walk
globalThis.requestIdleCallback ??= ((cb: () => void) =>
  setTimeout(cb, 0)) as unknown as typeof requestIdleCallback

const Square = styled(View, {
  width: 10,
  height: 10,
  backgroundColor: 'background',
  borderColor: 'color',
})

type Batch = NativeViewStateUpdate[]

type TableEntry = { tableId: number; state: string; props: Record<string, unknown> }

function createMockEngine() {
  const batches: Batch[] = []
  const tableEntries: TableEntry[] = []
  const tables = new Map<number, Record<string, Record<string, unknown>>>()
  const broadcasts: [string, string][] = []
  const links: {
    id: number
    scopeId: string
    table: number | undefined
    slots: NativeStyleEngineSlots
    commitNow: boolean
    activeState: string
  }[] = []
  const hosts: unknown[] = []
  let nextId = 1
  const engine: NativeStyleEngine = {
    link: (ref, table, scopeId = '', commitNow = false) => {
      hosts.push(ref)
      const linked = {
        id: nextId++,
        scopeId,
        table: typeof table === 'number' ? table : undefined,
        slots: typeof table === 'number' ? {} : table,
        commitNow,
        activeState: '',
      }
      links.push(linked)
      return {
        id: linked.id,
        unlink: () => {
          const index = links.indexOf(linked)
          if (index >= 0) links.splice(index, 1)
        },
      }
    },
    linkTables: (refs, tableIds, scopeIndexes, scopes) => {
      tableIds.forEach((table, i) => {
        hosts.push(refs[i])
        links.push({
          id: nextId++,
          scopeId: scopes[scopeIndexes[i]!]!,
          table,
          slots: {},
          commitNow: false,
          activeState: '',
        })
      })
    },
    unlink: (id) => {
      const index = links.findIndex((linked) => linked.id === id)
      if (index >= 0) links.splice(index, 1)
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
    setTableState: (tableId, state, props) => {
      tableEntries.push({ tableId, state, props })
      const table = tables.get(tableId) ?? {}
      table[state] = props
      tables.set(tableId, table)
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
    // mounts link lazily, so reading the links flushes them like a scope change would
    get links() {
      flushNativeStyleLinks()
      return links
    },
    hosts,
    entries: () => batches.flat(),
    tableEntries: () => tableEntries,
    /** the state table a linked view reads: its shared table or its own slots */
    states: (index: number) => {
      flushNativeStyleLinks()
      const linked = links[index]!
      return linked.table === undefined ? linked.slots.state! : tables.get(linked.table)!
    },
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

function Harness({ extraProps }: { extraProps?: Record<string, unknown> }) {
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

// a parent reading useTheme() passes a raw theme value as a prop. on a toggle
// the child's theme listener queues a push computed from its last props, then
// the parent re-renders it with the new value and React commits that. the
// queued push must not land after that commit, or the outgoing value returns
test('a re-render drops the push its theme listener queued from older props', async () => {
  let setPageSub: (sub: 'red' | 'blue') => void = () => {}
  const Page = React.memo(function Page() {
    const theme = useTheme()
    return <Square testID="raw" backgroundColor={theme.background.val as any} />
  })
  function PageHarness() {
    const [sub, setSubState] = useState<'red' | 'blue'>('red')
    setPageSub = setSubState
    const page = useMemo(() => <Page />, [])
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>{page}</Theme>
      </TamaguiProvider>
    )
  }

  const tree = render(<PageHarness />, { createNodeMock: () => ({}) })
  await flush()
  const red = (config.themes.dark_red.background as any).val
  const blue = (config.themes.dark_blue.background as any).val
  expect(red).not.toBe(blue)

  for (const [sub, expected, outgoing] of [
    ['blue', blue, red],
    ['red', red, blue],
    ['blue', blue, red],
  ] as const) {
    const before = mock.entries().length
    await act(async () => setPageSub(sub))
    await flush()
    // React rendered the new value
    const rendered = JSON.stringify(tree.toJSON())
    expect(rendered).toContain(expected)
    expect(rendered).not.toContain(outgoing)
    // and nothing the engine applied after it carries another value
    for (const entry of mock.entries().slice(before)) {
      if (entry.props && 'backgroundColor' in entry.props) {
        expect(entry.props.backgroundColor).toBe(expected)
      }
    }
  }
})

// react-freeze (react-native-screens freezeOnBlur) suspends a mounted subtree:
// its hosts detach their refs and its renders defer until it is revealed
const frozenForever = new Promise<never>(() => {})
function Suspender({ frozen }: { frozen: boolean }) {
  if (frozen) throw frozenForever
  return null
}
function Freeze({ frozen, children }: { frozen: boolean; children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Suspender frozen={frozen} />
      {children}
    </Suspense>
  )
}

test('a host revealed after a theme switch while frozen repaints the live theme (#4333)', async () => {
  let setFrozen: (frozen: boolean) => void = () => {}
  function FrozenHarness() {
    const [sub, _setSub] = useState('red')
    const [frozen, _setFrozen] = useState(false)
    setSub = _setSub
    setFrozen = _setFrozen
    const square = useMemo(() => <Square testID="sq" />, [])
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub as any}>
          <Freeze frozen={frozen}>{square}</Freeze>
        </Theme>
      </TamaguiProvider>
    )
  }
  // react native keeps one public instance per host across a hide; the test
  // renderer would hand the ref a fresh mock each attach
  const node = {}
  render(<FrozenHarness />, { createNodeMock: () => node })
  await flush()

  // visible: the engine paints blue natively while react's props stay red
  await act(async () => setSub('blue'))
  await flush()
  expect(mock.entries().at(-1)?.state).toBe('dark_blue')

  // frozen: the switch back to red reaches no linked view
  await act(async () => setFrozen(true))
  await act(async () => setSub('red'))
  await flush()
  const pushedBeforeReveal = mock.entries().length

  // revealed: react's props are red again, so its commit carries no color; the
  // native view still shows the blue paint unless the engine repaints it
  await act(async () => setFrozen(false))
  await flush()
  const reveal = mock.entries().slice(pushedBeforeReveal)
  const live = mock.links.at(-1)!
  const last = reveal.filter((entry) => entry.id === live.id).at(-1)
  expect(last?.props?.backgroundColor).toBe(
    (config.themes.dark_red.background as any).val
  )
})

// a render prop swap replaces the native host under the same component ref
const HostA = forwardRef<any, any>((props, ref) => <NativeView {...props} ref={ref} />)
const HostB = forwardRef<any, any>((props, ref) => <NativeView {...props} ref={ref} />)
let replaceHost = () => {}
function ReplacedHostHarness() {
  const [sub, _setSub] = useState('red')
  const [replaced, setReplaced] = useState(false)
  setSub = _setSub
  replaceHost = () => setReplaced(true)
  const square = useMemo(
    () => (
      <Square
        testID="sq"
        render={replaced ? <HostB /> : <HostA />}
        padding={replaced ? undefined : 4}
      />
    ),
    [replaced]
  )
  return (
    <TamaguiProvider config={config} defaultTheme="dark">
      <Theme name={sub as any}>{square}</Theme>
    </TamaguiProvider>
  )
}

test("a replaced host neither resyncs nor inherits the old host's pushed keys", async () => {
  render(<ReplacedHostHarness />, { createNodeMock: () => ({}) })
  await act(async () => setSub('blue'))
  await flush()
  expect(mock.entries().at(-1)?.props?.paddingTop).toBe(4)
  const oldHost = mock.hosts.at(-1)
  const pushed = mock.entries().length

  await act(async () => replaceHost())
  await flush()
  expect(mock.hosts.at(-1)).not.toBe(oldHost)
  const live = mock.links.at(-1)!
  expect(
    mock
      .entries()
      .slice(pushed)
      .filter((entry) => entry.id === live.id)
  ).toEqual([])
})

test('a declined link on a replaced host does not resync', async () => {
  render(<ReplacedHostHarness />, { createNodeMock: () => ({}) })
  await act(async () => setSub('blue'))
  await flush()
  const oldLink = mock.links.at(-1)!.id
  const pushed = mock.entries().length
  // nitro hybrid views and refs without a shadow node link to null
  mock.engine.link = () => null
  await act(async () => replaceHost())
  await flush()
  // only the replacing render's own push to the old view, before the swap
  expect(
    mock
      .entries()
      .slice(pushed)
      .map((entry) => entry.id)
  ).toEqual([oldLink])
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
  const tree = render(<Harness extraProps={{ borderWidth: 4 }} />, {
    createNodeMock: () => ({}),
  })
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
  const tree = render(<Harness extraProps={{ disableNativeStyle: true }} />, {
    createNodeMock: () => ({}),
  })
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
  expect(Object.keys(mock.states(0))).toEqual(['dark_red'])

  await act(async () => setCompiledSub('blue'))
  expect(hostRenders).toBe(1)
  expect(mock.tableEntries().slice(1)).toEqual([
    {
      tableId: mock.links[0].table,
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
  expect(mock.tableEntries()).toHaveLength(2)
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_red')
})

// react native freezes props in development, so a host's style array must never
// be written after it was handed over
test('a theme switch never writes into a style a host already received', async () => {
  let rendered: any
  const Host = forwardRef<any, any>((props, ref) => {
    Object.freeze(props.style)
    rendered = props.style
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    Host,
    { width: 10, height: 10 },
    { backgroundColor: 'background' }
  )
  let setSub: (sub: 'red' | 'blue') => void = () => {}
  function Harness() {
    const [sub, setSubState] = useState<'red' | 'blue'>('red')
    setSub = setSubState
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>
          <CompiledSquare testID="frozen" />
        </Theme>
      </TamaguiProvider>
    )
  }

  render(<Harness />, { createNodeMock: () => ({}) })
  const first = rendered
  await act(async () => setSub('blue'))
  await act(async () => setSub('red'))
  expect(Object.isFrozen(first)).toBe(true)
  expect(rendered[1]).toEqual({
    backgroundColor: (config.themes.dark_red.background as any).val,
  })
})

test('inline compiled views render in their parent and follow scope broadcasts', async () => {
  let hostRenders = 0
  const Host = forwardRef<any, any>((props, ref) => {
    hostRenders++
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    Host,
    { width: 10, height: 10 },
    { backgroundColor: 'background' }
  )
  // what the compiler emits for a list under a plain view
  function List({ items }: { items: string[] }) {
    return (
      <NativeView>
        {items.map((item) =>
          CompiledSquare.inline(<CompiledSquare key={item} testID={item} />)
        )}
      </NativeView>
    )
  }
  let setCompiledSub: (sub: 'red' | 'blue') => void = () => {}

  function CompiledHarness() {
    const [sub, setSubState] = useState<'red' | 'blue'>('red')
    setCompiledSub = setSubState
    const list = useMemo(() => <List items={['a', 'b']} />, [])
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>{list}</Theme>
      </TamaguiProvider>
    )
  }

  const tree = render(<CompiledHarness />, { createNodeMock: () => ({}) })
  // the host renders straight from List: no wrapper component between them
  expect(tree.UNSAFE_queryAllByType(CompiledSquare)).toHaveLength(0)
  expect(tree.UNSAFE_getAllByType(Host).map((node) => node.props.testID)).toEqual([
    'a',
    'b',
  ])
  expect(hostRenders).toBe(2)
  expect(mock.links).toHaveLength(2)
  expect(Object.keys(mock.states(0))).toEqual(['dark_red'])

  await act(async () => setCompiledSub('blue'))
  expect(hostRenders).toBe(2)
  expect(mock.tableEntries().at(-1)).toEqual({
    tableId: mock.links[0].table,
    state: 'dark_blue',
    props: { backgroundColor: (config.themes.dark_blue.background as any).val },
  })
  expect(mock.links[1].table).toBe(mock.links[0].table)
  expect(mock.entries()).toEqual([])
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_blue')
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
      tableId: mock.links[0].table,
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

// reproduces the on-device rotation bug: styleProps.mediaState is a
// mount-time snapshot in first-render mode (the native default), so media
// recomputes must resolve against the live global media state — and a real
// dimension change fires one listener pass per configured media key, which
// must coalesce into a single recompute
test('a media flip recomputes fresh styles and null-resets sm-only keys', async () => {
  const smWas = getMedia().sm
  render(
    // minHeight exists ONLY under sm; borderWidth has a base, so it changes
    // value instead of nulling
    <Harness extraProps={{ minHeight: 'sm:70', borderWidth: '2 sm:6' }} />,
    { createNodeMock: () => ({}) }
  )
  await flush()

  try {
    await act(async () => {
      // a dimension change updates each configured key separately, notifying
      // listeners after every one — the exact storm rotation produces
      setMediaState({ ...getMedia(), sm: true })
      updateMediaListeners()
      setMediaState({ ...getMedia(), md: !getMedia().md })
      updateMediaListeners()
      setMediaState({ ...getMedia(), lg: !getMedia().lg })
      updateMediaListeners()
    })
    await flush()

    // coalesced: one cold entry for the whole storm, computed under sm
    const activated = mock.entries()
    expect(activated).toHaveLength(1)
    expect(activated[0].props?.minHeight).toBe(70)
    // string candidates resolve through the size token scale, so assert the
    // sm value applied without pinning the token's numeric value
    const smBorder = activated[0].props?.borderTopWidth
    expect(smBorder).toBeTypeOf('number')

    await act(async () => {
      setMediaState({ ...getMedia(), sm: false })
      updateMediaListeners()
    })
    await flush()

    const deactivated = mock.entries().at(-1)!
    expect(deactivated.props?.minHeight).toBe(null)
    expect(deactivated.props?.borderTopWidth).toBeTypeOf('number')
    expect(deactivated.props?.borderTopWidth).not.toBe(smBorder)
  } finally {
    setMediaState({ ...getMedia(), sm: smWas })
  }
})

// the engine's color transport (srgb maps for Fabric's C++ prop parser) must
// never reach React: RN's JS style normalizer misreads it. render props stay
// raw, link slots and table updates carry the processed form
test('compiled mapping render props keep raw colors while engine tables carry processed colors', async () => {
  const processed = (value: unknown) => ({ space: 'srgb', from: value })
  mock.engine.processStyleColors = (props) => {
    const out: Record<string, unknown> = {}
    for (const key in props) {
      out[key] = typeof props[key] === 'string' ? processed(props[key]) : props[key]
    }
    return out
  }
  const CompiledSquare = _withNativeStyle(
    NativeView,
    { width: 10 },
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

  const tree = render(<CompiledHarness />, { createNodeMock: () => ({}) })
  const red = config.themes.dark_red as any
  const blue = config.themes.dark_blue as any

  const [, rendered] = tree.UNSAFE_getByType(NativeView).props.style
  expect(rendered).toEqual({
    backgroundColor: red.background.val,
    borderColor: red.color.val,
  })
  expect(mock.links).toHaveLength(1)
  expect(mock.states(0)).toEqual({
    dark_red: {
      backgroundColor: processed(red.background.val),
      borderColor: processed(red.color.val),
    },
  })

  await act(async () => setCompiledSub('blue'))
  expect(mock.tableEntries().slice(1)).toEqual([
    {
      tableId: mock.links[0].table,
      state: 'dark_blue',
      props: {
        backgroundColor: processed(blue.background.val),
        borderColor: processed(blue.color.val),
      },
    },
  ])
})

// a scope can advance (its layout effect runs) after a concurrent render
// captured the theme but before that render's host ref attaches. the link must
// use the live scope state and have the engine commit it once, or React's
// stale colors survive
test('a host linking after its scope advanced links to the live theme and commits it once', async () => {
  let hostRenders = 0
  let attachRef: () => void = () => {}
  const DeferredHost = forwardRef<any, any>((props, ref) => {
    hostRenders++
    attachRef = () => (ref as (node: unknown) => void)({ deferred: true })
    return <NativeView {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    DeferredHost,
    { width: 10 },
    { backgroundColor: 'background' }
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
  expect(mock.links).toHaveLength(0)

  // the scope moves on while the render that captured dark_red has not linked
  await act(async () => setCompiledSub('blue'))
  expect(hostRenders).toBe(1)
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_blue')

  attachRef()
  const blue = config.themes.dark_blue as any
  expect(mock.links).toHaveLength(1)
  // the live dark_blue entry is what the link reads, and it commits once
  expect(mock.states(0)).toEqual({ dark_blue: { backgroundColor: blue.background.val } })
  expect(mock.links[0].commitNow).toBe(true)

  // toggling back fills dark_red once for the mapping's shared table, never
  // per view, then broadcasts the state name
  await act(async () => setCompiledSub('red'))
  expect(mock.tableEntries().map(({ state }) => state)).toEqual(['dark_blue', 'dark_red'])
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_red')
  expect(hostRenders).toBe(1)
})

// the first mount attaches refs and captures the react root. a later remount
// renders with no ref, and the flush walks that root to link the new hosts
test('a remount after the react root is known links by walking fibers', async () => {
  const fiberRoot: { current: any } = { current: null }
  const hostRoot = {
    child: null as any,
    sibling: null,
    return: null,
    memoizedProps: null,
    stateNode: fiberRoot,
    tag: 3,
  }
  fiberRoot.current = hostRoot

  let generation = 0
  let builtFor = -1
  const pendingFibers: any[] = []
  const Host = forwardRef<any, any>((props, ref) => {
    if (builtFor !== generation) {
      builtFor = generation
      hostRoot.child = null
    }
    const fiber = {
      child: null,
      sibling: hostRoot.child,
      return: hostRoot,
      memoizedProps: { style: props.style },
      stateNode: { node: { generation } },
      tag: 5,
    }
    hostRoot.child = fiber
    pendingFibers.push(fiber)
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    Host,
    { width: 10, height: 10 },
    { backgroundColor: 'background' }
  )
  function List({ items }: { items: string[] }) {
    return (
      <NativeView>
        {items.map((item) =>
          CompiledSquare.inline(<CompiledSquare key={item} testID={item} />)
        )}
      </NativeView>
    )
  }
  let setGen: (next: number) => void = () => {}
  function Harness() {
    const [gen, setGenState] = useState(0)
    setGen = setGenState
    generation = gen
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name="red">
          <List key={gen} items={['a', 'b']} />
        </Theme>
      </TamaguiProvider>
    )
  }

  render(<Harness />, {
    createNodeMock: () => ({
      __internalInstanceHandle: pendingFibers[pendingFibers.length - 1],
    }),
  })
  expect(mock.links).toHaveLength(2)
  expect(
    mock.hosts
      .slice(0, 2)
      .every((host: any) => host?.__internalInstanceHandle && host.stateNode == null)
  ).toBe(true)

  pendingFibers.length = 0
  await act(async () => setGen(1))
  expect(mock.links).toHaveLength(4)
  const discovered = mock.hosts.slice(2)
  expect(discovered).toHaveLength(2)
  expect(discovered.every((host: any) => host?.stateNode?.node?.generation === 1)).toBe(
    true
  )
  expect(mock.links[2].table).toBe(mock.links[0].table)
  expect(mock.links[3].table).toBe(mock.links[0].table)
})

// a re-render after a theme switch hands hosts a new style array and state.
// the host keeps its link (same mapping, same scope), so the next switch must
// not re-link it: react clones a fabric instance on update, so only its
// canonical record identifies the host across renders
test('a host re-rendered after a theme switch keeps its link', async () => {
  const fiberRoot: { current: any } = { current: null }
  const hostRoot = {
    child: null as any,
    sibling: null,
    return: null,
    memoizedProps: null,
    stateNode: fiberRoot,
    tag: 3,
  }
  fiberRoot.current = hostRoot

  const canonicals = new Map<string, object>()
  let built = 0
  let builtFor = -1
  const fibers = new Map<string, any>()
  const Host = forwardRef<any, any>((props, ref) => {
    if (builtFor !== built) {
      builtFor = built
      hostRoot.child = null
    }
    let canonical = canonicals.get(props.testID)
    if (!canonical) canonicals.set(props.testID, (canonical = {}))
    const fiber = {
      child: null,
      sibling: hostRoot.child,
      return: hostRoot,
      memoizedProps: { style: props.style },
      // a fresh instance per render, like fabric's cloneInstance
      stateNode: { node: { testID: props.testID }, canonical },
      tag: 5,
    }
    hostRoot.child = fiber
    fibers.set(props.testID, fiber)
    return <NativeView ref={ref} {...props} />
  })
  const CompiledSquare = _withNativeStyle(
    Host,
    { width: 10, height: 10 },
    { backgroundColor: 'background' }
  )
  function List({ bump }: { bump: number }) {
    return (
      <NativeView testID={`list-${bump}`}>
        {['a', 'b'].map((item) =>
          CompiledSquare.inline(<CompiledSquare key={item} testID={item} />)
        )}
      </NativeView>
    )
  }
  let setState: (next: { sub: string; bump: number }) => void = () => {}
  function Harness() {
    const [state, set] = useState({ sub: 'red', bump: 0 })
    setState = set
    built = state.bump * 10 + (state.sub === 'red' ? 0 : 1)
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={state.sub as any}>
          <List bump={state.bump} />
        </Theme>
      </TamaguiProvider>
    )
  }

  render(<Harness />, {
    createNodeMock: (element: any) => ({
      __internalInstanceHandle: fibers.get(element.props.testID),
    }),
  })
  expect(mock.links).toHaveLength(2)

  // a plain re-render walks the hosts it already linked
  await act(async () => setState({ sub: 'red', bump: 1 }))
  expect(mock.links).toHaveLength(2)

  // a switch re-renders the hosts with the new state; the one after re-links nothing
  await act(async () => setState({ sub: 'blue', bump: 1 }))
  await act(async () => setState({ sub: 'red', bump: 2 }))
  expect(mock.links).toHaveLength(2)
  expect(mock.broadcasts.at(-1)?.[1]).toBe('dark_red')
})

test('compiled scopes keep independent arrays and stable live refs', async () => {
  const styles = new Map<string, any>()
  const refs = new Map<string, any>()
  const Host = forwardRef<any, any>((props, ref) => {
    styles.set(props.testID, Object.freeze(props.style))
    refs.set(props.testID, ref)
    return <NativeView {...props} ref={ref} />
  })
  const Compiled = _withNativeStyle(Host, {}, { backgroundColor: 'background' })
  function Harness({ first = 'red', tick = 0 }) {
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={first}>
          <Compiled testID="first" tick={tick} />
        </Theme>
        <Theme name="red">
          <Compiled testID="second" tick={tick} />
        </Theme>
      </TamaguiProvider>
    )
  }
  const mounted = render(<Harness />, { createNodeMock: () => ({}) })
  const first = styles.get('first')
  const second = styles.get('second')
  const firstRef = refs.get('first')
  expect(first).not.toBe(second)
  expect(mock.links[0].scopeId).not.toBe(mock.links[1].scopeId)
  mounted.rerender(<Harness tick={1} />)
  expect(styles.get('first')).toBe(first)
  expect(styles.get('second')).toBe(second)
  expect(refs.get('first')).toBe(firstRef)
  await act(async () => mounted.rerender(<Harness first="blue" tick={2} />))
  expect(styles.get('first')).not.toBe(first)
  expect(styles.get('second')).toBe(second)
  expect(first[1].backgroundColor).toBe((config.themes.dark_red.background as any).val)
  expect(styles.get('first')[1].backgroundColor).toBe(
    (config.themes.dark_blue.background as any).val
  )
  expect(refs.get('first')).toBe(firstRef)
  mounted.unmount()
})

// styled theme= wrappers push a distinct theme state without registering a live provider
// owner, so compiled hosts beneath them take the reactive fallback instead of the engine.
// an outer scheme switch must still repaint them with the right color and link nothing
// into another scope.
test('compiled host under a styled theme= scope repaints on an outer scheme switch', async () => {
  const styles: any[] = []
  const Host = forwardRef<any, any>((props, ref) => {
    styles.push(props.style)
    return <NativeView {...props} ref={ref} />
  })
  const Compiled = _withNativeStyle(Host, {}, { backgroundColor: 'background' })
  let setScheme: (scheme: 'dark' | 'light') => void = () => {}
  function Harness() {
    const [scheme, set] = useState<'dark' | 'light'>('dark')
    setScheme = set
    const child = useMemo(() => <Compiled />, [])
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={scheme}>
          <Square theme="red">{child}</Square>
        </Theme>
      </TamaguiProvider>
    )
  }
  const mounted = render(<Harness />, { createNodeMock: () => ({}) })
  flushNativeStyleLinks()
  const bgOf = () => styles.at(-1)[1].backgroundColor
  expect(bgOf()).toBe((config.themes.dark_red.background as any).val)
  const linksBefore = mock.links.length
  await act(async () => setScheme('light'))
  flushNativeStyleLinks()
  expect(bgOf()).toBe((config.themes.red.background as any).val)
  expect(bgOf()).not.toBe((config.themes.dark_red.background as any).val)
  // the fallback host never links into an engine scope
  expect(mock.links.length).toBe(linksBefore)
  mounted.unmount()
})

// keep the component factory alive while transient provider scopes and their host props
// become unreachable. the collector comes from the test itself so ordinary runs execute this.
setFlagsFromString('--expose-gc')
const collectGarbage = runInNewContext('gc') as () => void

test('compiled factories release transient scope arrays', async () => {
  const arrays: WeakRef<object>[] = []
  const Host = forwardRef<any, any>((props, ref) => {
    arrays.push(new WeakRef(props.style))
    return <NativeView {...props} ref={ref} />
  })
  const Compiled = _withNativeStyle(Host, {}, { backgroundColor: 'background' })
  async function transient() {
    const mounted = render(
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name="red">
          <Compiled />
        </Theme>
      </TamaguiProvider>,
      { createNodeMock: () => ({}) }
    )
    flushNativeStyleLinks()
    mounted.unmount()
  }
  for (let i = 0; i < 32; i++) await transient()
  // unmount alone leaves renderers in the testing library cleanup queue.
  cleanup()
  // the mock engine records hosts; the native engine prunes unmounted hosts.
  mock.hosts.length = 0
  mock.links.length = 0
  expect(getThemeProviderChainSizes()).toEqual({ layers: 0, parents: 0 })
  // weak references keep their targets alive until the current job ends.
  await new Promise((resolve) => setTimeout(resolve, 0))
  collectGarbage()
  expect(arrays.filter((array) => array.deref())).toHaveLength(0)
  // the factory remains usable after its previous scopes have been collected.
  await transient()
})

test.each([true, false])(
  'inline compiled elements preserve React keys (engine: %s)',
  (themed) => {
    if (!themed) setNativeStyleEngine(null)
    const Compiled = _withNativeStyle(NativeView, {}, { backgroundColor: 'background' })
    function Probe() {
      for (const props of [{}, { key: 'first' }, { key: 42 }, { key: null }]) {
        const element = React.createElement(Compiled, props)
        expect(Compiled.inline(element).key).toBe(element.key)
      }
      return null
    }
    const mounted = render(
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name="red">
          <Probe />
        </Theme>
      </TamaguiProvider>
    )
    mounted.unmount()
  }
)
