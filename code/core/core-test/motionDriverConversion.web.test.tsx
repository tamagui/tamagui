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

function runBaseline() {
  const start = performance.now()
  new Array(100_000).fill(0).map(() => {
    return JSON.stringify([].concat([]).concat([]).concat([]))
  })
  return performance.now() - start
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
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

    // normalize against same-process work so scheduler contention slows both
    // measurements instead of looking like a product regression.
    runBaseline()
    const baselines = Array.from({ length: 5 }, runBaseline)
    const baselinePerCallUs = (median(baselines) / 100_000) * 1000

    const start = performance.now()
    for (let i = 0; i < N; i++) {
      motionGetProps({ style: { transform: [{ translateY: i * 0.5 }] } })
    }
    const perCallUs = ((performance.now() - start) / N) * 1000
    // unloaded arm64 runs one conversion in about 50 baseline operations.
    const slowdown = perCallUs / baselinePerCallUs / 50
    console.info(
      `motion per-change conversion: ${perCallUs.toFixed(2)}us, baseline: ${baselinePerCallUs.toFixed(3)}us, slowdown: ${slowdown.toFixed(2)}x`
    )
    // preserve the original order-of-magnitude regression ceiling.
    expect(slowdown).toBeLessThan(10)
  })
})
