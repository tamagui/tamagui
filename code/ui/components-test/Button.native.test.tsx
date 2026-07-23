import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { Button } from '@tamagui/button'
import { TamaguiProvider, View, createTamagui, styled } from '@tamagui/core'
import {
  getGestureHandler,
  unstable_claimExternalPressOwnership,
  unstable_hasExternalPressOwnership,
  unstable_releaseExternalPressOwnership,
} from '@tamagui/native'
import type { ReactNode } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { Button as KitchenSinkButton } from '../../kitchen-sink/src/components/Button'

const conf = createTamagui(getDefaultTamaguiConfig())
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function createGestureStub() {
  const gesture: any = {}

  for (const method of [
    'runOnJS',
    'maxDuration',
    'minDuration',
    'manualActivation',
    'hitSlop',
    'onBegin',
    'onStart',
    'onEnd',
    'onFinalize',
    'onTouchesDown',
    'onTouchesMove',
    'onTouchesUp',
    'onTouchesCancelled',
  ]) {
    gesture[method] = () => gesture
  }

  return gesture
}

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

function setGestureHandlerEnabled(
  enabled: boolean,
  GestureDetector?: any,
  GestureOverrides?: Record<string, any>
) {
  getGestureHandler().set({
    enabled,
    GestureDetector: enabled ? GestureDetector : null,
    Gesture: enabled
      ? {
          Tap: createGestureStub,
          LongPress: createGestureStub,
          Manual: createGestureStub,
          Exclusive: (...gestures: any[]) => gestures[0],
          ...GestureOverrides,
        }
      : null,
    ScrollView: null,
    RootView: null,
  })
}

async function renderButton(element: React.ReactElement) {
  let rendered: TestRenderer.ReactTestRenderer | null = null

  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={conf} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })

  return rendered!
}

function findWrappedText(rendered: TestRenderer.ReactTestRenderer) {
  const nodes = rendered.root.findAll((node) => node.props.children === 'HELLO')
  const textNode = nodes.find((node) => {
    const type = node.type
    return type === 'Text' || (typeof type === 'function' && type.name === 'Text')
  })

  if (!textNode) {
    throw new Error('wrapped text node not found')
  }

  return textNode
}

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }

  return style || {}
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('Button native text props', () => {
  test('passes maxFontSizeMultiplier from root props to wrapped text', async () => {
    const rendered = await renderButton(<Button maxFontSizeMultiplier={1}>HELLO</Button>)
    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes zero maxFontSizeMultiplier to wrapped text', async () => {
    const rendered = await renderButton(<Button maxFontSizeMultiplier={0}>HELLO</Button>)
    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(0)
  })

  test('lets textProps override root text props on wrapped text', async () => {
    const rendered = await renderButton(
      <Button maxFontSizeMultiplier={2} textProps={{ maxFontSizeMultiplier: 1 }}>
        HELLO
      </Button>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes styled text defaults to wrapped text', async () => {
    const CappedButton = styled(Button, {
      maxFontSizeMultiplier: 1,
    })

    const rendered = await renderButton(<CappedButton>HELLO</CappedButton>)

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes root text props to explicit Button.Text children', async () => {
    const rendered = await renderButton(
      <Button maxFontSizeMultiplier={1}>
        <Button.Text>HELLO</Button.Text>
      </Button>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('passes Button.Apply text props to explicit Button.Text children', async () => {
    const rendered = await renderButton(
      <Button.Apply maxFontSizeMultiplier={1}>
        <Button>
          <Button.Text>HELLO</Button.Text>
        </Button>
      </Button.Apply>
    )

    expect(findWrappedText(rendered).props.maxFontSizeMultiplier).toBe(1)
  })

  test('does not pass cursor style to native text', async () => {
    const rendered = await renderButton(<Button>HELLO</Button>)

    expect(flattenStyle(findWrappedText(rendered).props.style).cursor).toBeUndefined()
  })

  test('uses responder events for real press handlers when RNGH is enabled', async () => {
    vi.useFakeTimers()

    const GestureDetector = ({ children }: { children: ReactNode }) => {
      return children
    }
    let tapGestureCalls = 0
    setGestureHandlerEnabled(true, GestureDetector, {
      Tap: () => {
        tapGestureCalls += 1
        return createGestureStub()
      },
    })

    const onPressIn = vi.fn()
    const onPress = vi.fn()
    const onPressOut = vi.fn()

    const rendered = await renderButton(
      <View
        width={10}
        height={10}
        minPressDuration={0}
        onPressIn={onPressIn}
        onPress={onPress}
        onPressOut={onPressOut}
      />
    )

    expect(tapGestureCalls).toBe(0)

    const responderNode = rendered.root.find(
      (node) =>
        typeof node.props.onResponderGrant === 'function' &&
        typeof node.props.onResponderRelease === 'function'
    )

    await act(async () => {
      responderNode.props.onResponderGrant({})
      responderNode.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(onPressIn).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPressOut).toHaveBeenCalledTimes(1)
  })

  test('responder press fallback respects external press ownership', async () => {
    vi.useFakeTimers()

    setGestureHandlerEnabled(true, ({ children }: { children: ReactNode }) => children)

    const onPressIn = vi.fn()
    const onPress = vi.fn()
    const onPressOut = vi.fn()

    const rendered = await renderButton(
      <Button
        minPressDuration={0}
        onPressIn={onPressIn}
        onPress={onPress}
        onPressOut={onPressOut}
      >
        HELLO
      </Button>
    )

    const responderNodes = rendered.root.findAll(
      (node) =>
        typeof node.props.onStartShouldSetResponder === 'function' &&
        typeof node.props.onResponderGrant === 'function' &&
        typeof node.props.onResponderRelease === 'function'
    )

    const owner = unstable_claimExternalPressOwnership('button-test')
    expect(unstable_hasExternalPressOwnership()).toBe(true)
    const responderNode = responderNodes.find(
      (node) => node.props.onStartShouldSetResponder({}) === false
    )
    expect(responderNode).toBeTruthy()

    await act(async () => {
      responderNode!.props.onResponderGrant({})
      unstable_releaseExternalPressOwnership(owner, 'button-test')
      responderNode!.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(onPressIn).not.toHaveBeenCalled()
    expect(onPress).not.toHaveBeenCalled()
    expect(onPressOut).not.toHaveBeenCalled()
  })
})

describe('copied Button skin native behavior', () => {
  test('handles a press and removes disabled press responders', async () => {
    vi.useFakeTimers()
    const onPress = vi.fn()
    const rendered = await renderButton(
      <KitchenSinkButton
        testID="button-skin-native"
        minPressDuration={0}
        onPress={onPress}
      >
        HELLO
      </KitchenSinkButton>
    )
    const responder = rendered.root.find(
      (node) =>
        typeof node.props.onStartShouldSetResponder === 'function' &&
        node.props.onStartShouldSetResponder({}) === true &&
        typeof node.props.onResponderGrant === 'function' &&
        typeof node.props.onResponderRelease === 'function'
    )

    await act(async () => {
      responder.props.onResponderGrant({})
      responder.props.onResponderRelease({})
      vi.runAllTimers()
    })

    expect(onPress).toHaveBeenCalledTimes(1)

    const disabled = await renderButton(
      <KitchenSinkButton
        testID="button-skin-native-disabled"
        disabled
        minPressDuration={0}
        onPress={onPress}
      >
        HELLO
      </KitchenSinkButton>
    )
    const activeDisabledResponders = disabled.root.findAll((node) => {
      return (
        typeof node.props.onStartShouldSetResponder === 'function' &&
        node.props.onStartShouldSetResponder({}) === true &&
        typeof node.props.onResponderRelease === 'function'
      )
    })

    expect(activeDisabledResponders).toHaveLength(0)
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
