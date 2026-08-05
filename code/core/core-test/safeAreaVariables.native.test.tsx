process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { safeAreaVariableNames } from '@tamagui/style-grammar'
import { act, render } from '@testing-library/react-native'
import React from 'react'
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context'
import { afterEach, expect, test, vi } from 'vitest'

// keep the built runtime import before setup: the resolver and tracker must observe
// setup performed after their modules were first evaluated.
import * as NativeCore from '../core/dist/test.native.cjs'
import { getSafeArea } from '../native/src/safeAreaState'
import '../native/src/setup-safe-area.ts'

const { TamaguiProvider, View, createTamagui } =
  NativeCore as typeof import('@tamagui/core')
const config = createTamagui(getDefaultTamaguiConfig('native'))
const safeArea = getSafeArea()
const initialInsets = { top: 12, right: 13, bottom: 14, left: 15 }
const initialFrame = { x: 0, y: 0, width: 390, height: 844 }

let updateInsets: React.Dispatch<React.SetStateAction<typeof initialInsets>>

function SafeAreaHarness({ children }: { children: React.ReactNode }) {
  const [insets, setInsets] = React.useState(initialInsets)
  updateInsets = setInsets

  return (
    <SafeAreaFrameContext.Provider value={initialFrame}>
      <SafeAreaInsetsContext.Provider value={insets}>
        {children}
      </SafeAreaInsetsContext.Provider>
    </SafeAreaFrameContext.Provider>
  )
}

function paddingTop(node: ReturnType<typeof render>): unknown {
  const root = node.toJSON()
  if (!root || Array.isArray(root)) return undefined
  const style = root.props.style
  const values = (Array.isArray(style) ? style : [style]).flat(Infinity)
  return values.find((value) => value?.paddingTop !== undefined)?.paddingTop
}

afterEach(() => {
  vi.restoreAllMocks()
  safeArea.set({
    didSetup: true,
    enabled: true,
  })
})

test('safe-area values follow provider inset changes without a parent rerender', async () => {
  const renderCount = { current: 0 }
  const stableTree = (
    <TamaguiProvider config={config} defaultTheme="light">
      <View
        data-test-renders={renderCount}
        paddingTop={safeAreaVariableNames.top}
        testID="safe-area-value"
      />
    </TamaguiProvider>
  )
  const node = render(<SafeAreaHarness>{stableTree}</SafeAreaHarness>)

  expect(paddingTop(node)).toBe(12)
  const rendersBeforeUpdate = renderCount.current

  await act(async () => {
    updateInsets({ top: 44, right: 13, bottom: 14, left: 15 })
  })

  expect(paddingTop(node)).toBe(44)
  expect(renderCount.current).toBe(rendersBeforeUpdate + 1)
})

test('ordinary components never read or subscribe to the safe-area store', () => {
  const globalState = globalThis as typeof globalThis & {
    __tamagui_safe_area__: object
    __tamagui_safe_area_subscriptions__: {
      listeners: Set<() => void>
    }
  }
  const state = globalState.__tamagui_safe_area__
  // subscription storage is intentionally lazy; initialize it through the
  // public accessor before measuring that ordinary components add nothing.
  const disposeProbe = safeArea.subscribe(() => {})
  disposeProbe()
  let reads = 0
  globalState.__tamagui_safe_area__ = new Proxy(state, {
    get(target, property, receiver) {
      reads++
      return Reflect.get(target, property, receiver)
    },
  })

  const measure = (count: number) => {
    reads = 0
    const listenersBefore = globalState.__tamagui_safe_area_subscriptions__.listeners.size
    const node = render(
      <SafeAreaHarness>
        <TamaguiProvider config={config} defaultTheme="light">
          {Array.from({ length: count }, (_, index) => (
            <View key={index} paddingTop="10px" />
          ))}
        </TamaguiProvider>
      </SafeAreaHarness>
    )
    const result = {
      reads,
      subscriptions:
        globalState.__tamagui_safe_area_subscriptions__.listeners.size - listenersBefore,
    }
    node.unmount()
    return result
  }

  let one: ReturnType<typeof measure>
  let fifty: ReturnType<typeof measure>
  try {
    one = measure(1)
    fifty = measure(50)
  } finally {
    globalState.__tamagui_safe_area__ = state
  }

  expect(fifty.reads).toBe(one.reads)
  expect(one.subscriptions).toBe(0)
  expect(fifty.subscriptions).toBe(0)
})

test('missing native setup reports the required setup and provider once', () => {
  safeArea.set({
    didSetup: false,
    enabled: false,
    initialMetrics: null,
  })
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

  render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View paddingTop={safeAreaVariableNames.right} testID="safe-area-value" />
      <View paddingBottom={safeAreaVariableNames.bottom} />
    </TamaguiProvider>
  )

  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn.mock.calls[0][0]).toContain('@tamagui/native/setup-safe-area')
  expect(warn.mock.calls[0][0]).toContain('SafeAreaProvider')
})
