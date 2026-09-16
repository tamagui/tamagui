process.env.TAMAGUI_TARGET = 'native'

import { ButtonFrame, ButtonText, useButton } from '@tamagui/button'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createRefComponent, createTamagui, styled } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { getGestureHandler } from '../native/src/gestureState'

const config = createTamagui(getDefaultTamaguiConfig('native'))
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

const StyledButton = styled(ButtonFrame, {
  displayName: 'StyledButtonHookRegression',
  variants: {
    disabled: {
      true: {
        opacity: 0.4,
      },
    },
  } as const,
})

const WrappedButton = createRefComponent<any, { disabled?: boolean }>(
  function WrappedButton({ disabled }, ref) {
    return (
      <StyledButton ref={ref} disabled={disabled} onPress={() => {}}>
        <ButtonText>Submit</ButtonText>
      </StyledButton>
    )
  }
)

function TestButton(props: { disabled?: boolean; testID?: string }) {
  const { props: buttonProps } = useButton({
    ...props,
    children: 'Submit',
    onPress: () => {},
  })

  return <ButtonFrame {...buttonProps} />
}

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

function setGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    GestureDetector: enabled ? ({ children }: any) => children : null,
    Gesture: enabled
      ? {
          Tap: createGestureStub,
          LongPress: createGestureStub,
          Manual: createGestureStub,
          Exclusive: (...gestures: any[]) => gestures[0],
        }
      : null,
    ScrollView: null,
  })
}

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('styled(Button) disabled hook stability', () => {
  test.each([false, true])(
    'does not throw when disabled toggles inside a ref prop wrapper (RNGH enabled: %s)',
    (gestureEnabled) => {
      setGestureHandlerEnabled(gestureEnabled)

      const app = (disabled: boolean) => (
        <TamaguiProvider config={config} defaultTheme="light">
          <WrappedButton disabled={disabled} />
        </TamaguiProvider>
      )

      const rendered = render(app(false))

      expect(() => {
        rendered.rerender(app(true))
      }).not.toThrow()
    }
  )

  test('resets the native accessibility state when re-enabled', () => {
    const app = (disabled: boolean) => (
      <TamaguiProvider config={config} defaultTheme="light">
        <TestButton testID="target-button" disabled={disabled} />
      </TamaguiProvider>
    )

    const rendered = render(app(true))
    const getTarget = () =>
      rendered
        .UNSAFE_getAllByProps({ testID: 'target-button' })
        .find((node) => 'aria-disabled' in node.props)!

    expect(getTarget().props['aria-disabled']).toBe(true)

    rendered.rerender(app(false))

    expect(getTarget().props['aria-disabled']).toBe(false)
  })
})
