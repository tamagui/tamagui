import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  createTamagui,
  getCSSStylesAtomic,
} from '../core/src'

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

test(`numeric lineHeight should not get px appended`, () => {
  const out = getCSSStylesAtomic({
    lineHeight: 1.15,
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toContain('line-height:1.15')
  expect(rule).not.toContain('line-height:1.15px')
})

test(`integer lineHeight should not get px appended`, () => {
  const out = getCSSStylesAtomic({
    lineHeight: 2,
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toContain('line-height:2')
  expect(rule).not.toContain('line-height:2px')
})

test(`string percentage lineHeight passes through unchanged`, () => {
  const out = getCSSStylesAtomic({
    lineHeight: '150%',
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toContain('line-height:150%')
})

test(`opacity remains unitless (regression guard)`, () => {
  const out = getCSSStylesAtomic({
    opacity: 0.5,
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toContain('opacity:0.5')
  expect(rule).not.toContain('opacity:0.5px')
})

test(`fontSize still gets px appended (regression guard)`, () => {
  const out = getCSSStylesAtomic({
    fontSize: 16,
  })
  const rule = out[0][StyleObjectRules][0]
  expect(rule).toContain('font-size:16px')
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
