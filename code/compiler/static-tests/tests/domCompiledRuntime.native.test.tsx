import './lib/nativeTarget'

import { transform } from 'esbuild'
import * as ReactModule from 'react'
import * as JSXRuntime from 'react/jsx-runtime'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { expect, test, vi } from 'vitest'

import * as NativeDOM from '../../../core/web/src/dom/index.native'
import configDefault from '../../../core/config-default'
import { TamaguiProvider, createTamagui } from '../../../core/web/src'
// the module a native bundler picks for `html` from @tamagui/core, which is
// what runs when the compiler did not: the vitest resolver does not do the
// platform extension swap for this pair
import { html } from '../../../core/web/src/dom/html.native'
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

const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

function styleValue(node: { props: { style?: unknown } }, key: string) {
  const styles = (Array.isArray(node.props.style) ? node.props.style : [node.props.style])
    .flat(Infinity)
    .filter(Boolean) as Record<string, unknown>[]
  return styles.reduce<unknown>(
    (value, style) => (key in style ? style[key] : value),
    undefined
  )
}

function findPrimitive(renderer: ReactTestRenderer, type: string, testID: string) {
  return renderer.root
    .findAllByType(type as any)
    .find((node) => node.props.testID === testID)!
}

function findTestIDEvent(renderer: ReactTestRenderer, testID: string, event: string) {
  const matches = renderer.root
    .findAll((node) => node.props.testID === testID)
    .filter((node) => typeof node.props[event] === 'function')
  if (!matches.length) throw new Error(`No ${event} handler for ${testID}`)
  return matches.at(-1)!
}

async function executeCompiled(source: string) {
  const output = await extractForNative(source)
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
    // the lowered file keeps its `html` import; every member of it throws, so a
    // tag the compiler failed to replace fails the test rather than rendering
    if (
      specifier === '@tamagui/core' ||
      specifier === '@tamagui/core/dom' ||
      specifier === 'tamagui/dom'
    ) {
      return NativeDOM
    }
    throw new Error(`Unexpected compiled dependency: ${specifier}`)
  }
  Function(
    'require',
    'module',
    'exports',
    transformed.code
  )(localRequire, compiledModule, compiledModule.exports)
  return compiledModule.exports
}

/**
 * Element defaults that reach the host only at runtime: the frame passes a
 * component's non-style default props through (`suppressHighlighting`, and
 * `objectFit`, a web-only style key native never resolves), while the compiler
 * reads defaults for the styles they carry and emits no leftover view props.
 * Both are asserted on each tree below rather than quietly dropped here.
 */
const defaultPropsOnlyTheFrameApplies = new Set(['objectFit', 'suppressHighlighting'])

/** what a rendered host tree is, with the parts a comparison cannot see removed */
function hostTree(node: any): unknown {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map(hostTree)
  const props: Record<string, unknown> = {}
  for (const key in node.props) {
    const value = node.props[key]
    // a handler and a ref are identities, not values: the two trees reach the
    // same host through a different number of components, so only their effect
    // is comparable (asserted below by pressing both)
    if (value === undefined || key === 'style' || typeof value === 'function') continue
    if (defaultPropsOnlyTheFrameApplies.has(key)) continue
    props[key] = value
  }
  const styles = (
    Array.isArray(node.props?.style) ? node.props.style : [node.props?.style]
  )
    .flat(Number.POSITIVE_INFINITY)
    .filter(Boolean) as Record<string, unknown>[]
  return {
    type: node.type,
    props,
    style: styles.length ? Object.assign({}, ...styles) : undefined,
    children: node.children ? node.children.map(hostTree) : node.children,
  }
}

function render(ui: ReactModule.ReactNode) {
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      ReactModule.createElement(
        TamaguiProvider,
        { config, defaultTheme: 'light' },
        ui as ReactModule.ReactElement
      )
    )
  })
  return renderer!
}

test('the runtime tag renders the tree the compiler emits for the same source', async () => {
  const compiled = await executeCompiled(`
    import { html } from '@tamagui/core'
    export const Fixture = ({ onClick }) => (
      <html.main aria-label="fixture" data-testid="main" dir="rtl" padding={8}>
        <html.h1 color="red" data-testid="heading">Heading</html.h1>
        <html.div data-testid="clickable" onClick={onClick} />
        <html.img alt="Square" data-testid="image" height={20} src="square.png" width={20} />
        <html.input data-testid="field" disabled type="text" />
      </html.main>
    )
  `)

  // the extract pipeline flips TAMAGUI_TARGET while bundling configs; pin it
  // back so the runtime render below behaves like a real native bundle
  process.env.TAMAGUI_TARGET = 'native'

  const compiledClick = vi.fn()
  const runtimeClick = vi.fn()
  const compiledTree = render(
    ReactModule.createElement(compiled.Fixture!, { onClick: compiledClick })
  )
  const runtimeTree = render(
    <html.main aria-label="fixture" data-testid="main" dir="rtl" padding={8}>
      <html.h1 color="red" data-testid="heading">
        Heading
      </html.h1>
      <html.div data-testid="clickable" onClick={runtimeClick} />
      <html.img
        alt="Square"
        data-testid="image"
        height={20}
        src="square.png"
        width={20}
      />
      <html.input data-testid="field" disabled type="text" />
    </html.main>
  )

  expect(hostTree(runtimeTree.toJSON())).toEqual(hostTree(compiledTree.toJSON()))

  // the two element defaults the comparison above cannot hold both trees to
  expect(findPrimitive(runtimeTree, 'Text', 'heading').props.suppressHighlighting).toBe(
    true
  )
  expect(
    findPrimitive(compiledTree, 'Text', 'heading').props.suppressHighlighting
  ).toBeUndefined()
  expect(findPrimitive(runtimeTree, 'Image', 'image').props.objectFit).toBe('fill')
  expect(findPrimitive(compiledTree, 'Image', 'image').props.objectFit).toBeUndefined()

  for (const [renderer, onClick] of [
    [compiledTree, compiledClick],
    [runtimeTree, runtimeClick],
  ] as const) {
    const clickable = findPrimitive(renderer, 'Pressable', 'clickable')
    act(() => clickable.props.onPress({ nativeEvent: { pageX: 1, pageY: 2 } }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick.mock.calls[0]![0].type).toBe('click')
  }
})

test('compiled JSX and createElement literals render with inherited text styles', async () => {
  const compiled = await executeCompiled(`
    import { createElement } from 'react'
    import { html, style } from '@tamagui/core/dom'
    const parent = style({ color: 'red', fontSize: 16, lineHeight: 2 })
    export const TopLevel = <html.div style={parent}>top-level literal</html.div>
    export const JSXLiteral = () => <html.div style={parent}>jsx literal</html.div>
    export const CreateElementLiteral = () =>
      createElement(html.div, { style: parent }, 'createElement literal')
  `)

  const topLevel = compiled.TopLevel as unknown as ReactModule.ReactElement<{
    style: unknown
  }>
  expect(styleValue(topLevel, 'color')).toBe('red')
  expect(styleValue(topLevel, 'fontSize')).toBe(16)
  expect(styleValue(topLevel, 'lineHeight')).toBe(2)

  for (const name of ['JSXLiteral', 'CreateElementLiteral']) {
    let renderer: ReactTestRenderer
    act(() => {
      renderer = create(ReactModule.createElement(compiled[name]!))
    })
    const text = renderer!.root.findByType('Text' as any)
    expect(styleValue(text, 'color'), name).toBe('red')
    expect(styleValue(text, 'fontSize'), name).toBe(16)
    expect(styleValue(text, 'lineHeight'), name).toBe(32)
  }
})

test('the compiled native platform fixture renders hosts, styles and interaction', async () => {
  const compiled = await executeCompiled(`
    import { html, style } from '@tamagui/core/dom'
    const root = style({ backgroundColor: 'white', padding: 8 })
    const emphasized = style({ color: 'red', fontWeight: 'bold' })
    const activeStyle = style({ opacity: 0.5 })
    export const PlatformDOMFixture = ({ active, onClick }) => (
      <html.main aria-label="strict DOM fixture" data-testid="platform-main" style={root}>
        <html.h1 data-testid="platform-heading">Heading</html.h1>
        <html.button
          data-testid="platform-button"
          onClick={onClick}
          style={[emphasized, active && activeStyle]}
        >
          Press
        </html.button>
        <html.input aria-label="Name" data-testid="platform-input" type="text" />
        <html.img
          alt="Square"
          data-testid="platform-image"
          height={20}
          src="square.png"
          width={20}
        />
      </html.main>
    )
  `)
  const onClick = vi.fn()
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      ReactModule.createElement(compiled.PlatformDOMFixture!, {
        active: true,
        onClick,
      })
    )
  })

  const main = findPrimitive(renderer!, 'View', 'platform-main')
  const heading = findPrimitive(renderer!, 'Text', 'platform-heading')
  const button = findPrimitive(renderer!, 'Pressable', 'platform-button')
  const input = findPrimitive(renderer!, 'TextInput', 'platform-input')
  const image = findPrimitive(renderer!, 'Image', 'platform-image')
  expect(main.props.accessibilityLabel).toBe('strict DOM fixture')
  // 'white' stays a literal CSS color exactly like 'red' below: the old
  // rgba(255,255,255,1) expectation came from the v5 themes' `white` key,
  // which the sigil-less lookup resolved through the theme; v6 has no such key
  expect(styleValue(main, 'backgroundColor')).toBe('white')
  expect(styleValue(main, 'paddingTop')).toBe(8)
  expect(heading.props.role).toBe('heading')
  expect(button.props.role).toBe('button')
  expect(styleValue(button, 'color')).toBe('red')
  expect(styleValue(button, 'opacity')).toBe(0.5)
  expect(input.props.accessibilityLabel).toBe('Name')
  expect(image.props.alt).toBe('Square')

  act(() => button.props.onPress({ nativeEvent: { pageX: 1, pageY: 2 } }))
  expect(onClick).toHaveBeenCalledOnce()
})

test('compiled native mouse and scroll handlers coexist with runtime hover state', async () => {
  const compiled = await executeCompiled(`
    import { html, style } from '@tamagui/core/dom'
    const interactive = style({ opacity: '1 hover:0.5' })
    export const NativeEvents = (props) => (
      <html.div
        data-testid="native-events"
        onMouseDown={props.onMouseDown}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseOut={props.onMouseOut}
        onMouseOver={props.onMouseOver}
        onMouseUp={props.onMouseUp}
        onScroll={props.onScroll}
        style={interactive}
      />
    )
  `)
  const names = [
    'onMouseDown',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseOut',
    'onMouseOver',
    'onMouseUp',
    'onScroll',
  ] as const
  const handlers = Object.fromEntries(names.map((name) => [name, vi.fn()]))
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      ReactModule.createElement(
        TamaguiProvider,
        { config, defaultTheme: 'light' },
        ReactModule.createElement(compiled.NativeEvents!, handlers)
      )
    )
  })
  const styledHost = () =>
    renderer!.root.findAll((node) => styleValue(node, 'opacity') !== undefined).at(-1)!
  expect(styleValue(styledHost(), 'opacity')).toBe(1)

  for (const name of names) {
    act(() =>
      findTestIDEvent(renderer!, 'native-events', name).props[name]({ type: name })
    )
    expect(handlers[name], name).toHaveBeenCalledOnce()
    if (name === 'onMouseEnter') {
      expect(styleValue(styledHost(), 'opacity')).toBe(0.5)
    }
    if (name === 'onMouseLeave') expect(styleValue(styledHost(), 'opacity')).toBe(1)
  }
})
