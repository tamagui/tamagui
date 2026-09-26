process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { View as TailwindView } from '@tamagui/tailwind'
import { describe, expect, test } from 'vitest'
import config from '../config-default'
import { createMockAnimationDriver } from './mockAnimationDriver'

const renderedStyles: Record<string, unknown>[] = []

const animationDriver = createMockAnimationDriver({ inputStyle: 'value' })
const useAnimations = animationDriver.useAnimations
animationDriver.useAnimations = (props) => {
  renderedStyles.push(props.style as Record<string, unknown>)
  return useAnimations(props)
}

const conf = createTamagui({
  ...config.getDefaultTamaguiConfig(),
  animations: animationDriver,
})

describe('Tailwind lifecycle clauses', () => {
  test('enter:opacity-0 supplies the first animated frame', () => {
    renderedStyles.length = 0

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <TailwindView transition="100ms" className="enter:opacity-0" />
      </TamaguiProvider>
    )

    expect(renderedStyles[0]?.opacity).toBe(0)
  })
})
