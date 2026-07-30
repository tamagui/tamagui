process.env.TAMAGUI_TARGET = 'web'

import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui } from '../web/src'
import { createGrammarRuntimeContext } from '../web/src/helpers/grammarConfig'
import {
  getCachedPrograms,
  getProgramCacheSize,
  resetProgramCache,
  setProgramCacheContext,
} from '../web/src/helpers/programCache'

// The runtime parse cache (lane W4). It covers pipeline steps 1 and 2 only:
// parse, then split family props. It sits before resolution, which is what makes
// entries valid for the life of a config.

const tamaguiConfig = createTamagui(config.getDefaultTamaguiConfig())
const context = createGrammarRuntimeContext(tamaguiConfig)

// NOTE: this test must run first — it asserts the module state before any
// context is installed, and vitest runs tests in declaration order.
test('parsing before config creation installs a context is a named error', () => {
  expect(() => getCachedPrograms('color', 'red')).toThrow(
    /program cache has no config context/
  )
})

describe('the program cache', () => {
  beforeAll(() => {
    setProgramCacheContext({
      registry: context.registry,
      configRevision: context.configRevision,
      colorTokens: context.colorTokens,
    })
  })

  test('a miss parses and a hit returns the very same entry', () => {
    resetProgramCache()
    const first = getCachedPrograms('color', 'red hover:blue')
    expect(getProgramCacheSize()).toBe(1)
    const second = getCachedPrograms('color', 'red hover:blue')
    // identity, not equality: a hit must not re-parse
    expect(second).toBe(first)
    expect(getProgramCacheSize()).toBe(1)
  })

  test('property and input are both part of the key', () => {
    resetProgramCache()
    const color = getCachedPrograms('color', 'red')
    const background = getCachedPrograms('backgroundColor', 'red')
    expect(background).not.toBe(color)
    expect(color.programs?.[0].property).toBe('color')
    expect(background.programs?.[0].property).toBe('backgroundColor')
    expect(getProgramCacheSize()).toBe(2)
  })

  test('a non-family prop stays one program on the authored property', () => {
    resetProgramCache()
    const entry = getCachedPrograms('padding', '4 sm:8')
    // geometric shorthands expand during the forward merge, not here
    expect(entry.programs).toHaveLength(1)
    expect(entry.programs?.[0].property).toBe('padding')
    expect(entry.programs?.[0].value).toEqual({
      base: '4',
      clauses: [{ modifiers: ['sm'], payload: '8' }],
    })
  })

  test('the background family splits per longhand', () => {
    resetProgramCache()
    const color = getCachedPrograms('bg', 'red hover:blue')
    expect(color.programs?.map((program) => program.property)).toEqual([
      'backgroundColor',
    ])

    const both = getCachedPrograms('bg', 'url(x.png) red')
    expect(both.programs?.map((program) => program.property).sort()).toEqual([
      'backgroundColor',
      'backgroundImage',
    ])
  })

  test('a parse error is cached too, so a render loop cannot re-parse it', () => {
    resetProgramCache()
    const first = getCachedPrograms('color', 'red } .injected { color: blue')
    expect(first.programs).toBeUndefined()
    expect(first.errors?.[0]).toMatchObject({ code: 'invalid-character' })
    expect(getCachedPrograms('color', 'red } .injected { color: blue')).toBe(first)
    expect(getProgramCacheSize()).toBe(1)
  })

  test('an unregistered modifier is a cached error, not a silent value', () => {
    resetProgramCache()
    const entry = getCachedPrograms('color', 'red hver:blue')
    expect(entry.errors?.[0]).toMatchObject({
      code: 'unregistered-modifier',
      modifier: 'hver',
    })
  })

  test('a family error is cached as an error entry', () => {
    resetProgramCache()
    // two colors in one background payload cannot split into one longhand each
    const entry = getCachedPrograms('bg', 'red blue')
    expect(entry.programs).toBeUndefined()
    expect(entry.errors?.[0]).toMatchObject({ code: 'unsupported-bg-component' })
  })

  test('registered media and container modifiers parse through the real config', () => {
    resetProgramCache()
    expect(
      getCachedPrograms('color', 'red sm:blue @md/layout:green dark:hover:gray').programs
    ).toHaveLength(1)
    const value = getCachedPrograms(
      'color',
      'red sm:blue @md/layout:green dark:hover:gray'
    ).programs?.[0].value
    expect(value?.clauses.map((clause) => clause.modifiers)).toEqual([
      ['sm'],
      ['@md/layout'],
      ['dark', 'hover'],
    ])
  })

  test('the cap resets the cache wholesale instead of evicting', () => {
    resetProgramCache()
    for (let index = 0; index < 10_000; index++) {
      getCachedPrograms('color', `rgb(${index}, 0, 0)`)
    }
    expect(getProgramCacheSize()).toBe(10_000)
    getCachedPrograms('color', 'one past the cap')
    // a reset re-parses on demand and changes nothing observable
    expect(getProgramCacheSize()).toBe(1)
  })

  test('installing a context drops every entry from the previous config', () => {
    resetProgramCache()
    getCachedPrograms('color', 'red')
    expect(getProgramCacheSize()).toBe(1)
    setProgramCacheContext({
      registry: context.registry,
      configRevision: `${context.configRevision}-next`,
      colorTokens: context.colorTokens,
    })
    expect(getProgramCacheSize()).toBe(0)
  })
})
