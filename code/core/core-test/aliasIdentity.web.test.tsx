import * as core from '@tamagui/core'
import * as coreDom from '@tamagui/core/dom'
import * as coreInternalRuntime from '@tamagui/core/internal-runtime'
import * as coreStaticResolve from '@tamagui/core/static-resolve'
import * as coreThemeUpdate from '@tamagui/core/theme-update'
import * as style from '@tamagui/style'
import * as styleDom from '@tamagui/style/dom'
import * as styleInternalRuntime from '@tamagui/style/internal-runtime'
import * as styleStaticResolve from '@tamagui/style/static-resolve'
import * as styleThemeUpdate from '@tamagui/style/theme-update'
import { createRequire } from 'node:module'
import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'

/**
 * `@tamagui/core` is the pre-v3 name of `@tamagui/style` and still publishes, as a
 * package whose every entry re-exports the real one.
 *
 * The thing that has to hold is that it re-exports rather than copies. A second
 * copy of this runtime is a second config singleton, a second theme context and a
 * second style cache, so an app that reaches for both specifiers (its own code on
 * one, a dependency on the other) would silently get two of everything. Exported
 * bindings are the visible proof: they are the same objects only when there is one
 * module instance behind both names.
 */

beforeAll(() => {
  style.createTamagui(config.getDefaultTamaguiConfig())
})

describe('the @tamagui/core alias', () => {
  test('hands back the same binding for every single export', () => {
    // exhaustive on purpose: a partial alias that re-exports most of the surface
    // and re-wraps or re-creates the rest is the shape this has to rule out. the
    // components in particular are created at module scope by @tamagui/style
    // itself, so a second copy of it produces different objects here even though
    // everything it forwards from @tamagui/web still matches.
    const names = Object.keys(style)
    expect(names.length).toBeGreaterThan(100)
    expect(Object.keys(core).sort()).toEqual(names.slice().sort())
    for (const name of names) {
      expect(core[name], name).toBe(style[name])
    }
  })

  test('shares one config singleton, not a second copy', () => {
    // configured through @tamagui/style in beforeAll. a runtime with its own
    // module state would be unconfigured here.
    expect(core.getConfig()).toBe(style.getConfig())
    expect(core.getThemes()).toBe(style.getThemes())
    expect(core.getTokens()).toBe(style.getTokens())
  })

  test('is one instance through require too, which is what the compiler uses', () => {
    // the bundler graph above and node's CJS cache are separate resolutions, and
    // the compiler, metro and any require() in an app config take this one.
    const nodeRequire = createRequire(import.meta.url)
    expect(nodeRequire('@tamagui/core')).toBe(nodeRequire('@tamagui/style'))
  })

  test('re-exports every subpath rather than duplicating it', () => {
    for (const [aliased, real] of [
      [coreDom, styleDom],
      [coreThemeUpdate, styleThemeUpdate],
      [coreInternalRuntime, styleInternalRuntime],
      [coreStaticResolve, styleStaticResolve],
    ] as const) {
      const names = Object.keys(real)
      expect(names.length).toBeGreaterThan(0)
      expect(Object.keys(aliased).sort()).toEqual(names.slice().sort())
      for (const name of names) {
        expect(aliased[name], name).toBe(real[name])
      }
    }
  })
})
