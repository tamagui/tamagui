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
    Text: host('Text'),
    TextInput: host('TextInput'),
    View: host('View'),
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

const { TamaguiProvider, Theme, View, createTamagui, setNativeStyleEngine, styled } =
  Core
const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

function createMockEngine() {
  const links: {
    id: number
    scopeId: string
    slots: Core.NativeStyleEngineSlots
    processed: Core.NativeStyleEngineSlots
  }[] = []
  const updates: Core.NativeViewStateUpdate[] = []
  const tableUpdates: Core.NativeViewStateTableUpdate[] = []
  const scopeStates: [string, string][] = []
  let nextId = 1
  const engine: Core.NativeStyleEngine = {
    link: (_ref, slots, scopeId = '') => {
      const id = nextId++
      links.push({
        id,
        scopeId,
        slots,
        processed: slots,
      })
      return { id, unlink: () => {} }
    },
    applyViewStates: (entries) => updates.push(...entries),
    updateViewStateTables: (entries) => {
      tableUpdates.push(...entries)
      for (const entry of entries) {
        const linked = links.find(({ id }) => id === entry.id)
        if (linked) (linked.slots.state ||= {})[entry.state] = entry.props
      }
    },
    processStyleColors,
    setStateName: (stateName, scopeId = '') => {
      scopeStates.push([scopeId, stateName])
    },
    removeScope: () => {},
  }
  return { engine, links, scopeStates, tableUpdates, updates }
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
  expect(styleValue(view(), 'paddingTop')).toBe(8)

  act(() => {
    renderer.update(app('dark'))
  })
  expect(styleValue(view(), 'backgroundColor')).toBe(darkBackground)
  expect(styleValue(view(), 'paddingTop')).toBe(8)
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
  const first = mock.links[0]!.slots
  const second = mock.links[1]!.slots
  expect(Object.keys(first.state!)).toEqual(['dark'])
  expect(first.state!.dark).toBe(second.state!.dark)
  const keySet = Object.keys(first.state!.dark!).sort()
  expect(keySet).toEqual([
    'backgroundColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderRightColor',
    'borderTopColor',
  ])
  expect(Object.keys(first.base!).sort()).toEqual([
    'flexDirection',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
  ])
  expect(first.state!.dark!.backgroundColor).toBe(
    processStyleColors({
      backgroundColor: config.themes.dark.background.val,
    }).backgroundColor
  )
  expect(mock.tableUpdates).toEqual([])

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
    const states = mock.links[0]!.slots.state!
    expect(Object.keys(states.dark!).sort()).toEqual(Object.keys(states.light!).sort())
    expect(states.dark!.backgroundColor).toBe(
      processStyleColors({ backgroundColor: '#123456' }).backgroundColor
    )
    expect(states.light!.backgroundColor).toBeNull()
    expect(mock.tableUpdates).toHaveLength(1)
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
    compilerRenderer = create(
      <CompilerHarness />,
      { createNodeMock: () => ({}) }
    )
  })
  await act(async () => setCompilerSub('blue'))
  const compilerSlots = compilerMock.links[0]!.processed
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
  const compilerEntry = {
    ...compilerSlots.base,
    ...compilerSlots.state!.dark_blue,
  }
  expect(runtimeEntry?.props).toEqual(compilerEntry)
  expect(Object.keys(runtimeEntry!.props!).sort()).toEqual(
    Object.keys(compilerEntry).sort()
  )

  act(() => runtimeRenderer.unmount())
})
