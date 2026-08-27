process.env.TAMAGUI_TARGET = 'native'

import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { describe, expect, test, vi } from 'vitest'

import configDefault from '../config-default'
import { TamaguiProvider, createTamagui } from '../web/src'
// the same module a native bundler picks for `html` from @tamagui/core; the
// vitest resolver does not do the platform extension swap for this pair
import { html } from '../web/src/dom/html.native'

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

/**
 * `html.*` on native with no compiler.
 *
 * The compiler is still the fast path, and what it produces is the
 * specification: these assert that a tag rendered through the runtime reaches
 * the same primitive with the same resolved styles and the same react native
 * prop names. `domCompiledRuntime.native.test.tsx` in the compiler suite
 * asserts the two trees directly against each other.
 */

const config = createTamagui(configDefault.getDefaultTamaguiConfig('native'))

function styleValue(node: { props: { style?: unknown } }, key: string) {
  const styles = (Array.isArray(node.props.style) ? node.props.style : [node.props.style])
    .flat(Number.POSITIVE_INFINITY)
    .filter(Boolean) as Record<string, unknown>[]
  return styles.reduce<unknown>(
    (value, style) => (key in style ? style[key] : value),
    undefined
  )
}

function show(ui: React.ReactNode) {
  let renderer: ReactTestRenderer
  act(() => {
    renderer = create(
      <TamaguiProvider config={config} defaultTheme="light">
        {ui}
      </TamaguiProvider>,
      // react-test-renderer mounts no host instances of its own, and a ref
      // resolves to the dom facade built around one
      { createNodeMock: () => ({}) }
    )
  })
  return renderer!
}

const find = (renderer: ReactTestRenderer, type: string, testID: string) => {
  const found = renderer.root
    .findAllByType(type as any)
    .find((node) => node.props.testID === testID)
  if (!found) throw new Error(`no <${type}> with testID ${testID}`)
  return found
}

describe('a tag with no compiler', () => {
  test('renders the primitive its backing names', () => {
    const renderer = show(
      <html.div data-testid="root">
        <html.p data-testid="para">
          <html.span data-testid="span">inline</html.span>
        </html.p>
        <html.img alt="a" data-testid="img" src="a.png" />
        <html.input data-testid="field" type="text" />
      </html.div>
    )
    expect(find(renderer, 'View', 'root')).toBeTruthy()
    expect(find(renderer, 'Text', 'para')).toBeTruthy()
    expect(find(renderer, 'Text', 'span')).toBeTruthy()
    expect(find(renderer, 'Image', 'img')).toBeTruthy()
    expect(find(renderer, 'TextInput', 'field')).toBeTruthy()
  })

  test('emulates the browser block display a block tag has and an inline tag does not', () => {
    const renderer = show(
      <html.div data-testid="block">
        <html.span data-testid="inline">x</html.span>
      </html.div>
    )
    const block = find(renderer, 'View', 'block')
    expect(styleValue(block, 'display')).toBe('flex')
    expect(styleValue(block, 'flexDirection')).toBe('column')
    expect(styleValue(block, 'flexShrink')).toBe(0)
    expect(styleValue(block, 'flexBasis')).toBe('auto')
    expect(styleValue(block, 'flexWrap')).toBe('nowrap')
    expect(styleValue(block, 'alignItems')).toBe('stretch')
    expect(styleValue(block, 'justifyContent')).toBe('flex-start')
    expect(styleValue(block, 'boxSizing')).toBe('content-box')
    expect(styleValue(block, 'position')).toBe('static')

    const inline = find(renderer, 'Text', 'inline')
    expect(styleValue(inline, 'display')).toBeUndefined()
    expect(styleValue(inline, 'flexDirection')).toBeUndefined()
    expect(styleValue(inline, 'boxSizing')).toBe('content-box')
  })

  test('emulates block display on a text-backed block tag too', () => {
    const renderer = show(<html.p data-testid="para">body</html.p>)
    const para = find(renderer, 'Text', 'para')
    expect(styleValue(para, 'display')).toBe('flex')
    expect(styleValue(para, 'flexDirection')).toBe('column')
    expect(styleValue(para, 'flexShrink')).toBe(0)
  })

  test('lets an author style prop beat the element default', () => {
    const renderer = show(
      <html.div data-testid="row" flexDirection="row" flexShrink={1}>
        <html.span>x</html.span>
      </html.div>
    )
    const row = find(renderer, 'View', 'row')
    expect(styleValue(row, 'flexDirection')).toBe('row')
    expect(styleValue(row, 'flexShrink')).toBe(1)
  })

  test('brings the css flex defaults when the author writes display flex', () => {
    const renderer = show(
      <html.div data-testid="flex" display="flex">
        <html.span>x</html.span>
      </html.div>
    )
    const flex = find(renderer, 'View', 'flex')
    expect(styleValue(flex, 'display')).toBe('flex')
    expect(styleValue(flex, 'flexDirection')).toBe('row')
    expect(styleValue(flex, 'flexShrink')).toBe(1)
    expect(styleValue(flex, 'alignContent')).toBe('stretch')
  })

  test('keeps the author ahead of the flex defaults as well', () => {
    const renderer = show(
      <html.div data-testid="flex" display="flex" flexDirection="column">
        <html.span>x</html.span>
      </html.div>
    )
    expect(styleValue(find(renderer, 'View', 'flex'), 'flexDirection')).toBe('column')
  })
})

describe('a literal string child', () => {
  test('is wrapped in a text primitive that inherits the view text styles', () => {
    const renderer = show(
      <html.div color="red" data-testid="root" fontSize={16}>
        literal
      </html.div>
    )
    const root = find(renderer, 'View', 'root')
    // react native renders no raw text, so the literal became its own Text
    const text = renderer.root
      .findAllByType('Text' as any)
      .find((node) => node.props.children === 'literal')!
    expect(text).toBeTruthy()
    expect(styleValue(text, 'color')).toBe('red')
    expect(styleValue(text, 'fontSize')).toBe(16)
    expect(root.findAllByType('Text' as any)).toContain(text)
  })

  test('is wrapped beside element siblings without disturbing them', () => {
    const renderer = show(
      <html.div data-testid="root">
        before
        <html.span data-testid="span">middle</html.span>
        after
      </html.div>
    )
    const texts = find(renderer, 'View', 'root')
      .findAllByType('Text' as any)
      .map((node) => node.props.children)
    expect(texts).toEqual(['before', 'middle', 'after'])
  })

  test('is left alone by a text-backed tag, which renders raw text itself', () => {
    const renderer = show(<html.span data-testid="span">literal</html.span>)
    const span = find(renderer, 'Text', 'span')
    expect(span.props.children).toBe('literal')
    expect(span.findAllByType('Text' as any)).toEqual([span])
  })
})

describe('the dom prop mapping', () => {
  test('renames the props react native spells differently', () => {
    const renderer = show(
      <html.div
        aria-label="content"
        aria-labelledby="other"
        aria-modal
        data-testid="root"
        dir="rtl"
      />
    )
    const root = find(renderer, 'View', 'root')
    expect(root.props.accessibilityLabel).toBe('content')
    expect(root.props.accessibilityLabelledBy).toBe('other')
    expect(root.props.accessibilityViewIsModal).toBe(true)
    expect(root.props.testID).toBe('root')
    expect(styleValue(root, 'writingDirection')).toBe('rtl')
  })

  test('collects the aria props that become one nested accessibility object', () => {
    const renderer = show(
      <html.div
        aria-busy
        aria-expanded={false}
        aria-valuemax={10}
        aria-valuenow={3}
        data-testid="root"
      />
    )
    const root = find(renderer, 'View', 'root')
    expect(root.props.accessibilityState).toEqual({ busy: true, expanded: false })
    expect(root.props.accessibilityValue).toEqual({ max: 10, now: 3 })
  })

  test('polyfills aria-hidden, aria-live, tabIndex and hidden', () => {
    const renderer = show(
      <>
        <html.div aria-hidden aria-live="off" data-testid="a11y" tabIndex={0} />
        <html.div data-testid="gone" hidden />
      </>
    )
    const a11y = find(renderer, 'View', 'a11y')
    expect(a11y.props.accessibilityElementsHidden).toBe(true)
    expect(a11y.props.importantForAccessibility).toBe('no-hide-descendants')
    expect(a11y.props.accessibilityLiveRegion).toBe('none')
    expect(a11y.props.focusable).toBe(true)
    expect(styleValue(find(renderer, 'View', 'gone'), 'display')).toBe('none')
  })

  test('applies the implicit role from the tag table, and lets an author override it', () => {
    const renderer = show(
      <>
        <html.h1 data-testid="heading">h</html.h1>
        <html.li data-testid="item" />
        <html.ul data-testid="list" />
        <html.li data-testid="custom" role="none" />
      </>
    )
    expect(find(renderer, 'Text', 'heading').props.role).toBe('heading')
    expect(find(renderer, 'View', 'item').props.role).toBe('listitem')
    expect(find(renderer, 'View', 'list').props.role).toBe('list')
    expect(find(renderer, 'View', 'custom').props.role).toBe('none')
  })

  test('fans a disabled control out to every prop that carries it', () => {
    const renderer = show(<html.input data-testid="field" disabled type="text" />)
    const field = find(renderer, 'TextInput', 'field')
    expect(field.props.disabled).toBe(true)
    expect(field.props.focusable).toBe(false)
    expect(field.props.editable).toBe(false)
    expect(field.props.accessibilityState).toEqual({ disabled: true })
  })

  test('turns a readOnly text entry into a non-editable one', () => {
    const renderer = show(<html.input data-testid="field" readOnly type="text" />)
    expect(find(renderer, 'TextInput', 'field').props.editable).toBe(false)
  })

  test('resolves the input type into the native keyboard and secure entry', () => {
    const renderer = show(
      <>
        <html.input data-testid="password" type="password" />
        <html.input data-testid="email" type="email" />
        <html.input data-testid="number" type="number" />
        <html.input data-testid="plain" type="text" />
        <html.input data-testid="explicit" inputMode="text" type="email" />
      </>
    )
    expect(find(renderer, 'TextInput', 'password').props.secureTextEntry).toBe(true)
    expect(find(renderer, 'TextInput', 'email').props.inputMode).toBe('email')
    expect(find(renderer, 'TextInput', 'number').props.inputMode).toBe('numeric')
    expect(find(renderer, 'TextInput', 'plain').props.inputMode).toBeUndefined()
    expect(find(renderer, 'TextInput', 'explicit').props.inputMode).toBe('text')
  })

  test('makes a textarea a multiline entry counted in rows', () => {
    const renderer = show(<html.textarea data-testid="area" rows={4} />)
    const area = find(renderer, 'TextInput', 'area')
    expect(area.props.multiline).toBe(true)
    expect(area.props.numberOfLines).toBe(4)
  })

  test('adapts a click into a press through the primitive', () => {
    const onClick = vi.fn()
    const renderer = show(<html.div data-testid="root" onClick={onClick} />)
    // a react native View cannot press, so a clickable view is a Pressable
    const root = find(renderer, 'Pressable', 'root')
    act(() => root.props.onPress({ nativeEvent: { pageX: 1, pageY: 2 } }))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick.mock.calls[0]![0].type).toBe('click')
  })

  test('exposes a dom-shaped ref facade', () => {
    const ref = { current: null as null | Record<string, any> }
    show(<html.div data-testid="root" ref={ref as any} />)
    expect(ref.current?.tagName).toBe('DIV')
  })
})

describe('what the tables say native cannot do', () => {
  test('refuses the three tags with no native control, naming the reason', () => {
    for (const tag of ['optgroup', 'option', 'select'] as const) {
      expect(() => show(<html.div>{(html[tag] as any)({})}</html.div>), tag).toThrow(
        `html.${tag} is not supported on native: native has no menu-based select control`
      )
    }
  })

  test('refuses a prop with no native equivalent rather than dropping it', () => {
    expect(() => show(<html.a href="https://tamagui.dev">go</html.a>)).toThrow(
      /href is not supported on native html\.a/
    )
    expect(() => show(<html.div lang="en" />)).toThrow(
      /lang is not supported on native html\.div/
    )
  })

  test('ignores undefined props before checking native support', () => {
    expect(() =>
      show(
        <html.a data-testid="link" href={undefined} onWheel={undefined} target={undefined}>
          go
        </html.a>
      )
    ).not.toThrow()
  })

  test('refuses an event with no native equivalent', () => {
    expect(() => show(<html.div onWheel={() => {}} />)).toThrow(
      'onWheel has no native DOM event equivalent'
    )
  })

  test('refuses onKeyDown outside a text-entry control', () => {
    expect(() => show(<html.div onKeyDown={() => {}} />)).toThrow(
      'onKeyDown requires a native text-entry control'
    )
    expect(() => show(<html.input onKeyDown={() => {}} type="text" />)).not.toThrow()
  })

  test('refuses an input type with no native text-entry control', () => {
    expect(() => show(<html.input type="checkbox" />)).toThrow(
      'input type checkbox has no native text-entry control'
    )
  })
})
