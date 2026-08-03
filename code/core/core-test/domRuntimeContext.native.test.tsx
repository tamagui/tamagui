process.env.TAMAGUI_TARGET = 'native'

import {
  TamaguiProvider,
  createTamagui,
  setMediaState,
  updateMediaListeners,
} from '../web/src'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { expect, test, vi } from 'vitest'

import configDefault from '../config-default'
import {
  DOMRuntimeText,
  DOMRuntimeView,
  DOMText,
  DOMView,
} from '../web/src/dom/primitives.native'

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

function findEvent(
  renderer: ReactTestRenderer,
  testID: string,
  event: string
): (...args: any[]) => void {
  const instance = renderer.root
    .findAll((node) => node.props.testID === testID)
    .find((node) => typeof node.props[event] === 'function')
  if (!instance) {
    const keys = renderer.root
      .findAll((node) => node.props.testID === testID)
      .map((node) => Object.keys(node.props).filter((key) => key.startsWith('on')))
    throw new Error(`No ${event} handler for ${testID}: ${JSON.stringify(keys)}`)
  }
  return instance.props[event]
}

test('standalone DOM context styles recompute for theme, media and interaction', () => {
  setMediaState({ sm: false } as any)
  const content = (theme: 'light' | 'dark', forceStyle?: 'press') => (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <DOMRuntimeText
        __styles={[
          {
            color: 'red dark:blue',
            opacity: '1 press:0.5',
            padding: '4 sm:8',
          },
        ]}
        forceStyle={forceStyle}
        testID="contextual-dom"
      >
        context
      </DOMRuntimeText>
    </TamaguiProvider>
  )
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(content('light'))
  })
  let node = findPrimitive(renderer!, 'Text', 'contextual-dom')

  expect(styleValue(node, 'color')).toBe('red')
  expect(styleValue(node, 'opacity')).toBe(1)
  expect(styleValue(node, 'paddingTop')).toBe(4)

  act(() => renderer!.update(content('light', 'press')))
  node = findPrimitive(renderer!, 'Text', 'contextual-dom')
  expect(styleValue(node, 'opacity')).toBe(0.5)

  act(() => {
    setMediaState({ sm: true } as any)
    updateMediaListeners()
  })
  node = findPrimitive(renderer!, 'Text', 'contextual-dom')
  expect(styleValue(node, 'paddingTop')).toBe(8)

  act(() => renderer!.update(content('dark')))
  node = findPrimitive(renderer!, 'Text', 'contextual-dom')
  expect(styleValue(node, 'color')).toBe('blue')
})

test('resolved inherited text styles cross view and component boundaries', () => {
  setMediaState({ sm: false } as any)
  const content = () => (
    <TamaguiProvider config={config} defaultTheme="light">
      <DOMRuntimeView
        __styles={[
          {
            color: 'red hover:blue',
            cursor: 'crosshair',
            fontSize: '16 sm:20',
            lineHeight: 2,
            textIndent: 10,
            whiteSpace: 'pre',
          },
        ]}
        testID="context-parent"
      >
        <DOMText __inherit testID="context-child">
          inherited
        </DOMText>
        <DOMText
          __inherit
          style={{
            color: 'inherit',
            cursor: 'unset',
            textIndent: 'inherit',
            whiteSpace: 'unset',
          }}
          testID="keyword-child"
        >
          keywords
        </DOMText>
      </DOMRuntimeView>
    </TamaguiProvider>
  )
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(content())
  })
  let parent = findPrimitive(renderer!, 'View', 'context-parent')
  let child = findPrimitive(renderer!, 'Text', 'context-child')
  expect(styleValue(child, 'color')).toBe('red')
  expect(styleValue(child, 'fontSize')).toBe(16)
  expect(styleValue(child, 'lineHeight')).toBe(32)
  expect(styleValue(child, 'cursor')).toBe('crosshair')
  expect(styleValue(child, 'textIndent')).toBe(10)
  expect(styleValue(child, 'whiteSpace')).toBe('pre')
  const keywordChild = findPrimitive(renderer!, 'Text', 'keyword-child')
  expect(styleValue(keywordChild, 'color')).toBe('red')
  expect(styleValue(keywordChild, 'cursor')).toBe('crosshair')
  expect(styleValue(keywordChild, 'textIndent')).toBe(10)
  expect(styleValue(keywordChild, 'whiteSpace')).toBe('pre')

  act(() => findEvent(renderer!, 'context-parent', 'onMouseEnter')({}))
  parent = findPrimitive(renderer!, 'View', 'context-parent')
  child = findPrimitive(renderer!, 'Text', 'context-child')
  expect(styleValue(child, 'color')).toBe('blue')

  act(() => {
    setMediaState({ sm: true } as any)
    updateMediaListeners()
  })
  expect(styleValue(findPrimitive(renderer!, 'Text', 'context-child'), 'fontSize')).toBe(
    20
  )
  expect(
    styleValue(findPrimitive(renderer!, 'Text', 'context-child'), 'lineHeight')
  ).toBe(40)
})

test('native hover, focus and active events drive context style transitions', () => {
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      <TamaguiProvider config={config} defaultTheme="light">
        <DOMRuntimeText
          __styles={[{ opacity: '1 hover:0.8 focus:0.6 active:0.4' }]}
          testID="interactive-context"
        >
          interactive
        </DOMRuntimeText>
      </TamaguiProvider>
    )
  })
  const opacity = () =>
    styleValue(findPrimitive(renderer!, 'Text', 'interactive-context'), 'opacity')
  expect(opacity()).toBe(1)

  act(() => findEvent(renderer!, 'interactive-context', 'onMouseEnter')({}))
  expect(opacity()).toBe(0.8)
  act(() => findEvent(renderer!, 'interactive-context', 'onFocus')({}))
  expect(opacity()).toBe(0.6)
  act(() => findEvent(renderer!, 'interactive-context', 'onPressIn')({}))
  expect(opacity()).toBe(0.4)
  act(() => findEvent(renderer!, 'interactive-context', 'onPressOut')({}))
  expect(opacity()).toBe(0.6)
  act(() => findEvent(renderer!, 'interactive-context', 'onBlur')({}))
  expect(opacity()).toBe(0.8)
  act(() => findEvent(renderer!, 'interactive-context', 'onMouseLeave')({}))
  expect(opacity()).toBe(1)
})
