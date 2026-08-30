process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'

const config = createTamagui(getDefaultTamaguiConfig('web'))

const Base = styled(View, {
  variants: {
    alpha: {
      low: { padding: 10 },
      high: { padding: 30 },
    },
    beta: {
      true: { paddingLeft: 20 },
    },
  } as const,
})

const Hoc = createStyledHOC(Base, (props: any, ref: any) => <Base ref={ref} {...props} />)

const Outer = styled(Hoc, {
  variants: {
    outer: {
      true: { alpha: 'high' },
    },
  } as const,
})

// a conditional variant contribution from the wrapping styled component must
// land at ITS authored position in the wrapped component's props: reassigning
// an existing key would replay it at the earlier position and let a prop
// authored between them win incorrectly
test('an outer conditional variant displaces a wrapped prop in authored position', () => {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Outer
        alpha="low"
        beta="hover:true"
        outer="hover:true"
        forceStyle="hover"
        testID="probe"
      />
    </TamaguiProvider>
  )
  const node = container.querySelector('[data-testid="probe"]') as HTMLElement
  expect(node).toBeTruthy()
  // outer resolves alpha:"high" (padding 30) AFTER beta's paddingLeft 20, so
  // the direct-pass answer is 30 — the HOC transport must agree
  expect(node.style.paddingLeft).toBe('30px')
})

test('an HOC transport preserves a default and nested condition', () => {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <Outer
        alpha={{ default: 'low', 'web:hover': 'high' } as any}
        forceStyle="hover"
        testID="nested-probe"
      />
    </TamaguiProvider>
  )
  const node = container.querySelector('[data-testid="nested-probe"]') as HTMLElement
  expect(node).toBeTruthy()
  expect(node.style.padding).toBe('30px')
})
