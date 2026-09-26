process.env.TAMAGUI_TARGET = 'web'

import { describe, expect, test } from 'vitest'

import config from '../config-default'
import { createComponent, createTamagui } from '../web/src'

/**
 * The two zero-runtime guards.
 *
 * Compiler reference erasure is what removes these modules from a zero graph and
 * the bundle gate is what proves it; the guards are the loud secondary failure
 * for a reference that survived. Each case runs both halves, so the assertion
 * has an independent variable: with the literal absent the identical call has to
 * succeed, which is the only thing that makes the throwing half mean anything.
 */
function withRuntime<T>(value: string | undefined, run: () => T): T {
  const previous = process.env.TAMAGUI_RUNTIME
  if (value === undefined) delete process.env.TAMAGUI_RUNTIME
  else process.env.TAMAGUI_RUNTIME = value
  try {
    return run()
  } finally {
    if (previous === undefined) delete process.env.TAMAGUI_RUNTIME
    else process.env.TAMAGUI_RUNTIME = previous
  }
}

describe('zero-runtime guards', () => {
  test(`createComponent throws under the zero literal and builds without it`, () => {
    expect(() =>
      withRuntime('zero', () =>
        createComponent({ Component: 'div', acceptsClassName: true })
      )
    ).toThrow(/zero-runtime.*No Tamagui component renderer ships in this mode/s)

    const component = withRuntime('full', () =>
      createComponent({ Component: 'div', acceptsClassName: true })
    )
    expect(typeof component).toBe('object')
  })

  test(`createTamagui throws under the zero literal and parses without it`, () => {
    expect(() =>
      withRuntime('zero', () => createTamagui(config.getDefaultTamaguiConfig()))
    ).toThrow(/zero-runtime.*Config parsing and CSS generation happen at build time/s)

    const parsed = withRuntime('full', () =>
      createTamagui(config.getDefaultTamaguiConfig())
    )
    expect(parsed.themeConfig.cssRuleSets.length).toBeGreaterThan(0)
  })
})
