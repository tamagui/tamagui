import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  createTamagui,
  getCSSStylesAtomic,
} from '../core/src'
import { expandStyle } from '../web/src/helpers/expandStyle'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

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

describe('flex expansion', () => {
  const toMap = (result: ReturnType<typeof expandStyle>) =>
    Object.fromEntries(result as [string, any][])

  describe('default config (no styleCompat)', () => {
    beforeAll(() => {
      createTamagui(config.getDefaultTamaguiConfig())
    })

    test('flex: 1 expands with flexShrink: 0, flexGrow: 1, flexBasis: 0', () => {
      const map = toMap(expandStyle('flex', 1))
      expect(map.flexShrink).toBe(0)
      expect(map.flexGrow).toBe(1)
      expect(map.flexBasis).toBe(0)
    })
  })

  describe('styleCompat: react-native', () => {
    beforeAll(() => {
      createTamagui({
        ...config.getDefaultTamaguiConfig(),
        settings: { styleCompat: 'react-native' },
      })
    })

    test('flex: 1 expands with flexShrink: 0', () => {
      const map = toMap(expandStyle('flex', 1))
      expect(map.flexShrink).toBe(0)
    })
  })

  describe('styleCompat: legacy', () => {
    beforeAll(() => {
      createTamagui({
        ...config.getDefaultTamaguiConfig(),
        settings: { styleCompat: 'legacy' },
      })
    })

    test('flex: 1 expands with flexShrink: 1 and flexBasis: auto', () => {
      const map = toMap(expandStyle('flex', 1))
      expect(map.flexShrink).toBe(1)
      expect(map.flexBasis).toBe('auto')
    })
  })

  describe('flex: -1 special case', () => {
    beforeAll(() => {
      createTamagui(config.getDefaultTamaguiConfig())
    })

    test('flex: -1 always expands to flexShrink: 1, flexGrow: 0, flexBasis: auto', () => {
      const map = toMap(expandStyle('flex', -1))
      expect(map.flexShrink).toBe(1)
      expect(map.flexGrow).toBe(0)
      expect(map.flexBasis).toBe('auto')
    })
  })
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
