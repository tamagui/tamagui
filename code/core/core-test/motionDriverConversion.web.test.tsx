import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'
import { fixStyles } from '../web/src/helpers/expandStyles'
import { styleToCSS } from '../web/src/helpers/getCSSStylesAtomic'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

// mirrors the animations-motion driver's getProps: the conversion it runs on
// every animated value change (and, uncached, per render). guards the output
// contract that driver relies on.
function motionGetProps(props: object) {
  const out = getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    {
      isAnimated: false,
      noClass: true,
      resolveValues: 'auto',
    }
  )
  if (!out) return {}
  if (out.viewProps.style) {
    fixStyles(out.viewProps.style)
    styleToCSS(out.viewProps.style)
  }
  return out.viewProps
}

describe('motion driver getProps conversion', () => {
  test('converts getStyle output shapes to web CSS', () => {
    expect(
      motionGetProps({ style: { transform: [{ translateY: 123.45 }] } }).style
    ).toEqual({
      transform: 'translateY(123.45px)',
    })
    expect(motionGetProps({ style: { transform: [{ translateX: -20 }] } }).style).toEqual(
      {
        transform: 'translateX(-20px)',
      }
    )
    expect(motionGetProps({ style: { opacity: 0.5 } }).style).toEqual({ opacity: 0.5 })
    expect(motionGetProps({ style: { x: 10, y: 5, scale: 1.2 } }).style).toEqual({
      transform: 'translateX(10px) translateY(5px) scale(1.2)',
    })
    expect(
      motionGetProps({
        style: { opacity: 0.8, transform: [{ translateY: 4 }], borderRadius: 6 },
      }).style
    ).toEqual({
      opacity: 0.8,
      transform: 'translateY(4px)',
      borderRadius: '6px',
    })
  })

  test('per-change conversion stays cheap (sanity ceiling)', () => {
    const N = 10_000
    for (let i = 0; i < 1000; i++) {
      motionGetProps({ style: { transform: [{ translateY: i }] } })
    }
    const start = performance.now()
    for (let i = 0; i < N; i++) {
      motionGetProps({ style: { transform: [{ translateY: i * 0.5 }] } })
    }
    const perCallUs = ((performance.now() - start) / N) * 1000
    console.info(`motion per-change conversion: ${perCallUs.toFixed(2)}us per call`)
    // measured ~7us; alert if it regresses an order of magnitude
    expect(perCallUs).toBeLessThan(70)
  })
})
