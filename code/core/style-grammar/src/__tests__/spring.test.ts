import { describe, expect, test } from 'vitest'
import {
  bounceToDampingRatio,
  dampingRatioToBounce,
  springFromDurationBounce,
  springPosition,
  springSettleTime,
  springToDurationBounce,
  springToLinearEasing,
} from '../runtime/spring'

describe('spring solver', () => {
  test('round-trips canonical <-> physics', () => {
    for (const duration of [120, 200, 350, 800]) {
      for (const bounce of [-0.5, -0.2, 0, 0.2, 0.5, 0.8]) {
        const physics = springFromDurationBounce({ duration, bounce })
        const back = springToDurationBounce(physics)
        expect(back.duration).toBeCloseTo(duration, 6)
        expect(back.bounce).toBeCloseTo(bounce, 6)
      }
    }
  })

  test('bounce 0 is critically damped and never overshoots', () => {
    expect(bounceToDampingRatio(0)).toBe(1)
    expect(dampingRatioToBounce(1)).toBe(0)
    const canonical = { duration: 300, bounce: 0 }
    for (let step = 0; step <= 100; step++) {
      expect(springPosition(canonical, (step / 100) * 1.5)).toBeLessThanOrEqual(1)
    }
  })

  test('positive bounce overshoots, negative bounce does not', () => {
    let maxBouncy = 0
    let maxOverdamped = 0
    for (let step = 0; step <= 400; step++) {
      const t = (step / 400) * 2
      maxBouncy = Math.max(maxBouncy, springPosition({ duration: 300, bounce: 0.6 }, t))
      maxOverdamped = Math.max(
        maxOverdamped,
        springPosition({ duration: 300, bounce: -0.6 }, t)
      )
    }
    expect(maxBouncy).toBeGreaterThan(1)
    expect(maxOverdamped).toBeLessThanOrEqual(1)
  })

  test('every damping regime starts at rest and reaches the target', () => {
    for (const bounce of [-0.6, 0, 0.6]) {
      const canonical = { duration: 250, bounce }
      expect(springPosition(canonical, 0)).toBeCloseTo(0, 10)
      const settle = springSettleTime(canonical)
      expect(springPosition(canonical, settle / 1000)).toBeCloseTo(1, 2)
    }
  })

  test('settle time exceeds the undamped period for a bouncy spring', () => {
    // the reason css cannot just reuse `duration` as transition-duration
    expect(springSettleTime({ duration: 300, bounce: 0.6 })).toBeGreaterThan(300)
  })

  test('linear() easing is pinned at both ends and encodes overshoot', () => {
    const { easing, durationMs } = springToLinearEasing({ duration: 300, bounce: 0.5 })
    expect(easing.startsWith('linear(0, ')).toBe(true)
    expect(easing.endsWith(', 1)')).toBe(true)
    expect(durationMs).toBeGreaterThan(300)
    const samples = easing.slice('linear('.length, -1).split(', ').map(Number)
    expect(samples.some((value) => value > 1)).toBe(true)
    expect(samples.every((value) => Number.isFinite(value))).toBe(true)
  })

  test('matches the shipped bouncy preset physics', () => {
    // code/core/config/src/animations-rn.ts bouncy: damping 9, mass 0.9, stiffness 120
    const canonical = springToDurationBounce({ stiffness: 120, damping: 9, mass: 0.9 })
    expect(canonical.duration).toBeCloseTo(544, 0)
    expect(canonical.bounce).toBeCloseTo(0.567, 3)
  })
})
