// avoidReRenders drivers (reanimated / react-native, inputStyle 'value') get
// media updates through the componentContext.mediaEmit emitter instead of
// re-rendering. the emit listener is registered once per component instance in
// render and must survive the enter state machine (unmounted true ->
// 'should-enter' -> false): the enter layout effect re-runs on each transition
// and its cleanup must not tear the listener down mid-lifecycle, or media
// styles silently stop applying after mount.
process.env.TAMAGUI_TARGET = 'web'

import { act, render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import config from '../config-default'
import {
  TamaguiProvider,
  View,
  createTamagui,
  setMediaState,
  updateMediaListeners,
} from '../web/src'
import { createMockAnimationDriver, type EmittedStyle } from './mockAnimationDriver'

const emissions: EmittedStyle[] = []

const conf = createTamagui({
  ...config.getDefaultTamaguiConfig(),
  animations: createMockAnimationDriver({
    avoidReRenders: true,
    inputStyle: 'value',
    emissions,
  }),
})

describe('avoidReRenders media emitter lifecycle', () => {
  test('media styles still apply after the enter transition completes', () => {
    setMediaState({ sm: false, md: false, lg: false, xl: false, xxl: false } as any)

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <View
          transition="100ms"
          enterStyle={{ opacity: 0 }}
          backgroundColor="blue sm:red"
        />
      </TamaguiProvider>
    )

    // the enter machine settles inside the initial act (value-input drivers
    // flip unmounted synchronously in the layout effect). only emissions from
    // the media change below matter.
    emissions.length = 0

    act(() => {
      setMediaState({ sm: true, md: false, lg: false, xl: false, xxl: false } as any)
      updateMediaListeners()
    })

    const last = emissions.at(-1)
    expect(last, 'driver must receive a style emit for the media change').toBeDefined()
    expect(last!.style.backgroundColor).toBe('red')
  })
})
