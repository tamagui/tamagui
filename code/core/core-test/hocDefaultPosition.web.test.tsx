process.env.TAMAGUI_TARGET = 'web'

import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'

const defaults = getDefaultTamaguiConfig('web')
const config = createTamagui({
  ...defaults,
  settings: { ...defaults.settings, defaultPosition: 'relative' },
})

const Frame = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
})

const Hoc = createStyledHOC(Frame, (props: any, ref: any) => (
  <Frame ref={ref} {...props} />
))

// a skin layered over a behavior HOC, the way a styled Sheet.Background wraps
// the behavior package's background
const Skinned = styled(Hoc, { backgroundColor: 'red' })

const RelativeByDefault = styled(View, { backgroundColor: 'red' })

function positionOf(testID: string, element: React.ReactElement) {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      {element}
    </TamaguiProvider>
  )
  const node = container.querySelector(`[data-testid="${testID}"]`) as HTMLElement
  expect(node).toBeTruthy()
  return getComputedStyle(node).position
}

test('a styled HOC keeps the absolute position its frame authored', () => {
  expect(positionOf('skinned', <Skinned testID="skinned" />)).toBe('absolute')
})

test('a plain styled view still takes the relative default', () => {
  expect(positionOf('plain', <RelativeByDefault testID="plain" />)).toBe('relative')
})

test('a call-site position on a styled HOC still wins', () => {
  expect(positionOf('override', <Skinned testID="override" position="relative" />)).toBe(
    'relative'
  )
})
