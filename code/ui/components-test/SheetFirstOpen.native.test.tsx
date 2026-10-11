import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { Sheet } from '@tamagui/sheet'
import { Paragraph } from '@tamagui/text'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// a driver that never fires completion callbacks, like a reanimated UI -> JS
// hop lost under load (#4237)
const baseConfig = getDefaultTamaguiConfig()
const baseAnimations = baseConfig.animations as any
const setValueCalls: { value: number; type?: string }[] = []
const droppingAnimations = {
  ...baseAnimations,
  useAnimatedNumber(initial: number) {
    const animated = baseAnimations.useAnimatedNumber(initial)
    return {
      ...animated,
      setValue(value: number, config?: { type?: string }) {
        setValueCalls.push({ value, type: config?.type })
        animated.setValue(value, config)
      },
    }
  },
}
const conf = createTamagui({ ...baseConfig, animations: droppingAnimations })

let rendered: TestRenderer.ReactTestRenderer | null = null

beforeEach(() => {
  vi.useFakeTimers()
  setValueCalls.length = 0
})

afterEach(async () => {
  await act(async () => {
    rendered?.unmount()
  })
  rendered = null
  vi.useRealTimers()
})

describe('native modal Sheet first open', () => {
  test('animates in even when the driver drops completion callbacks', async () => {
    await act(async () => {
      rendered = TestRenderer.create(
        <TamaguiProvider config={conf} defaultTheme="light">
          <PortalProvider shouldAddRootHost>
            <Sheet modal open snapPoints={[50]}>
              <Sheet.Overlay />
              <Sheet.Container>
                <Paragraph>content</Paragraph>
              </Sheet.Container>
            </Sheet>
          </PortalProvider>
        </TamaguiProvider>
      )
    })
    await act(async () => {
      for (const node of rendered!.root.findAll(
        (node) => typeof node.props.onLayout === 'function'
      )) {
        node.props.onLayout({
          nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 800 } },
        })
      }
    })
    await act(async () => vi.advanceTimersByTime(2000))

    // after the instant jump offscreen, the sheet must spring up to its snap
    // point instead of waiting forever on a callback that never comes
    expect(setValueCalls.length).toBeGreaterThan(0)
    const [jump, ...after] = setValueCalls
    expect(after.some((c) => c.type === 'spring' && c.value < jump.value)).toBe(true)
  })
})
