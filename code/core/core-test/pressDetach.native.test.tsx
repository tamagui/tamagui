import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { getGestureHandler } from '@tamagui/native'
import { useState } from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig('native'))

function setGestureHandlerEnabled(enabled: boolean) {
  getGestureHandler().set({
    enabled,
    Gesture: null,
    GestureDetector: null,
    ScrollView: null,
  })
}

beforeEach(() => {
  setGestureHandlerEnabled(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  setGestureHandlerEnabled(false)
})

// mirrors a selectable row: press clauses only while unselected. the select
// control stands in for the tap's own onPress winning the race to commit
// selection before the touch-up is delivered.
function DetachCase() {
  const [selected, setSelected] = useState(false)
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View
        testID="row"
        minPressDuration={0}
        bg={selected ? 'blue' : 'white hover:green press:red'}
        onPress={selected ? undefined : () => setSelected(true)}
      />
      <View testID="select" minPressDuration={0} onPress={() => setSelected(true)} />
      <View testID="reset" minPressDuration={0} onPress={() => setSelected(false)} />
    </TamaguiProvider>
  )
}

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }
  return style || {}
}

function hostNode(rendered: TestRenderer.ReactTestRenderer, testID: string) {
  return rendered.root.find(
    (node) => typeof node.type === 'string' && node.props.testID === testID
  )
}

function backgroundOf(rendered: TestRenderer.ReactTestRenderer, testID: string) {
  return flattenStyle(hostNode(rendered, testID).props.style).backgroundColor
}

async function tap(rendered: TestRenderer.ReactTestRenderer, testID: string) {
  await act(async () => {
    hostNode(rendered, testID).props.onResponderGrant({})
    hostNode(rendered, testID).props.onResponderRelease({})
    vi.runAllTimers()
  })
}

describe('press detach', () => {
  test('conditional press clauses removed mid-press do not latch the press wash', async () => {
    vi.useFakeTimers()

    let rendered: TestRenderer.ReactTestRenderer | null = null
    await act(async () => {
      rendered = TestRenderer.create(<DetachCase />)
    })

    // press in: the wash shows
    await act(async () => {
      hostNode(rendered!, 'row').props.onResponderGrant({})
    })
    expect(backgroundOf(rendered!, 'row')).toBe('red')

    // selection commits while the press is in flight and the touch-up is never
    // delivered — the release that loses the race to the re-render on device
    await tap(rendered!, 'select')
    expect(backgroundOf(rendered!, 'row')).toBe('blue')

    // re-attaching the press clauses must not resurrect the wash
    await tap(rendered!, 'reset')
    expect(backgroundOf(rendered!, 'row')).toBe('#fff')
  })
})
