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

const OpaqueHoc = createStyledHOC(Base, (props: any, ref: any) => (
  <section data-hoc-shell="">
    <Base ref={ref} data-testid={props['data-testid']} />
  </section>
))

const nestedOuterVariants = {
  outer: {
    true: {
      alpha: {
        default: 'low',
        'web:hover': 'high',
      },
    },
  },
} as const

const OpaqueOuter = styled(OpaqueHoc, {
  variants: nestedOuterVariants,
})

const DirectOuter = styled(Base, {
  variants: nestedOuterVariants,
})

const DoubleOpaqueHoc = createStyledHOC(OpaqueHoc, (props: any, ref: any) => (
  <article data-outer-hoc-shell="">
    <OpaqueHoc ref={ref} data-testid={props['data-testid']} />
  </article>
))

const DoubleOpaqueOuter = styled(DoubleOpaqueHoc, {
  variants: nestedOuterVariants,
})

const transformVariants = {
  composed: {
    true: {
      x: 5,
      rotate: '10deg',
      scale: 2,
    },
  },
} as const

const DirectTransform = styled(Base, {
  variants: transformVariants,
})

const OpaqueTransform = styled(OpaqueHoc, {
  variants: transformVariants,
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

test('HOC contributions cross arbitrary render output without ordinary prop forwarding', () => {
  const { container } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <OpaqueOuter
        alpha="low"
        beta="hover:true"
        outer="web:hover:true"
        forceStyle="hover"
        style={[{ paddingLeft: 25 }, { paddingLeft: '26px hover:27px' }]}
        testID="opaque-probe"
      />
    </TamaguiProvider>
  )
  const node = container.querySelector('[data-testid="opaque-probe"]') as HTMLElement
  expect(node).toBeTruthy()
  expect(node.closest('[data-hoc-shell]')).toBeTruthy()
  // outer's nested web:hover selection is authored last and must keep both
  // condition atoms. flattening it to hover, or replaying it before beta/style,
  // produces 20, 26, or 27 instead of 30.
  expect(node.style.paddingLeft).toBe('30px')
})

test('packed conditions produce the same atomic classes as a direct styled frame', () => {
  const { getByTestId } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <DirectOuter
        alpha="low"
        beta="hover:true"
        outer="web:hover:true"
        style={[{ paddingLeft: 25 }, { paddingLeft: '26px hover:27px' }]}
        testID="direct-atomic"
      />
      <OpaqueOuter
        alpha="low"
        beta="hover:true"
        outer="web:hover:true"
        style={[{ paddingLeft: 25 }, { paddingLeft: '26px hover:27px' }]}
        testID="packed-atomic"
      />
    </TamaguiProvider>
  )

  const direct = getByTestId('direct-atomic')
  const packed = getByTestId('packed-atomic')
  expect(packed.className).toBe(direct.className)
  expect(packed.getAttribute('style')).toBe(direct.getAttribute('style'))
})

test('nested HOCs retain the ultimate styled target and parent replay chain', () => {
  const { getByTestId } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <DoubleOpaqueOuter
        alpha="low"
        beta="hover:true"
        outer="web:hover:true"
        forceStyle="hover"
        testID="double-opaque"
      />
    </TamaguiProvider>
  )

  const node = getByTestId('double-opaque')
  expect(node.closest('[data-outer-hoc-shell]')).toBeTruthy()
  expect(node.style.paddingLeft).toBe('30px')
})

test('transform parts compose after replay and raw className survives omission', () => {
  const { getByTestId } = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <DirectTransform
        composed
        className="raw-user-class"
        style={[{ x: 8 }, { scale: 3 }]}
        testID="direct-transform"
      />
      <OpaqueTransform
        composed
        className="raw-user-class"
        style={[{ x: 8 }, { scale: 3 }]}
        testID="packed-transform"
      />
    </TamaguiProvider>
  )

  const direct = getByTestId('direct-transform')
  const packed = getByTestId('packed-transform')
  expect(getComputedStyle(packed).transform).toBe(getComputedStyle(direct).transform)
  expect(packed.className.split(' ').filter((name) => name === 'raw-user-class')).toEqual(
    ['raw-user-class']
  )
})
