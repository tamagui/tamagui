process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'

// validates the runtime side of the compiler's data-disable-events gate:
// when the flag is present, createComponent skips the native useEvents hook.
// the flag is normally emitted by the extractor on event-free deopted elements;
// here we pass it directly to exercise the gate (the extractor side is covered by
// flatten.native.test.tsx).

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Provider = ({ children }: any) => (
  <TamaguiProvider config={config}>{children}</TamaguiProvider>
)

// pass the internal compiler flag without fighting prop types
const disableEvents = { 'data-disable-events': true } as any

describe('data-disable-events runtime gate (native)', () => {
  test('renders an event-free element with the flag (useEvents skipped)', () => {
    const { toJSON } = render(
      <Provider>
        <View {...disableEvents} width={10} height={10} />
      </Provider>
    )
    expect(toJSON()).toBeTruthy()
  })

  test('hook order stays stable across re-render with the flag set', () => {
    // if the gate flipped the hook count between renders, React throws
    // "rendered fewer hooks than expected" here.
    const { rerender, toJSON } = render(
      <Provider>
        <View {...disableEvents} width={10} height={10} />
      </Provider>
    )
    rerender(
      <Provider>
        <View {...disableEvents} width={20} height={20} />
      </Provider>
    )
    expect(toJSON()).toBeTruthy()
  })

  test('control: an onPress element (no flag) still renders with events kept', () => {
    const { toJSON } = render(
      <Provider>
        <View onPress={() => {}} width={10} height={10} />
      </Provider>
    )
    expect(toJSON()).toBeTruthy()
  })
})
