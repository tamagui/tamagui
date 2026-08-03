process.env.TAMAGUI_TARGET = 'native'

import { transform } from 'esbuild'
import * as ReactModule from 'react'
import * as JSXRuntime from 'react/jsx-runtime'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { expect, test, vi } from 'vitest'

import * as NativeDOM from '../../../core/web/src/dom/index.native'
import configDefault from '../../../core/config-default'
import { TamaguiProvider, createTamagui } from '../../../core/web/src'
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
    if (specifier === '@tamagui/core/dom' || specifier === 'tamagui/dom') {
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
  expect(styleValue(main, 'backgroundColor')).toBe('rgba(255,255,255,1)')
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
