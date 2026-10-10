process.env.TAMAGUI_TARGET = 'native'

// same runtime fast path as nativeFastPath.native.test.tsx but against the
// v6 defaultConfig with $-prefixed tokens — the shape every real app uses.
// regression: on-device parity found cold pushes carrying the literal
// "$background" instead of the resolved theme value under this config.
import { defaultConfig } from '@tamagui/config/v6'
import {
  TamaguiProvider,
  Theme,
  View,
  createTamagui,
  setNativeStyleEngine,
  styled,
  type NativeStyleEngine,
  type NativeViewStateUpdate,
} from '@tamagui/core'
import { act, render } from '@testing-library/react-native'
import React, { useMemo, useState } from 'react'
import { afterEach, beforeEach, expect, test } from 'vitest'

// bare v6 defaultConfig has level/inverse sub-themes only; add a blue pair
// the way kitchen-sink's custom themes do so nested pinning is testable
const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light_blue: {
      ...(defaultConfig.themes as any).light,
      background: '#dbeafe',
      color: '#1447e6',
    },
    dark_blue: {
      ...(defaultConfig.themes as any).dark,
      background: '#162456',
      color: '#8ec5ff',
    },
  },
})

const Square = styled(View, {
  width: 56,
  height: 56,
  margin: '$2',
  borderRadius: '$4',
  backgroundColor: '$background',
  borderColor: '$color',
})

function createMockEngine() {
  const batches: NativeViewStateUpdate[][] = []
  let nextId = 1
  const engine: NativeStyleEngine = {
    link: () => ({ id: nextId++, unlink: () => {} }),
    applyViewStates: (entries) => {
      batches.push(entries)
    },
    updateViewStateTables: () => {},
    processStyleColors: (props) => props,
    setStateName: () => {},
    removeScope: () => {},
  }
  return { engine, batches, entries: () => batches.flat() }
}

let mock: ReturnType<typeof createMockEngine>

beforeEach(() => {
  mock = createMockEngine()
  setNativeStyleEngine(mock.engine)
})

afterEach(() => {
  setNativeStyleEngine(null)
})

let setSub: (sub: string) => void

function Harness() {
  const [sub, _setSub] = useState('red')
  setSub = _setSub
  const squares = useMemo(() => <Square testID="sq" />, [])
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={sub as any}>{squares}</Theme>
    </TamaguiProvider>
  )
}

const flush = async () => {
  await act(async () => {})
}

let setOuter: (sub: string) => void

function NestedHarness() {
  const [outer, _setOuter] = useState('red')
  setOuter = _setOuter
  const grid = useMemo(
    () => (
      <>
        <Square testID="follower" />
        <Theme name="blue">
          <Square testID="pinned" />
        </Theme>
      </>
    ),
    []
  )
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Theme name={outer as any}>{grid}</Theme>
    </TamaguiProvider>
  )
}

test('v6 config: cold push carries resolved values, never raw tokens', async () => {
  render(<Harness />, { createNodeMock: () => ({}) })
  await flush()

  await act(async () => setSub('green'))
  await flush()

  const entries = mock.entries()
  expect(entries).toHaveLength(1)
  expect(entries[0].state).toBe('light_green')
  const props = entries[0].props!
  expect(props.backgroundColor).toBe((config.themes.light_green.background as any).val)
  expect(props.borderTopColor).toBe((config.themes.light_green.color as any).val)
  // token-based size props resolve too
  expect(typeof props.borderTopLeftRadius).toBe('number')
  expect(typeof props.marginTop).toBe('number')
  // and no raw tokens anywhere in the pushed props
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string') {
      expect(v.startsWith('$'), `${k} pushed raw token ${v}`).toBe(false)
    }
  }
})

test('a pinned inner sub-theme never receives outer-theme pushes', async () => {
  const tree = render(<NestedHarness />, { createNodeMock: () => ({}) })
  await flush()
  // the pinned square must actually render blue before we assert push behavior
  expect(JSON.stringify(tree.toJSON())).toContain('#dbeafe')
  // ids: follower links first, pinned second
  await act(async () => setOuter('green'))
  await flush()
  await act(async () => setOuter('red'))
  await flush()

  const entries = mock.entries()
  const followerId = 1
  const pinnedId = 2
  const followerStates = entries.filter((e) => e.id === followerId).map((e) => e.state)
  const pinnedEntries = entries.filter((e) => e.id === pinnedId)

  expect(followerStates).toEqual(['light_green', 'light_red'])
  // the pinned square resolves light_blue regardless of the outer toggle: no
  // entry may ever carry a non-blue state, and since its resolved state never
  // changes there is nothing to commit at all
  for (const e of pinnedEntries) {
    expect(e.state).toBe('light_blue')
  }
  expect(pinnedEntries).toHaveLength(0)
})
