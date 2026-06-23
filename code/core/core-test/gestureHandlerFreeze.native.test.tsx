process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { TamaguiProvider } from '../core/src/index'
import { getGestureHandler } from '../native/src/gestureState'

const config = createTamagui(getDefaultTamaguiConfig('native'))
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function resetGestureHandlerFreeze() {
  delete (globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]
}

function setGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    Gesture: null,
    GestureDetector: null,
    ScrollView: null,
  })
}

beforeEach(() => {
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  vi.restoreAllMocks()
  resetGestureHandlerFreeze()
  setGestureHandlerEnabled(false)
})

describe('gesture handler enabled freeze', () => {
  test('ignores late disable after TamaguiProvider mounts', () => {
    setGestureHandlerEnabled(true)

    render(
      <TamaguiProvider config={config} defaultTheme="light">
        <View />
      </TamaguiProvider>
    )

    expect((globalThis as any)[GESTURE_ENABLED_FREEZE_KEY]).toMatchObject({
      frozen: true,
      enabled: true,
    })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    getGestureHandler().disable()

    expect(getGestureHandler().isEnabled).toBe(true)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0]?.[0]).toContain(
      'Configure gesture handler mode before the first render.'
    )
  })
})
