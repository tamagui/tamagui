// setMediaShouldUpdate stores per-component data (should this component update
// on media changes, and which keys it listens to). that data must be keyed per
// component instance: if it's keyed on the shared componentContext, the last
// sibling to render overwrites it for every component under the provider — a
// media-independent sibling rendering after a media-dependent one silently
// disables the latter's media subscription.
process.env.TAMAGUI_TARGET = 'web'

import { act, render } from '@testing-library/react'
import { memo, useState } from 'react'
import { describe, expect, test } from 'vitest'
import config from '../config-default'
import {
  TamaguiProvider,
  View,
  createTamagui,
  setMediaState,
  updateMediaListeners,
} from '../web/src'

const conf = createTamagui(config.getDefaultTamaguiConfig())

// memo so only its own prop change re-renders it — the point is to make this
// media-independent component the LAST one to run setMediaShouldUpdate
const StaticSibling = memo(function StaticSibling({
  tick,
  renders,
}: {
  tick: number
  renders: { current: number }
}) {
  return (
    <View
      data-testid="static"
      data-tick={tick}
      data-test-renders={renders}
      backgroundColor="green"
    />
  )
})

describe('setMediaShouldUpdate sibling isolation', () => {
  test('a media-independent sibling rendering last does not disable a media reader', async () => {
    setMediaState({ sm: false, md: false, lg: false, xl: false, xxl: false } as any)

    const staticRenders = { current: 0 }
    let bump: () => void = () => {}

    function App() {
      const [tick, setTick] = useState(0)
      bump = () => setTick((t) => t + 1)
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          {/* disableClassName forces runtime (inline) media evaluation, which
              registers this component as needing media updates */}
          <View
            data-testid="media-reader"
            disableClassName
            backgroundColor="blue sm:red"
          />
          <StaticSibling tick={tick} renders={staticRenders} />
        </TamaguiProvider>
      )
    }

    const { getByTestId } = render(<App />)

    // let the enter state machine settle (disableClassName defers noClass
    // until unmounted flips false, behind a double requestAnimationFrame)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60))
    })
    expect(getByTestId('media-reader').style.backgroundColor).toBe('blue')

    // re-render ONLY the media-independent sibling so it runs
    // setMediaShouldUpdate last
    act(() => {
      bump()
    })

    const staticRendersBefore = staticRenders.current

    act(() => {
      setMediaState({ sm: true, md: false, lg: false, xl: false, xxl: false } as any)
      updateMediaListeners()
    })

    // the media reader must re-render with its sm: clause applied
    expect(getByTestId('media-reader').style.backgroundColor).toBe('red')
    // and the media-independent sibling must NOT re-render on a media change
    expect(staticRenders.current).toBe(staticRendersBefore)
  })
})
