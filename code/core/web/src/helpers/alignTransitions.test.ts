import { afterEach, expect, test, vi } from 'vitest'
import { applyAccumulatedTransitions } from './alignTransitions'
import { applyAccumulatedTransitions as applyAccumulatedTransitionsNative } from './alignTransitions.native'

vi.mock('./nativeTransitionTarget', () => ({
  detectNativeTransitionTarget: () => ({ platform: 'ios', reactNativeMinor: 83 }),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

test('serializes aligned transitions on web', () => {
  const styleState = {
    conf: { shorthands: {} },
    transitionContributions: [{ prop: 'transition', value: 'opacity 200ms' }],
  } as any

  applyAccumulatedTransitions(styleState)

  expect(styleState.style).toEqual({ transition: 'opacity 200ms ease 0s normal' })
})

test('validates supported transitions before dropping them on native', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  try {
    const styleState = {
      transitionContributions: [{ prop: 'transition', value: 'opacity 200ms' }],
    } as any

    applyAccumulatedTransitionsNative(styleState)

    expect(styleState.style).toBeUndefined()
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('validated against the capability matrix')
    )
  } finally {
    process.env.NODE_ENV = previousNodeEnv
  }
})
