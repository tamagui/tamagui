import { beforeAll, expect, test } from 'vitest'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'

import config from '../config-default'
import { createTamagui, getCSSStylesAtomic } from '../web/src'
import { expandStyle } from '../web/src/helpers/expandStyle'
import { normalizeValueWithProperty } from '../web/src/helpers/normalizeValueWithProperty'

type StyleCompat = 'legacy' | 'react-native' | 'web'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

function setStyleCompat(styleCompat: StyleCompat) {
  const next = config.getDefaultTamaguiConfig()
  createTamagui({
    ...next,
    settings: {
      ...next.settings,
      styleCompat,
    },
  })
}

test(`should expand webkit user-select`, () => {
  expect(
    getCSSStylesAtomic({
      // @ts-ignore
      userSelect: 'none',
    })
  ).toMatchInlineSnapshot(`
    [
      [
        "userSelect",
        "none",
        "_ussel-none",
        undefined,
        [
          ":root ._ussel-none{user-select:none;-webkit-user-select:none;}",
        ],
      ],
    ]
  `)
})

test(`should handle decimal placement differently`, () => {
  const out = getCSSStylesAtomic({
    left: 1.11,
    right: 11.1,
  })

  expect(out[0][StyleObjectIdentifier]).toBe(`_l-1--11px`)
  expect(out[1][StyleObjectIdentifier]).toBe(`_r-11--1px`)
})

test(`should turn columnGap into gap-column`, () => {
  const out = getCSSStylesAtomic({
    columnGap: 10,
  })
  expect(out[0][StyleObjectRules].includes(`column-gap:10px`))
})

test(`longhand border props get doubled selector for specificity`, () => {
  const out = getCSSStylesAtomic({
    borderTopWidth: 2,
  })
  const rule = out[0][StyleObjectRules][0]
  // should have .cls.cls (doubled) for higher specificity over shorthand
  expect(rule).toMatch(/\._[^\s]+\._[^\s]+\{/)
  expect(rule).toContain('border-top-width:2px')
})

test(`shorthand border prop gets single selector`, () => {
  const out = getCSSStylesAtomic({
    // @ts-ignore
    border: '1px solid red',
  })
  const rule = out[0][StyleObjectRules][0]
  // should have single .cls selector
  expect(rule).toMatch(/:root \._[^\s.]+\{/)
})

test(`outline longhands get doubled selector`, () => {
  const out = getCSSStylesAtomic({
    outlineWidth: 2,
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toMatch(/\._[^\s]+\._[^\s]+\{/)
})

test(`styleCompat expands flex in legacy mode`, () => {
  setStyleCompat('legacy')

  expect(expandStyle('flex', 1)).toEqual([
    ['flexGrow', 1],
    ['flexShrink', 1],
    ['flexBasis', 'auto'],
  ])
})

test(`styleCompat expands flex in react-native mode`, () => {
  setStyleCompat('react-native')

  expect(expandStyle('flex', 1)).toEqual([
    ['flexGrow', 1],
    ['flexShrink', 0],
    ['flexBasis', 0],
  ])
  expect(expandStyle('flex', 0)).toEqual([
    ['flexGrow', 0],
    ['flexShrink', 0],
    ['flexBasis', 'auto'],
  ])
  expect(expandStyle('flex', -2)).toEqual([
    ['flexGrow', 0],
    ['flexShrink', 2],
    ['flexBasis', 'auto'],
  ])
})

test(`styleCompat expands flex in web mode`, () => {
  setStyleCompat('web')

  expect(expandStyle('flex', 1)).toEqual([
    ['flexGrow', 1],
    ['flexShrink', 1],
    ['flexBasis', 0],
  ])
  expect(expandStyle('flex', -2)).toEqual([['flex', -2]])
})

test(`styleCompat preserves special and string flex values`, () => {
  for (const styleCompat of ['legacy', 'react-native', 'web'] as const) {
    setStyleCompat(styleCompat)
    expect(expandStyle('flex', -1)).toEqual([
      ['flexGrow', 0],
      ['flexShrink', 1],
      ['flexBasis', 'auto'],
    ])
    expect(expandStyle('flex', 'unset')).toEqual([['flex', 'unset']])
  }
})

test(`styleCompat controls numeric lineHeight normalization on web`, () => {
  setStyleCompat('react-native')
  expect(normalizeValueWithProperty(24, 'lineHeight')).toBe('24px')
  expect(normalizeValueWithProperty(1.2, 'lineHeight')).toBe('1.2px')

  let out = getCSSStylesAtomic({
    lineHeight: 1.2,
  })
  expect(out[0][1]).toBe('1.2px')
  expect(out[0][StyleObjectRules][0]).toContain('line-height:1.2px')

  setStyleCompat('web')
  expect(normalizeValueWithProperty(24, 'lineHeight')).toBe(24)
  expect(normalizeValueWithProperty(1.2, 'lineHeight')).toBe(1.2)

  out = getCSSStylesAtomic({
    lineHeight: 1.2,
  })
  expect(out[0][1]).toBe(1.2)
  expect(out[0][StyleObjectRules][0]).toContain('line-height:1.2')
})

test(`styleCompat lineHeight keeps strings and unrelated numeric behavior`, () => {
  for (const styleCompat of ['legacy', 'react-native', 'web'] as const) {
    setStyleCompat(styleCompat)
    expect(normalizeValueWithProperty('150%', 'lineHeight')).toBe('150%')
    expect(normalizeValueWithProperty('24px', 'lineHeight')).toBe('24px')
    expect(normalizeValueWithProperty(0.5, 'opacity')).toBe(0.5)
    expect(normalizeValueWithProperty(24, 'fontSize')).toBe('24px')
  }
})

// test(`should be fast`, () => {
//   // need to compare it in a cpu-insensitive way, so compare to common operations

//   const start0 = performance.now()

//   function baseline() {
//     return new Array().fill(1000).map(() => {
//       return [...new Set([`${Math.random() * Math.random() * Math.random()}`])]
//     })
//   }

//   for (let i = 0; i < 100; i++) {
//     baseline()
//   }

//   const end0 = performance.now() - start0

//   console.log('end0', end0)

//   const start = performance.now()

//   function run() {
//     getCSSStylesAtomic({
//       backgroundColor: 'red',
//       width: 100,
//       height: 200,
//       scale: 2,

//       $gtLg: {
//         backgroundColor: 'green',
//       },

//       hoverStyle: {
//         margin: 20,
//         padding: 20,
//       },
//     })
//   }

//   for (let i = 0; i < 100; i++) {
//     run()
//   }

//   console.log('took', performance.now() - start)
// })
