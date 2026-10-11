import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { fireEvent, render } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

// press in and press out listen to touch and mouse alike. a touch screen tap
// fires touchstart and touchend, then the browser's compatibility mousedown and
// mouseup for the same tap: those must not press a second time.
function renderPressable() {
  const onPressIn = vi.fn()
  const onPressOut = vi.fn()
  const onPress = vi.fn()
  const { getByTestId } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View
        testID="pressable"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      />
    </TamaguiProvider>
  )
  return { node: getByTestId('pressable'), onPressIn, onPressOut, onPress }
}

function mouseAt(type: 'mousedown' | 'mouseup', timeStamp: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  return event
}

function touchAt(type: 'touchstart' | 'touchend', timeStamp: number) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'timeStamp', { value: timeStamp })
  return event
}

describe('web press pairing', () => {
  test('a tap presses once although the browser echoes it as mouse events', () => {
    const { node, onPressIn, onPressOut, onPress } = renderPressable()

    fireEvent(node, touchAt('touchstart', 100))
    fireEvent(node, touchAt('touchend', 180))
    fireEvent(node, mouseAt('mousedown', 190))
    fireEvent(node, mouseAt('mouseup', 191))
    fireEvent.click(node)

    expect(onPressIn).toHaveBeenCalledTimes(1)
    expect(onPressOut).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  test('a mouse press long after a touch still presses', () => {
    const { node, onPressIn, onPressOut } = renderPressable()

    fireEvent(node, touchAt('touchstart', 1_000))
    fireEvent(node, touchAt('touchend', 1_080))
    fireEvent(node, mouseAt('mousedown', 5_000))
    fireEvent(node, mouseAt('mouseup', 5_090))

    expect(onPressIn).toHaveBeenCalledTimes(2)
    expect(onPressOut).toHaveBeenCalledTimes(2)
  })
})
