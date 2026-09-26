import {
  DOMImage,
  DOMText,
  DOMTextInput,
  DOMView,
  DOMViewportProvider,
  createDOMRefCallback,
  // the @tamagui/core alias in the native test config rewrites deep imports,
  // so this reaches the source directly
} from '../web/src/dom/primitives.native'
import * as React from 'react'
import { Image, Pressable, Text, TextInput, View } from 'react-native'
import { act, create } from 'react-test-renderer'
import { describe, expect, test, vi } from 'vitest'

vi.mock('react-native', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-native')>()),
  useWindowDimensions: () => ({ width: 2000, height: 1000, scale: 1, fontScale: 1 }),
}))

/**
 * The native DOM primitives.
 *
 * Ref-free primitives are called as plain functions rather than rendered, for two reasons.
 * The fake react native the native suite runs against renders every host to
 * null, so a render tree would assert nothing; and calling a component outside
 * a renderer throws the moment it uses a hook, which makes every test here also
 * a proof that the common path stays hook-free. A compiler-tagged ref takes a
 * separate component path so it can consume viewport scale without taxing
 * elements that do not expose a ref.
 */

const press = (pageX = 4, pageY = 8) => ({ nativeEvent: { pageX, pageY } })
const typed = (text: string) => ({ nativeEvent: { text } })

describe('a primitive with no handlers', () => {
  test('renders its host and forwards the very same props object', () => {
    // identity, not equality: a copy per element is the cost this design exists
    // to avoid, and only identity can tell the difference
    const view = { style: { flexGrow: 1 }, children: null }
    expect(DOMView(view).type).toBe(View)
    expect(DOMView(view).props).toBe(view)

    const text = { style: { fontSize: 12 }, children: 'hi' }
    expect(DOMText(text).type).toBe(Text)
    expect(DOMText(text).props).toBe(text)

    const image = { source: { uri: 'a.png' } }
    expect(DOMImage(image).type).toBe(Image)
    expect(DOMImage(image).props).toBe(image)

    const input = { value: 'x' }
    expect(DOMTextInput(input).type).toBe(TextInput)
    expect(DOMTextInput(input).props).toBe(input)
  })

  test('keeps the props the compiler already resolved', () => {
    const props = {
      style: { display: 'flex', flexDirection: 'column', flexShrink: 0 },
      accessibilityLabel: 'a label',
      accessibilityState: { disabled: true },
      role: 'heading',
      nativeID: 'x',
      testID: 'y',
    }
    expect(DOMView(props).props).toEqual(props)
  })
})

describe('a view with a click handler', () => {
  test('becomes a Pressable, because a react native View cannot press', () => {
    const element = DOMView({ onClick: () => {}, style: { flexGrow: 1 } })
    expect(element.type).toBe(Pressable)
    expect(element.props.style).toEqual({ flexGrow: 1 })
  })

  test('adapts the press into a dom click payload', () => {
    const onClick = vi.fn()
    DOMView({ onClick }).props.onPress(press(12, 34))
    expect(onClick).toHaveBeenCalledTimes(1)
    const event = onClick.mock.calls[0][0]
    expect(event.type).toBe('click')
    expect(event.pageX).toBe(12)
    expect(event.pageY).toBe(34)
    expect(event.button).toBe(0)
    expect(event.defaultPrevented).toBe(false)
    expect(event.getModifierState('Shift')).toBe(false)
  })

  test('leaves onClick off the react native element', () => {
    const element = DOMView({ onClick: () => {} })
    expect('onClick' in element.props).toBe(false)
    expect(typeof element.props.onPress).toBe('function')
  })

  test('cancelling does nothing rather than throwing, since there is nothing to cancel', () => {
    const onClick = vi.fn()
    DOMView({ onClick }).props.onPress(press())
    const event = onClick.mock.calls[0][0]
    expect(() => {
      event.preventDefault()
      event.stopPropagation()
    }).not.toThrow()
  })
})

describe('a text with a click handler', () => {
  test('stays one Text, because react native Text presses on its own', () => {
    const element = DOMText({ onClick: () => {}, children: 'hi' })
    expect(element.type).toBe(Text)
    expect(element.props.children).toBe('hi')
    expect(typeof element.props.onPress).toBe('function')
  })
})

describe('an image', () => {
  test('reports the decoded size on load', () => {
    const onLoad = vi.fn()
    DOMImage({ onLoad }).props.onLoad({
      nativeEvent: { source: { width: 3, height: 5 } },
    })
    expect(onLoad).toHaveBeenCalledWith({
      target: { naturalWidth: 3, naturalHeight: 5 },
      type: 'load',
    })
  })

  test('reports an error with no payload to invent', () => {
    const onError = vi.fn()
    DOMImage({ onError }).props.onError()
    expect(onError).toHaveBeenCalledWith({ type: 'error' })
  })

  test('adapts a click alongside the load handlers', () => {
    const onClick = vi.fn()
    const onLoad = vi.fn()
    const element = DOMImage({ onClick, onLoad, source: { uri: 'a.png' } })
    expect(element.props.source).toEqual({ uri: 'a.png' })
    element.props.onPress(press())
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('a text input', () => {
  test('reports a change from the typed text', () => {
    const onChange = vi.fn()
    DOMTextInput({ onChange }).props.onChange(typed('abc'))
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'abc' }, type: 'change' })
  })

  test('reports an input from the typed text', () => {
    const onInput = vi.fn()
    DOMTextInput({ onInput }).props.onChange(typed('abc'))
    expect(onInput).toHaveBeenCalledWith({ target: { value: 'abc' }, type: 'input' })
  })

  test('fires both from the one react native change, in dom order', () => {
    const calls: string[] = []
    const element = DOMTextInput({
      onChange: () => calls.push('change'),
      onInput: () => calls.push('input'),
    })
    element.props.onChange(typed('ab'))
    expect(calls).toEqual(['change', 'input'])
  })

  test('adapts a key press, which react native reports as the key', () => {
    const onKeyDown = vi.fn()
    DOMTextInput({ onKeyDown }).props.onKeyPress({ nativeEvent: { key: 'Enter' } })
    expect(onKeyDown).toHaveBeenCalledWith({ key: 'Enter', type: 'keydown' })
  })

  test('keeps the value and placeholder the compiler resolved', () => {
    const element = DOMTextInput({
      value: 'v',
      placeholder: 'p',
      editable: false,
      onChange: () => {},
    })
    expect(element.props.value).toBe('v')
    expect(element.props.placeholder).toBe('p')
    expect(element.props.editable).toBe(false)
  })
})

describe('the ref', () => {
  test('reaches the host untouched, so no wrapper is built per element', () => {
    const ref = { current: null }
    expect(DOMView({ ref }).props.ref).toBe(ref)
    expect(DOMText({ ref, onClick: () => {} }).props.ref).toBe(ref)
    expect(DOMTextInput({ ref, onChange: () => {} }).props.ref).toBe(ref)
  })

  test('exposes a stable DOM-shaped facade when the compiler supplies a tag', () => {
    const ref = { current: null as null | Record<string, any> }
    const firstHost = {
      focus: vi.fn(function (this: unknown) {
        expect(this).toBe(firstHost)
      }),
    }
    let renderer: ReturnType<typeof create>
    act(() => {
      renderer = create(<DOMView __tag="main" ref={ref} />, {
        createNodeMock: () => firstHost,
      })
    })
    expect(ref.current?.nodeName).toBe('MAIN')
    expect(ref.current?.tagName).toBe('MAIN')
    ref.current?.focus()
    expect(firstHost.focus).toHaveBeenCalledTimes(1)
    const facade = ref.current
    act(() => renderer.update(<DOMView __tag="main" ref={ref} />))
    expect(ref.current).toBe(facade)
    act(() => renderer.unmount())
    expect(ref.current).toBeNull()
  })

  test('provides text-selection methods on input refs', () => {
    const ref = { current: null as null | Record<string, any> }
    const setSelection = vi.fn()
    act(() => {
      create(<DOMTextInput __tag="input" ref={ref} />, {
        createNodeMock: () => ({ setSelection }),
      })
    })
    ref.current?.setSelectionRange(2, 5)
    expect(ref.current?.selectionStart).toBe(2)
    expect(ref.current?.selectionEnd).toBe(5)
    expect(setSelection).toHaveBeenCalledWith(2, 5)
  })

  test('scales DOM geometry through the viewport provider', () => {
    const ref = { current: null as null | Record<string, any> }
    const host = {
      offsetWidth: 30,
      getBoundingClientRect: () => ({ x: 2, y: 4, width: 30, height: 20 }),
    }
    act(() => {
      create(
        <DOMViewportProvider viewportWidth={1000}>
          <DOMView __tag="div" ref={ref} />
        </DOMViewportProvider>,
        { createNodeMock: () => host }
      )
    })
    expect(ref.current?.offsetWidth).toBe(15)
    expect(ref.current?.getBoundingClientRect()).toMatchObject({
      x: 1,
      y: 2,
      width: 15,
      height: 10,
    })
  })

  test('honors callback-ref cleanup and null cleanup semantics', () => {
    const host = { focus: vi.fn() }
    const cleanup = vi.fn()
    const withCleanup = vi.fn(() => cleanup)
    const callback = createDOMRefCallback(withCleanup, 'section', 1)
    const returnedCleanup = callback(host)
    expect(withCleanup).toHaveBeenCalledTimes(1)
    expect(withCleanup.mock.calls[0]?.[0].nodeName).toBe('SECTION')
    expect(typeof returnedCleanup).toBe('function')
    returnedCleanup?.()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(withCleanup).toHaveBeenCalledTimes(1)

    const values: unknown[] = []
    const withoutCleanup = (value: unknown) => {
      values.push(value)
    }
    const nullingCallback = createDOMRefCallback(withoutCleanup, 'aside', 1)
    nullingCallback(host)
    expect((values[0] as { nodeName: string }).nodeName).toBe('ASIDE')
    const nullingCleanup = nullingCallback(host)
    expect(values[1]).toBeNull()
    expect(values[2]).toBe(values[0])
    nullingCleanup?.()
    expect(values.at(-1)).toBeNull()
  })

  test('runs React 19 callback-ref cleanup across mount, update and unmount', () => {
    const host = { focus: vi.fn() }
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const firstRef = vi.fn(() => firstCleanup)
    const secondRef = vi.fn(() => secondCleanup)
    let renderer: ReturnType<typeof create>

    act(() => {
      renderer = create(<DOMView __tag="section" ref={firstRef} />, {
        createNodeMock: () => host,
      })
    })
    expect(firstRef).toHaveBeenCalledTimes(1)
    expect(firstRef.mock.calls[0]?.[0].nodeName).toBe('SECTION')

    act(() => renderer.update(<DOMView __tag="section" ref={secondRef} />))
    expect(firstCleanup).toHaveBeenCalledOnce()
    expect(firstRef).toHaveBeenCalledTimes(1)
    expect(secondRef).toHaveBeenCalledTimes(1)
    expect(secondRef.mock.calls[0]?.[0]).toBe(firstRef.mock.calls[0]?.[0])

    act(() => renderer.unmount())
    expect(secondCleanup).toHaveBeenCalledOnce()
    expect(secondRef).toHaveBeenCalledTimes(1)
  })

  test('renders br as a newline without a runtime child scan', () => {
    expect(DOMText({ __tag: 'br' }).props.children).toBe('\n')
  })
})
