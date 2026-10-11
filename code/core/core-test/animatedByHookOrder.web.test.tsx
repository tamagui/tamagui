// animationDriver is derived from the per-render animatedBy prop, but
// createComponent conditions a layout effect on animationDriver.avoidReRenders.
// switching animatedBy between drivers that differ in avoidReRenders must not
// change the component's hook count mid-lifecycle (React throws "Rendered
// more/fewer hooks than during the previous render"). the gate is latched on
// first render via stateRef.
//
// both mock drivers use zero hooks in useAnimations/usePresence so the ONLY
// hook-count difference between them is the avoidReRenders-gated effect.
process.env.TAMAGUI_TARGET = 'web'

import { act, render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import config from '../config-default'
import { TamaguiProvider, View, createTamagui } from '../web/src'
import { createMockAnimationDriver } from './mockAnimationDriver'

const conf = createTamagui({
  ...config.getDefaultTamaguiConfig(),
  animations: {
    default: createMockAnimationDriver({ avoidReRenders: false, inputStyle: 'value' }),
    avoid: createMockAnimationDriver({ avoidReRenders: true, inputStyle: 'value' }),
  },
})

function app(animatedBy: string) {
  return (
    <TamaguiProvider config={conf} defaultTheme="light">
      <View transition="100ms" animatedBy={animatedBy as any} backgroundColor="blue" />
    </TamaguiProvider>
  )
}

describe('animatedBy driver switching hook stability', () => {
  test('switching to an avoidReRenders driver does not change hook count', () => {
    const rendered = render(app('default'))
    expect(() => {
      act(() => {
        rendered.rerender(app('avoid'))
      })
    }).not.toThrow()
  })

  test('switching away from an avoidReRenders driver does not change hook count', () => {
    const rendered = render(app('avoid'))
    expect(() => {
      act(() => {
        rendered.rerender(app('default'))
      })
    }).not.toThrow()
  })
})
