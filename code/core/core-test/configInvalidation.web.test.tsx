process.env.TAMAGUI_TARGET = 'web'

import { StyleObjectRules } from '@tamagui/helpers'
import { configRevisionSymbol } from '@tamagui/style-grammar/runtime'
import { beforeEach, expect, test } from 'vitest'

import config from '../config-default'
import { addTheme, mutateThemes } from '../theme/src'
import {
  createTamagui,
  getConfig,
  insertFont,
  setConfig,
  updateConfig,
  View,
} from '../web/src'
import {
  getConfigRevisionSnapshot,
  getConfigRevisionState,
} from '../web/src/helpers/grammarConfig'
import {
  buildAtomicSlotCSS,
  getCSSStyleAtomic,
} from '../web/src/helpers/getCSSStylesAtomic'
import { simplifiedGetSplitStyles } from './utils'

const rulesFor = (result: any): string[] =>
  Object.values(result.rulesToInsert ?? {}).flatMap(
    (entry: any) => entry?.[StyleObjectRules] ?? []
  )

beforeEach(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

test('a warmed config recognizes a theme added at runtime', () => {
  simplifiedGetSplitStyles(View, { backgroundColor: 'light:red' }, { themeName: 'light' })

  addTheme({ name: 'brand', theme: { background: 'blue' }, insertCSS: false })

  expect(
    simplifiedGetSplitStyles(
      View,
      { backgroundColor: 'red brand:blue' },
      { noClass: true, themeName: 'brand' }
    ).style?.backgroundColor
  ).toBe('blue')
})

test('a live media update refreshes query text and declaration precedence', () => {
  simplifiedGetSplitStyles(View, { backgroundColor: 'red sm:blue' })

  updateConfig('media', {
    sm: { minWidth: 1234 },
    newest: { minWidth: 1 },
  })

  const queried = simplifiedGetSplitStyles(View, {
    backgroundColor: 'red sm:blue',
  })
  expect(rulesFor(queried).join('')).toContain('@media (min-width: 1234px)')

  const ordered = simplifiedGetSplitStyles(
    View,
    { backgroundColor: 'newest:green sm:blue' },
    { noClass: true, mediaState: { newest: true, sm: true } }
  )
  expect(ordered.style?.backgroundColor).toBe('green')
})

test('a nested config getter update cannot be overwritten by its outer compile', () => {
  const current = getConfig()
  const before = getConfigRevisionState(current).revision
  let nested = false
  Object.defineProperty(current.media, 'nested-trigger', {
    configurable: true,
    enumerable: true,
    get() {
      if (!nested) {
        nested = true
        updateConfig('themes', { nested: current.themes.light })
      }
      return { minWidth: 4321 }
    },
  })

  updateConfig('media', { outer: { minWidth: 123 } })

  expect(nested).toBe(true)
  expect(getConfigRevisionState(current).revision).toBe(before + 2)
  expect(
    simplifiedGetSplitStyles(
      View,
      { backgroundColor: 'red nested:blue' },
      { noClass: true, themeName: 'nested' }
    ).style?.backgroundColor
  ).toBe('blue')
})

test('setConfig compiles before publish and a nested install remains authoritative', () => {
  const previous = getConfig()
  const nested = { ...previous, media: { ...previous.media } }
  const outer = { ...previous } as typeof previous
  let reads = 0
  Object.defineProperty(outer, 'media', {
    configurable: true,
    enumerable: true,
    get() {
      reads++
      setConfig(nested)
      return previous.media
    },
  })

  setConfig(outer)

  expect(reads).toBe(1)
  expect(getConfig()).toBe(nested)
})

test('an atomic style lookup cannot hide a config swap from the slot cache', () => {
  const current = getConfig()
  const first = {
    ...current,
    media: { ...current.media, probe: { minWidth: 600 } },
  } as typeof current
  const second = {
    ...current,
    media: { ...current.media, probe: { minWidth: 900 } },
  } as typeof current

  try {
    setConfig(first)
    const initial = buildAtomicSlotCSS(
      'color',
      [
        {
          property: 'color',
          value: 'red',
          condition: 1,
          identity: 'red',
          selector: '',
          wrappers: ['@media (min-width: 600px)'],
        },
      ],
      'config-swap-probe'
    )!

    setConfig(second)
    getCSSStyleAtomic('padding', 1)
    const swapped = buildAtomicSlotCSS(
      'color',
      [
        {
          property: 'color',
          value: 'red',
          condition: 1,
          identity: 'red',
          selector: '',
          wrappers: ['@media (min-width: 900px)'],
        },
      ],
      'config-swap-probe'
    )!

    expect(initial.rules.join('')).toContain('min-width: 600px')
    expect(swapped.rules.join('')).toContain('min-width: 900px')
    expect(swapped.rules.join('')).not.toContain('min-width: 600px')
  } finally {
    setConfig(current)
  }
})

test('grammar compilation is eager and the content snapshot stays lazy', () => {
  const current = getConfig()
  const next = { ...current } as typeof current
  const reads: Record<string, number> = {}
  for (const key of [
    'media',
    'themes',
    'tokensParsed',
    'fontsParsed',
    'shorthands',
  ] as const) {
    Object.defineProperty(next, key, {
      configurable: true,
      enumerable: true,
      get() {
        reads[key] = (reads[key] || 0) + 1
        return current[key]
      },
    })
  }

  setConfig(next)

  expect(reads).toEqual({
    media: 1,
    themes: 1,
  })

  getConfigRevisionSnapshot(next)

  expect(reads).toEqual({
    media: 2,
    themes: 2,
    tokensParsed: 1,
    fontsParsed: 1,
    shorthands: 1,
  })
  getConfigRevisionSnapshot(next)
  expect(reads).toEqual({
    media: 2,
    themes: 2,
    tokensParsed: 1,
    fontsParsed: 1,
    shorthands: 1,
  })
})

test('the shared symbol owns one eager revision for a theme batch', () => {
  const current = getConfig()
  const before = getConfigRevisionState(current).revision

  mutateThemes({
    insertCSS: false,
    themes: [
      { name: 'batchOne', theme: { background: 'red' } },
      { name: 'batchTwo', theme: { background: 'blue' } },
    ],
  })

  expect(Object.getOwnPropertySymbols(current)).toContain(
    Symbol.for('tamagui.configRevision')
  )
  expect((current as any)[configRevisionSymbol].revision).toBe(before + 1)
})

test('inserting a font refreshes the grammar snapshot once', () => {
  const current = getConfig()
  const before = getConfigRevisionState(current)
  const beforeSnapshot = getConfigRevisionSnapshot(current)

  insertFont('revisionFont', {
    family: 'Revision Font',
    size: { 1: 12 },
    lineHeight: { 1: 16 },
    weight: { 4: '400' },
    letterSpacing: { 1: 0 },
    face: {},
  })

  const after = getConfigRevisionState(current)
  expect(after.revision).toBe(before.revision + 1)
  expect(getConfigRevisionSnapshot(current).parts.fonts).not.toBe(
    beforeSnapshot.parts.fonts
  )
})
