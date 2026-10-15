process.env.TAMAGUI_TARGET = 'native'

import { transform } from 'esbuild'
import * as ReactModule from 'react'
import * as JSXRuntime from 'react/jsx-runtime'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

import configDefault from '../../../core/config-default'
import * as Core from '../../../core/web/src'
import { extractForNative } from './lib/extract'

vi.mock('react-native', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-native')>()
  const { createElement } = await import('react')
  const host = (name: string) => (props: Record<string, unknown>) =>
    createElement(name, props, props.children as any)
  return {
    ...original,
    Image: host('Image'),
    Platform: { ...original.Platform, OS: 'macos' },
    Pressable: host('Pressable'),
    ScrollView: host('ScrollView'),
    Text: host('Text'),
    TextInput: host('TextInput'),
    View: host('View'),
    // RN's registry returns the component NAME for host components, so this is
    // what `unstable_NativeView` actually is at runtime, and it lets a render
    // show whether the compiler skipped the <View> wrapper
    unstable_NativeView: 'RCTView',
    StyleSheet: {
      ...original.StyleSheet,
      flatten: (style: unknown) => style,
    },
    useWindowDimensions: () => ({ width: 1000, height: 800, scale: 1, fontScale: 1 }),
  }
})

vi.mock('@tamagui/constants', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tamagui/constants')>()),
  isNativeDesktop: true,
  isWeb: false,
}))

import * as ReactNative from 'react-native'
import { processStyleColors } from '../../../core/native-registry/src/processStyleColors'

const {
  TamaguiProvider,
  Theme,
  View,
  createTamagui,
  setNativeStyleEngine,
  setupHooks,
  styled,
} = Core
const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

function createMockEngine() {
  const links: {
    id: number
    scopeId: string
    table: Core.NativeStyleEngineSlots | number
    commitNow: boolean
  }[] = []
  const updates: Core.NativeViewStateUpdate[] = []
  const tableEntries: {
    tableId: number
    state: string
    props: Record<string, unknown>
  }[] = []
  const tables = new Map<number, Record<string, Record<string, unknown>>>()
  const scopeStates: [string, string][] = []
  let nextId = 1
  const engine: Core.NativeStyleEngine = {
    link: (_ref, table, scopeId = '', commitNow = false) => {
      const id = nextId++
      links.push({ id, scopeId, table, commitNow })
      return { id, unlink: () => {} }
    },
    linkTables: (_refs, tableIds, scopeIndexes, scopes) => {
      tableIds.forEach((table, i) => {
        links.push({
          id: nextId++,
          scopeId: scopes[scopeIndexes[i]!]!,
          table,
          commitNow: false,
        })
      })
    },
    unlink: () => {},
    applyViewStates: (entries) => updates.push(...entries),
    setTableState: (tableId, state, props) => {
      tableEntries.push({ tableId, state, props })
      const table = tables.get(tableId) ?? {}
      table[state] = props
      tables.set(tableId, table)
    },
    processStyleColors,
    setStateName: (stateName, scopeId = '') => {
      scopeStates.push([scopeId, stateName])
    },
    removeScope: () => {},
  }
  // the shared state table a linked view reads from
  const states = (index: number) => {
    Core.flushNativeStyleLinks()
    const { table } = links[index]!
    return typeof table === 'number' ? tables.get(table)! : table.state!
  }
  return {
    engine,
    // mounts link lazily, so reading the links flushes them like a scope change would
    get links() {
      Core.flushNativeStyleLinks()
      return links
    },
    scopeStates,
    states,
    tableEntries,
    updates,
  }
}

afterEach(() => {
  setNativeStyleEngine(null)
})

function styleValue(node: { props: { style?: unknown } }, key: string) {
  const styles = (Array.isArray(node.props.style) ? node.props.style : [node.props.style])
    .flat(Number.POSITIVE_INFINITY)
    .filter(Boolean) as Record<string, unknown>[]
  return styles.reduce<unknown>(
    (value, style) => (key in style ? style[key] : value),
    undefined
  )
}

async function executeCompiled(
  source: string,
  options?: Parameters<typeof extractForNative>[1]
) {
  const output = await extractForNative(source, options)
  expect(output.diagnostics).toEqual([])
  const transformed = await transform(output.code, {
    format: 'cjs',
    jsx: 'automatic',
    loader: 'tsx',
    platform: 'node',
    target: 'es2021',
  })
  const compiledModule = { exports: {} as Record<string, ReactModule.ComponentType> }
  const localRequire = (specifier: string) => {
    if (specifier === 'react') return ReactModule
    if (specifier === 'react/jsx-runtime') return JSXRuntime
    if (specifier === 'react-native') return ReactNative
    if (specifier === '@tamagui/core') return Core
    // flattened output leaves the original component imports behind unused
    if (specifier === 'tamagui') {
      return new Proxy({}, { get: () => () => null })
    }
    throw new Error(`Unexpected compiled dependency: ${specifier}`)
  }
  Function(
    'require',
    'module',
    'exports',
    transformed.code
  )(localRequire, compiledModule, compiledModule.exports)
  return { exports: compiledModule.exports, code: output.code, stats: output.stats }
}

test('fully-flattened theme values read the live theme and update on theme change', async () => {
  const { exports: compiled } = await executeCompiled(
    `
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack testID="themed" bg="background" padding={8} />
    }
  `,
    { options: { experimental: { nativeFastPath: false } } }
  )

  const lightBackground = config.themes.light.background.val
  const darkBackground = config.themes.dark.background.val
  expect(lightBackground).not.toBe(darkBackground)

  // the extract pipeline flips TAMAGUI_TARGET while bundling configs; pin it
  // back so the runtime render below behaves like a real native bundle
  process.env.TAMAGUI_TARGET = 'native'

  const Test = compiled.Test!
  const app = (themeName: 'light' | 'dark') => (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={themeName}>
        <Test />
      </Theme>
    </TamaguiProvider>
  )
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(app('light'))
  })
  const view = () =>
    renderer.root.findAll((node) => node.props?.testID === 'themed').at(-1)!
  expect(styleValue(view(), 'backgroundColor')).toBe(lightBackground)
  expect(styleValue(view(), 'padding')).toBe(8)

  act(() => {
    renderer.update(app('dark'))
  })
  expect(styleValue(view(), 'backgroundColor')).toBe(darkBackground)
  expect(styleValue(view(), 'padding')).toBe(8)
})

test('flag-off native output is byte-identical to the existing compiler path', async () => {
  const source = `
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack testID="themed" bg="background" borderColor="color" padding={8} />
    }
  `
  const baseline = await extractForNative(source)
  const disabled = await extractForNative(source, {
    options: { experimental: { nativeFastPath: false } },
  })

  expect(disabled.code).toBe(baseline.code)
  expect(disabled.stats).toEqual(baseline.stats)
  expect(disabled.diagnostics).toEqual(baseline.diagnostics)
})

test('flag-on output uses the existing theme-hook path when no engine is installed', async () => {
  const { exports: compiled } = await executeCompiled(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <YStack testID="themed" bg="background" padding={8} />
      }
    `,
    { options: { experimental: { nativeFastPath: true } } }
  )
  setNativeStyleEngine(null)
  process.env.TAMAGUI_TARGET = 'native'

  const Test = compiled.Test!
  const app = (themeName: 'light' | 'dark') => (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={themeName}>
        <Test />
      </Theme>
    </TamaguiProvider>
  )
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(app('light'))
  })
  const view = () =>
    renderer.root.findAll((node) => node.props?.testID === 'themed').at(-1)!
  expect(styleValue(view(), 'backgroundColor')).toBe(config.themes.light.background.val)

  act(() => renderer.update(app('dark')))
  expect(styleValue(view(), 'backgroundColor')).toBe(config.themes.dark.background.val)

  act(() => renderer.unmount())
})

test('theme values with opacity modifiers stay on the runtime path', async () => {
  const source = `
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack bg="background/50" />
    }
  `
  const baseline = await extractForNative(source)
  const output = await extractForNative(source, {
    options: { experimental: { nativeFastPath: true } },
  })
  expect(output.code).toBe(baseline.code)
  expect(output.stats).toEqual(baseline.stats)
  expect(output.diagnostics).toEqual(baseline.diagnostics)
  expect(output.diagnostics.map(({ code }) => code)).toEqual([
    'local/dynamic-style-value',
  ])
})

test('flag-on native output links a compact mapping with shared lazy states', async () => {
  const { exports: compiled } = await executeCompiled(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <>
          <YStack testID="first" bg="background" borderColor="color" padding={8} />
          <YStack testID="second" bg="background" borderColor="color" padding={8} />
        </>
      }
    `,
    { options: { experimental: { nativeFastPath: true } } }
  )
  const mock = createMockEngine()
  setNativeStyleEngine(mock.engine)
  process.env.TAMAGUI_TARGET = 'native'

  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      <TamaguiProvider config={config} defaultTheme="dark">
        {ReactModule.createElement(compiled.Test!)}
      </TamaguiProvider>,
      { createNodeMock: () => ({}) }
    )
  })

  expect(mock.links).toHaveLength(2)
  // both views share one native table, filled once for the active state
  expect(mock.links[0]!.table).toBe(mock.links[1]!.table)
  const states = mock.states(0)
  expect(Object.keys(states)).toEqual(['dark'])
  const keySet = Object.keys(states.dark!).sort()
  expect(keySet).toEqual([
    'backgroundColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'borderTopColor',
  ])
  expect(states.dark!.backgroundColor).toBe(
    processStyleColors({
      backgroundColor: config.themes.dark.background.val,
    }).backgroundColor
  )
  expect(mock.tableEntries.map(({ state }) => state)).toEqual(['dark'])

  act(() => renderer.unmount())
})

test('missing theme values resolve to null in every lazily filled state', async () => {
  const { exports: compiled } = await executeCompiled(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <YStack bg="optionalColor" padding={8} />
      }
    `,
    {
      options: {
        config: './tests/fixtures/native-fast-path.config.cjs',
        experimental: { nativeFastPath: true },
      },
    }
  )
  const mock = createMockEngine()
  setNativeStyleEngine(mock.engine)
  process.env.TAMAGUI_TARGET = 'native'

  const originalDark = config.themes.dark
  config.themes.dark = { ...originalDark, optionalColor: '#123456' } as any
  let setTheme: (name: 'dark' | 'light') => void = () => {}
  function Harness() {
    const [name, setName] = ReactModule.useState<'dark' | 'light'>('dark')
    setTheme = setName
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={name}>{ReactModule.createElement(compiled.Test!)}</Theme>
      </TamaguiProvider>
    )
  }
  let renderer: ReactTestRenderer | undefined
  try {
    act(() => {
      renderer = create(<Harness />, { createNodeMock: () => ({}) })
    })

    await act(async () => setTheme('light'))
    const states = mock.states(0)
    expect(Object.keys(states.dark!).sort()).toEqual(Object.keys(states.light!).sort())
    expect(states.dark!.backgroundColor).toBe(
      processStyleColors({ backgroundColor: '#123456' }).backgroundColor
    )
    expect(states.light!.backgroundColor).toBeNull()
    expect(mock.tableEntries.map(({ state }) => state)).toEqual(['dark', 'light'])
  } finally {
    if (renderer) act(() => renderer!.unmount())
    config.themes.dark = originalDark
  }
})

test.each([
  [
    'conditional',
    `
      import { YStack } from 'tamagui'
      export function Test({ active }) {
        return <YStack bg={active ? 'background' : 'color'} />
      }
    `,
  ],
  [
    'spread',
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <YStack {...{ bg: 'background', padding: 8 }} />
      }
    `,
  ],
])('%s themed candidates keep their existing output', async (_name, source) => {
  const baseline = await extractForNative(source)
  const flagged = await extractForNative(source, {
    options: { experimental: { nativeFastPath: true } },
  })
  expect(flagged.code).toBe(baseline.code)
  expect(flagged.stats).toEqual(baseline.stats)
  expect(flagged.diagnostics).toEqual(baseline.diagnostics)
})

test('web output is identical when the native fast path flag is on', async () => {
  const source = `
    import { YStack } from 'tamagui'
    export function Test() {
      return <YStack bg="background" padding={8} />
    }
  `
  const { extractForWeb } = await import('./lib/extract')
  const baseline = await extractForWeb(source)
  const flagged = await extractForWeb(source, {
    options: { experimental: { nativeFastPath: true } },
  })
  expect(flagged.js).toBe(baseline.js)
  expect(flagged.styles).toEqual(baseline.styles)
  expect(flagged.stats).toEqual(baseline.stats)
  expect(flagged.diagnostics).toEqual(baseline.diagnostics)
})

test('compiler table states equal runtime-mode pushes after color processing', async () => {
  const { exports: compiled } = await executeCompiled(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <YStack bg="background" borderColor="color" padding={8} />
      }
    `,
    {
      options: {
        config: './tests/fixtures/native-fast-path-runtime.config.cjs',
        experimental: { nativeFastPath: true },
      },
    }
  )
  const compilerMock = createMockEngine()
  setNativeStyleEngine(compilerMock.engine)
  process.env.TAMAGUI_TARGET = 'native'

  let setCompilerSub: (name: 'red' | 'blue') => void = () => {}
  function CompilerHarness() {
    const [sub, setSub] = ReactModule.useState<'red' | 'blue'>('red')
    setCompilerSub = setSub
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>{ReactModule.createElement(compiled.Test!)}</Theme>
      </TamaguiProvider>
    )
  }
  let compilerRenderer: ReactTestRenderer
  act(() => {
    compilerRenderer = create(<CompilerHarness />, { createNodeMock: () => ({}) })
  })
  await act(async () => setCompilerSub('blue'))
  const compilerStates = compilerMock.states(0)
  // the base style rides React's style prop; the table carries only theme keys
  const compilerHost = compilerRenderer!.root.findAll(
    (node) => typeof node.type === 'string' && Array.isArray(node.props?.style)
  )[0]!
  const compilerBase = compilerHost.props.style[0]
  act(() => compilerRenderer.unmount())
  setNativeStyleEngine(null)

  const RuntimeSquare = styled(View, {
    flexDirection: 'column',
  })
  let setSub: (name: 'red' | 'blue') => void = () => {}
  function RuntimeHarness() {
    const [sub, setSubState] = ReactModule.useState<'red' | 'blue'>('red')
    setSub = setSubState
    const square = ReactModule.useMemo(
      () => <RuntimeSquare bg="background" borderColor="color" padding={8} />,
      []
    )
    return (
      <TamaguiProvider config={config} defaultTheme="dark">
        <Theme name={sub}>{square}</Theme>
      </TamaguiProvider>
    )
  }

  const runtimeMock = createMockEngine()
  setNativeStyleEngine(runtimeMock.engine)
  let runtimeRenderer: ReactTestRenderer
  act(() => {
    runtimeRenderer = create(<RuntimeHarness />, { createNodeMock: () => ({}) })
  })
  await act(async () => setSub('blue'))
  await act(async () => {})

  expect(runtimeMock.updates.map((entry) => entry.state)).toContain('dark_blue')
  const runtimeEntry = runtimeMock.updates.find((entry) => entry.state === 'dark_blue')
  const compilerState = compilerStates.dark_blue!
  const runtimeThemed = Object.fromEntries(
    Object.keys(compilerState).map((key) => [key, runtimeEntry!.props![key]])
  )
  expect(runtimeThemed).toEqual(compilerState)
  // the compiler keeps the padding shorthand RN expands natively
  expect(compilerBase).toEqual({ flexDirection: 'column', padding: 8 })
  for (const key of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
    expect(runtimeEntry!.props![key]).toBe(8)
  }

  act(() => runtimeRenderer.unmount())
})

test("plain views render RN's host component, remapped props keep the wrapper", async () => {
  const { exports: compiled } = await executeCompiled(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <>
          <YStack testID="leaf" bg="background" padding={8} />
          <YStack testID="parent" bg="background" padding={8}>
            <YStack testID="nested" bg="background" />
          </YStack>
          <YStack testID="labelled" aria-label="x" bg="background" padding={8} />
        </>
      }
    `,
    { options: { experimental: { nativeFastPath: true } } }
  )
  const mock = createMockEngine()
  setNativeStyleEngine(mock.engine)
  process.env.TAMAGUI_TARGET = 'native'

  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      <TamaguiProvider config={config} defaultTheme="dark">
        {ReactModule.createElement(compiled.Test!)}
      </TamaguiProvider>,
      { createNodeMock: () => ({}) }
    )
  })

  // the innermost node carrying each testID is the host element React actually
  // committed: 'RCTView' when the compiler skipped RN's <View> wrapper, the
  // mocked 'View' when it kept it
  const hostType = (testID: string) =>
    renderer.root.findAll((node) => node.props?.testID === testID).at(-1)!.type

  expect(hostType('leaf')).toBe('RCTView')
  // _withNativeStyle performs the TextAncestorContext reset <View> would
  expect(hostType('parent')).toBe('RCTView')
  expect(hostType('nested')).toBe('RCTView')
  // aria props only exist because <View> remaps them
  expect(hostType('labelled')).toBe('View')
  // styles still land through the host component
  expect(
    styleValue(
      renderer.root.findAll((n) => n.props?.testID === 'leaf').at(-1)!,
      'padding'
    )
  ).toBe(8)

  act(() => renderer.unmount())
})

test("plain texts render RN's text host with the props <Text> would pass", async () => {
  const TextAncestor = ReactModule.createContext(false)
  setupHooks({
    getBaseViews: () => ({
      View: 'View',
      Text: 'Text',
      TextAncestor,
      NativeText: 'RCTText',
    }),
  })
  try {
    const { exports: compiled } = await executeCompiled(
      `
        import { Text } from 'tamagui'
        export function Test() {
          return <>
            <Text testID="plain" color="color" fontWeight="700">hi</Text>
            <Text testID="outer" color="color">
              a<Text testID="inner" color="color">b</Text>
            </Text>
            <Text testID="labelled" aria-label="x" color="color">c</Text>
          </>
        }
      `,
      { options: { experimental: { nativeFastPath: true } } }
    )
    const mock = createMockEngine()
    setNativeStyleEngine(mock.engine)
    process.env.TAMAGUI_TARGET = 'native'

    let renderer: ReactTestRenderer
    act(() => {
      renderer = create(
        <TamaguiProvider config={config} defaultTheme="dark">
          {ReactModule.createElement(compiled.Test!)}
        </TamaguiProvider>,
        { createNodeMock: () => ({}) }
      )
    })
    const node = (testID: string) =>
      renderer.root.findAll((n) => n.props?.testID === testID).at(-1)!

    const plain = node('plain')
    expect(plain.type).toBe('RCTText')
    expect(plain.props.allowFontScaling).toBe(true)
    expect(plain.props.ellipsizeMode).toBe('tail')
    // <Text> prepends overflow: 'hidden' to the caller's style
    expect(plain.props.style[0]).toMatchObject({ overflow: 'hidden', fontWeight: '700' })
    expect(styleValue(plain, 'color')).toBe(config.themes.dark.color.val)
    // an element child gets the text ancestor, so the nested text stays virtual
    expect(node('outer').type).toBe('RCTText')
    expect(node('inner').type).toBe('Text')
    // aria props only exist because <Text> remaps them
    expect(node('labelled').type).toBe('Text')
    expect(mock.links).toHaveLength(4)

    act(() => renderer.unmount())
  } finally {
    setupHooks({ getBaseViews: undefined })
  }
})

test.each([true, false])(
  'non-style styled() defaults reach the flattened host (fast path %s)',
  async (nativeFastPath) => {
    const TextAncestor = ReactModule.createContext(false)
    setupHooks({
      getBaseViews: () => ({
        View: 'View',
        Text: 'Text',
        TextAncestor,
        NativeText: 'RCTText',
      }),
    })
    try {
      const { exports: compiled } = await executeCompiled(
        `
          import { SizableText, View, styled } from 'tamagui'
          const CappedText = styled(SizableText, {
            color: '$color',
            numberOfLines: 2,
            allowFontScaling: false,
            maxFontSizeMultiplier: 1.2,
            minimumFontScale: 1,
          })
          const Labelled = styled(View, { accessibilityLabel: 'box', backgroundColor: '$background' })
          export function Test() {
            return <>
              <CappedText testID="capped">a</CappedText>
              <CappedText testID="override" numberOfLines={3}>b</CappedText>
              <Labelled testID="labelled" />
            </>
          }
        `,
        { options: { experimental: { nativeFastPath } } }
      )
      const mock = createMockEngine()
      setNativeStyleEngine(mock.engine)
      process.env.TAMAGUI_TARGET = 'native'

      let renderer: ReactTestRenderer
      act(() => {
        renderer = create(
          <TamaguiProvider config={config} defaultTheme="dark">
            {ReactModule.createElement(compiled.Test!)}
          </TamaguiProvider>,
          { createNodeMock: () => ({}) }
        )
      })
      const node = (testID: string) =>
        renderer.root.findAll((n) => n.props?.testID === testID).at(-1)!

      expect(node('capped').props).toMatchObject({
        numberOfLines: 2,
        allowFontScaling: false,
        maxFontSizeMultiplier: 1.2,
        minimumFontScale: 1,
      })
      expect(node('override').props).toMatchObject({
        numberOfLines: 3,
        allowFontScaling: false,
      })
      expect(node('labelled').props.accessibilityLabel).toBe('box')

      act(() => renderer.unmount())
    } finally {
      setupHooks({ getBaseViews: undefined })
    }
  }
)

test('elements in a provable theme scope render inline, without the wrapper', async () => {
  const TextAncestor = ReactModule.createContext(false)
  setupHooks({
    getBaseViews: () => ({
      View: 'View',
      Text: 'Text',
      TextAncestor,
      NativeText: 'RCTText',
    }),
  })
  try {
    const { exports: compiled, code } = await executeCompiled(
      `
      import { ScrollView } from 'react-native'
      import { Theme } from '@tamagui/core'
      import { Text, YStack } from 'tamagui'

      function Row({ header, children }) {
        return <YStack>{header}{children}</YStack>
      }

      function helper() {
        return <YStack testID="helper" bg="background" />
      }

      export function Test({ items }) {
        const assigned = <YStack testID="variable" bg="background" />
        return (
          <ScrollView>
            {items.map((item) => (
              <YStack key={item} testID={'row-' + item} bg="background">
                <Text testID={'label-' + item} color="color">{item}</Text>
              </YStack>
            ))}
            {items.length > 0 && <YStack testID="conditional" bg="background" />}
            <Theme name="light">
              <YStack testID="themed" bg="background" />
            </Theme>
            <Row header={<YStack testID="prop" bg="background" />}>
              <YStack testID="custom" bg="background" />
            </Row>
            {assigned}
            {helper()}
          </ScrollView>
        )
      }
    `,
      { options: { experimental: { nativeFastPath: true } } }
    )
    // the row, its label and the conditional view
    expect(code.match(/\.inline\(/g)).toHaveLength(3)

    const mock = createMockEngine()
    setNativeStyleEngine(mock.engine)
    process.env.TAMAGUI_TARGET = 'native'

    const app = (items: string[]) => (
      <TamaguiProvider config={config} defaultTheme="dark">
        {ReactModule.createElement(compiled.Test!, { items } as any)}
      </TamaguiProvider>
    )
    let renderer: ReactTestRenderer
    act(() => {
      renderer = create(app(['a', 'b']), { createNodeMock: () => ({}) })
    })
    const node = (testID: string) =>
      renderer.root.findAll((n) => n.props?.testID === testID).at(-1)!
    const wrapped = () =>
      renderer.root
        .findAll((n) => typeof n.type === 'function' && n.type.name === 'NativeStyleView')
        .map((n) => n.props.testID)
        .sort()

    expect(node('row-a').type).toBe('RCTView')
    expect(node('label-a').type).toBe('RCTText')
    expect(node('conditional').type).toBe('RCTView')
    expect(styleValue(node('row-b'), 'backgroundColor')).toBe(
      config.themes.dark.background.val
    )
    expect(wrapped()).toEqual(['custom', 'helper', 'prop', 'themed', 'variable'])
    // inline views still link to the engine
    expect(mock.links).toHaveLength(10)

    // keys reach the host: a reorder moves the committed views with their
    // items (test-renderer mints a new public instance per read, so compare
    // the fiber's host instance)
    const hostOf = (testID: string) => (node(testID) as any)._fiber.stateNode
    const rowA = hostOf('row-a')
    const labelA = hostOf('label-a')
    act(() => renderer.update(app(['b', 'a'])))
    // compared as booleans: a failing diff of two host instances never ends
    expect(hostOf('row-a') === rowA).toBe(true)
    expect(hostOf('label-a') === labelA).toBe(true)

    act(() => renderer.unmount())
  } finally {
    setupHooks({ getBaseViews: undefined })
  }
})

test('inline placement follows component boundaries and render callbacks', async () => {
  const output = await extractForNative(
    `
      import { memo, forwardRef } from 'react'
      import { View } from 'react-native'
      import { YStack } from 'tamagui'

      const moduleScoped = <YStack testID="module" bg="background" />

      export const Memo = memo(() => <YStack testID="memo" bg="background" />)
      export const Forwarded = forwardRef(function (props, ref) {
        return <YStack testID="forwarded" bg="background" />
      })
      export const Arrow = ({ count }) => (
        <View>
          {Array.from({ length: count }, (_, i) => (
            <YStack key={i} testID="from" bg="background" />
          ))}
        </View>
      )
      export function Spread(props) {
        return <View {...props}><YStack testID="spread" bg="background" /></View>
      }
      export function Shallow() {
        return <YStack themeShallow><YStack testID="shallow" bg="background" /></YStack>
      }
      export function Callback({ items }) {
        return <View>{items.forEach(() => <YStack testID="forEach" bg="background" />)}</View>
      }
      export class Klass {
        render() {
          return <YStack testID="class" bg="background" />
        }
      }
    `,
    { options: { experimental: { nativeFastPath: true } } }
  )
  const inlined = [...output.code.matchAll(/\.inline\(<\w+[^>]*testID="(\w+)"/g)].map(
    (match) => match[1]
  )
  expect(inlined).toEqual(['memo', 'forwarded', 'from'])
  for (const kept of ['module', 'spread', 'shallow', 'forEach', 'class']) {
    expect(output.code).toMatch(
      new RegExp(`<__TamaguiNativeFastView\\d+ testID="${kept}"`)
    )
  }
})
