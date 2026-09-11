process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { createAnimations } from '../animations-css/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { TamaguiProvider, createTamagui, useAnimatedNumber } from '../web/src'

const config = createTamagui({
  ...getDefaultTamaguiConfig(),
  animations: createAnimations({ quick: 'ease-out 100ms' }),
})

function AnimatedNumberConsumer() {
  useAnimatedNumber(0)
  return null
}

test('core CSS driver rejects animated-number hooks with the extras migration', () => {
  expect(() =>
    render(
      <TamaguiProvider config={config} defaultTheme="light">
        <AnimatedNumberConsumer />
      </TamaguiProvider>
    )
  ).toThrow(/@tamagui\/animations-css\/extras/)
})
